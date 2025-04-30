import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginationService } from 'src/shared/services/pagination.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { getMonthRange } from '../../shared/utils/date.utils';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { AccessLog } from './entities/access-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In, Between } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class AccessLogsService {
  constructor(
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,    
    private readonly paginationService: PaginationService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createAccessLogDto: CreateAccessLogDto) {
    const { vehicle_id, timestamp, access_type } = createAccessLogDto;
    this.validateRequiredFields(vehicle_id, timestamp, access_type);
    if (!this.validateColombianLicensePlate(vehicle_id)) {
      throw new BadRequestException('Invalid vehicle ID format. Expected Colombian license plate format');
    }
    const newTimestamp = this.validateTimestamp(timestamp);
    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicle_id }, relations: {type: true} });
    if (access_type === 'entry'){
      return this.handleEntryAccess(vehicle_id, newTimestamp, vehicle ?? undefined);      
    } else if (access_type === 'exit') {
      return this.handleExitAccess(vehicle_id, newTimestamp);
    }
    throw new BadRequestException('Invalid access type. Expected "entry" or "exit"');    
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

  async getVehicleEntriesByDay(month: number, year?: number) {
    const { start, end } = getMonthRange(month, year);    

    const currentYear = year || moment().year();
    const daysInMonth = moment(`${currentYear}-${month}`, 'YYYY-MM').daysInMonth();    

    const result = await this.accessLogRepository
      .createQueryBuilder('log')
      .select('EXTRACT(DAY FROM log.entry_date)', 'day')
      .addSelect('COUNT(*)', 'total')
      .where('log.entry_date IS NOT NULL')
      .andWhere('log.entry_date BETWEEN :start AND :end', { start, end })
      .groupBy('day')
      .orderBy('day', 'ASC')
      .getRawMany();    
    
    return Array.from({ length: daysInMonth}, (_, i) => {
      const day = i + 1;
      const entry = result.find((entry) => entry.day === day);
      return {
        day,
        total: entry ? parseInt(entry.total, 10) : null,
      };
    })
  }

  async countEntriesByMonth(month: number, year?: number) {    
    const { start, end } = getMonthRange(month, year);
    const result = await this.accessLogRepository.count({
      where: { entry_date: Between(start, end) },
    });
    return result;
  }

  private async enrichAccessLogs(accessLogs: AccessLog[]) {
    const vehicleIds = [...new Set(accessLogs.map((log) => log.vehicle_id))];
    const vehicles = await this.vehicleRepository.find({
      where: { id: In(vehicleIds) },
      relations: ['type'],
      select: ['id', 'type', 'owner_id'],
    });
    const vehicleMap = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
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
    const carPlateRegex = /^[A-Z]{3}\d{3}$/;
    const motorcyclePlateRegex = /^[A-Z]{2}-\d{3}$/;
    const diplomaticPlateRegex = /^(CD|CC|OI)\d{4}$/;
    return carPlateRegex.test(plateNumber) ||
           motorcyclePlateRegex.test(plateNumber) ||
           diplomaticPlateRegex.test(plateNumber);
  }

  private validateRequiredFields(vehicle_id: string, timestamp: Date, access_type: string) {
    if (!vehicle_id) throw new BadRequestException('Vehicle ID is required');
    if (!timestamp) throw new BadRequestException('Timestamp is required');
    if (!access_type) throw new BadRequestException('Access type is required');
  }

  private validateTimestamp(timestamp: Date): moment.Moment {
    const newTimestamp = moment(timestamp);
    const now = moment();
    if (!newTimestamp.isValid()) {
      throw new BadRequestException('Invalid date format. Expected ISO 8601 format');
    }
    if (newTimestamp.isAfter(now)) {
      throw new BadRequestException('Timestamp cannot be in the future');
    }    
    return newTimestamp;
  }

  private async handleEntryAccess(vehicle_id: string, timestamp: moment.Moment, vehicle?: Vehicle) {
    const latestAccessLog = await this.accessLogRepository.findOne({
      where: { vehicle_id, exit_date: IsNull() },
      order: { entry_date: 'DESC' },
    });
    if (latestAccessLog) {
      throw new BadRequestException('Vehicle already has an entry without exit');
    }
    const newAccessLog = await this.accessLogRepository.save({
      vehicle_id,
      entry_date: timestamp.toDate(),
      vehicle_type: vehicle?.type?.name || 'unregistered',
    });
    this.notificationsService.notifyVehicleEntry(newAccessLog);
    return newAccessLog;
  }

  private async handleExitAccess(vehicle_id: string, timestamp: moment.Moment) {
    const latestAccessLog = await this.accessLogRepository.findOne({
      where: { vehicle_id, exit_date: IsNull() },
      order: { entry_date: 'DESC' },
    });
    if (!latestAccessLog) {
      throw new BadRequestException('Vehicle does not have an entry without exit');
    }
    const entryDate = moment(latestAccessLog.entry_date);
    if (timestamp.isBefore(entryDate)) {
      throw new BadRequestException('Exit date cannot be before entry date');
    }
    await this.accessLogRepository.update(latestAccessLog.id, {
      exit_date: timestamp.toDate(),
    });
    const updatedAccessLog = await this.accessLogRepository.findOne({
      where: { id: latestAccessLog.id },
    });
    this.notificationsService.notifyVehicleExit(updatedAccessLog);
    return updatedAccessLog;    
  }
}
