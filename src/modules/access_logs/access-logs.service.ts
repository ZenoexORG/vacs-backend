import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PaginationService } from 'src/shared/services/pagination.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { getMonthRange } from '../../shared/utils/date.utils';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { AccessLog } from './entities/access-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class AccessLogsService {
  constructor(
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,    
    private readonly paginationService: PaginationService,
  ) {}

  async create(createAccessLogDto: CreateAccessLogDto) {
    const existingOpenLog = await this.accessLogRepository.findOne({
      where: { vehicle_id: createAccessLogDto.vehicle_id, exit_date: IsNull() },
    });
    if (existingOpenLog) {
      throw new BadRequestException('Vehicle already has an open access log');
    }
    const entryDate = new Date(createAccessLogDto.entry_date);
    if (isNaN(entryDate.getTime())) {
      throw new BadRequestException('Entry date is not a valid date');
    }
    return this.accessLogRepository.save(createAccessLogDto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page , limit } = paginationDto;
    
    const result = await this.paginationService.paginate(
      this.accessLogRepository,
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        order: { id: 'ASC' },
      },
    );   
    const enrichedLogs = await this.enrichAccessLogs(result.data);
    return {
      data: enrichedLogs,
      meta: result.meta,
    };
  }

  async findOne(id: number) {
    const accessLog = await this.accessLogRepository.findOne({ where: { id } });
    if (!accessLog) {
      throw new NotFoundException('Access log not found');
    }
    return accessLog;
  }

  async update(id: number, updateAccessLogDto: UpdateAccessLogDto) {
    const accessLog = await this.accessLogRepository.findOne({ where: { id } });
    if (!accessLog) {
      throw new NotFoundException('Access log not found');
    }
    return this.accessLogRepository.update(id, updateAccessLogDto);
  }

  async remove(id: number) {
    const accessLog = await this.accessLogRepository.findOne({ where: { id } });
    if (!accessLog) {
      throw new NotFoundException('Access log not found');
    }
    return this.accessLogRepository.delete(id);
  }

  async registerEntryOrExit(vehicle_id: string, timestamp: string) {
    if (!vehicle_id) {
      throw new BadRequestException('Vehicle ID is required');
    }
    if (!timestamp) {
      throw new BadRequestException('Timestamp is required');
    }
    if (!this.validateColombianLicensePlate(vehicle_id)) {
      throw new BadRequestException('Invalid Colombian license plate format');
    }
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicle_id },
      relations: ['type'],
    });

    const latestAccessLog = await this.accessLogRepository.findOne({
      where: { vehicle_id },
      order: { entry_date: 'DESC' },
    });

    const newTimestamp = moment(timestamp)
    const now = moment();

    if (!newTimestamp.isValid()) {
      throw new BadRequestException('Invalid date format. Expected format ISO 8601 format');
    }
    if (newTimestamp.isAfter(now)) {
      throw new BadRequestException('Timestamp cannot be in the future');
    }
    const oneWeekAgo = moment().subtract(1, 'weeks');
    if (newTimestamp.isBefore(oneWeekAgo)) {
      throw new BadRequestException('Timestamp cannot be older than one week');
    }
        
    if (latestAccessLog && !latestAccessLog.exit_date) {
      const entryDate = moment(latestAccessLog.entry_date);
      if (newTimestamp.isBefore(entryDate)) {
        throw new BadRequestException('Exit date cannot be before entry date');
      }      
      return this.update(latestAccessLog.id, {
        exit_date: newTimestamp.toDate(),
      });
    } else {
      return this.accessLogRepository.save({
        vehicle_id,
        entry_date: newTimestamp.toDate(),
        vehicle_type: vehicle?.type?.name || 'Unregistered',
      })
    }
  }

  async getVehicleEntriesByDay(month: number, year?: number) {
    const { start, end } = getMonthRange(month, year);
    const result = await this.accessLogRepository
      .createQueryBuilder('log')
      .select([
        "TO_CHAR(log.entry_date, 'MON DD') AS date",
        'COUNT(log.id) AS total',
      ])
      .where('log.entry_date BETWEEN :start AND :end', { start, end })
      .groupBy('date')
      .orderBy('date')
      .getRawMany();

      const today = moment();
      const isCurrentMonth = today.month() + 1 === month && (!year || today.year() === year);
      const daysToInclude = isCurrentMonth ? today.date() : moment(start).daysInMonth();      
      const fullMonth = Array.from({ length: daysToInclude }, (_, i) => {
        const date = moment(start).date(i + 1).format('MMM DD').toUpperCase();
        const found = result.find(r => r.date === date);
        return { date, total: found ? parseInt(found.total) : 0 };
      });
    
      return fullMonth;
  }

  async countVehiclesByMonth(month: number, year?: number) {    
    const { start, end } = getMonthRange(month, year);    
    const result = await this.accessLogRepository
      .createQueryBuilder('log')
      .select('COUNT(DISTINCT log.vehicle_id)', 'total')
      .where('log.entry_date BETWEEN :start AND :end', { start, end })
      .getRawOne();
    return parseInt(result?.total) || 0;
  }

  private async enrichAccessLogs(accessLogs: AccessLog[]) {
    const vehicleIds = [...new Set(accessLogs.map((log) => log.vehicle_id))];
    const vehicles = await this.vehicleRepository.find({
      where: { id: In(vehicleIds) },
      relations: ['type'],
      select: ['id', 'type', 'owner_id'],
    });
    const vehicleMap = new Map(
      vehicles.map((vehicle) => [vehicle.id, vehicle]),
    );
    return accessLogs.map((log) => {
      const vehicle = vehicleMap.get(log.vehicle_id);
      return {
        ...log,
        owner_id: vehicle?.owner_id || null,
      };
    }
    );
  }

  private validateColombianLicensePlate(plateNumber: string): boolean {    
    const plateRegex = /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{4}$/;
    if (!plateRegex.test(plateNumber)) {
      return false;
    }
    return true;
  }
}
