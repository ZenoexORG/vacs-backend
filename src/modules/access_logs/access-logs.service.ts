import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginationService } from 'src/shared/services/pagination.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { getMonthRange, formatDate } from '../../shared/utils/date.utils';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { AccessLog } from './entities/access-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In, Between } from 'typeorm';
import * as moment from 'moment';
import { TimezoneService } from 'src/shared/services/timezone.service';

@Injectable()
export class AccessLogsService {
  constructor(
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    private readonly paginationService: PaginationService,
    private readonly notificationsService: NotificationsService,
    private readonly timezoneService: TimezoneService,
  ) { }

  async create(createAccessLogDto: CreateAccessLogDto) {
    const { vehicle_id, timestamp, access_type } = createAccessLogDto;

    const newTimestamp = this.timezoneService.formatDate(timestamp);

    if (!newTimestamp) {
      throw new BadRequestException('Invalid timestamp format');
    }

    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicle_id }, relations: { type: true } });
    if (access_type === 'entry') {
      return this.handleEntryAccess(vehicle_id, newTimestamp, vehicle ?? undefined);
    } else if (access_type === 'exit') {
      return this.handleExitAccess(vehicle_id, newTimestamp);
    }
    throw new BadRequestException('Invalid access type. Expected "entry" or "exit"');
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const result = await this.paginationService.paginate(
      this.accessLogRepository,
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        order: { id: 'DESC' },
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
      .select('log.entry_date', 'entry_date')
      .addSelect('COUNT(*)', 'total')
      .where('log.entry_date IS NOT NULL')
      .andWhere('log.entry_date BETWEEN :start AND :end', { start, end })
      .groupBy('log.entry_date')
      .orderBy('log.entry_date', 'ASC')
      .getRawMany();

    const daysMap = new Map();
    for (let i = 1; i <= daysInMonth; i++) {
      const day = i.toString().padStart(2, '0');
      daysMap.set(day, null)
    }

    result.forEach((entry) => {
      const day = formatDate(entry.entry_date, 'DD');
      daysMap.set(day, parseInt(entry.total));
    })

    return Array.from(daysMap).map(([day, total]) => ({ day, total }))
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

  private async handleEntryAccess(vehicle_id: string, timestamp: Date, vehicle?: Vehicle) {
    const latestAccessLog = await this.accessLogRepository.findOne({
      where: { vehicle_id, exit_date: IsNull() },
      order: { entry_date: 'DESC' },
    });
    if (latestAccessLog) {
      throw new BadRequestException('Vehicle already has an entry without exit');
    }
    const newAccessLog = await this.accessLogRepository.save({
      vehicle_id,
      entry_date: timestamp,
      vehicle_type: vehicle?.type?.name || 'unregistered',
    });
    this.notificationsService.notifyVehicleEntry(newAccessLog);
    return newAccessLog;
  }

  private async handleExitAccess(vehicle_id: string, timestamp: Date) {
    const latestAccessLog = await this.accessLogRepository.findOne({
      where: { vehicle_id, exit_date: IsNull() },
      order: { entry_date: 'DESC' },
    });
    if (!latestAccessLog) {
      throw new BadRequestException('Vehicle does not have an entry without exit');
    }
    if (timestamp <= latestAccessLog.entry_date) {
      throw new BadRequestException('Exit date must be after entry date');
    }
    await this.accessLogRepository.update(latestAccessLog.id, {
      exit_date: timestamp,
    });
    const updatedAccessLog = await this.accessLogRepository.findOne({
      where: { id: latestAccessLog.id },
    });
    this.notificationsService.notifyVehicleExit(updatedAccessLog);
    return updatedAccessLog;
  }
}
