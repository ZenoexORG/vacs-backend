import { Injectable, Logger } from '@nestjs/common';
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
import { handleNotFoundError, handleDatabaseError, handleValidationError } from 'src/shared/utils/errors.utils';
import { DwellTimeMonitorService } from '../incidents/dwell-time-monitor.service';


@Injectable()
export class AccessLogsService {
  private readonly logger = new Logger(AccessLogsService.name);
  constructor(
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    private readonly paginationService: PaginationService,
    private readonly notificationsService: NotificationsService,
    private readonly timezoneService: TimezoneService,
    private readonly dwellTimeMonitorService: DwellTimeMonitorService,
  ) { }

  async create(createAccessLogDto: CreateAccessLogDto) {
    try {
      const { vehicle_id, timestamp, access_type } = createAccessLogDto;
      const newTimestamp = this.timezoneService.formatDate(timestamp);
      if (!newTimestamp) handleValidationError('timestamp', { dto: createAccessLogDto }, this.logger);
      const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicle_id }, relations: { type: true } });
      if (access_type === 'entry') {
        return this.handleEntryAccess(vehicle_id, newTimestamp, vehicle ?? undefined);
      } else if (access_type === 'exit') {
        return this.handleExitAccess(vehicle_id, newTimestamp);
      }
      handleValidationError('access_type', { dto: createAccessLogDto }, this.logger);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error creating access log',
        { dto: createAccessLogDto },
        this.logger,
      );
    }
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
    try {
      const accessLog = await this.accessLogRepository.findOne({ where: { id } });
      if (!accessLog) handleNotFoundError('Access log', id, this.logger);
      return accessLog;
    } catch (error) {
      handleDatabaseError(error, 'finding access log', { id }, this.logger);
    }
  }

  async update(id: number, updateAccessLogDto: UpdateAccessLogDto) {
    try {
      const accessLog = await this.accessLogRepository.findOne({ where: { id } });
      if (!accessLog) handleNotFoundError('Access log', id, this.logger);
      return this.accessLogRepository.update(id, updateAccessLogDto);
    } catch (error) {
      handleDatabaseError(
        error,
        'updating access log',
        { id, dto: updateAccessLogDto },
        this.logger,
      );
    }
  }

  async remove(id: number) {
    try {
      const accessLog = await this.accessLogRepository.findOne({ where: { id } });
      if (!accessLog) handleNotFoundError('Access log', id, this.logger);
      return this.accessLogRepository.delete(id);
    } catch (error) {
      handleDatabaseError(
        error,
        'deleting access log',
        { id },
        this.logger,
      );
    }
  }

  async getVehicleEntriesByDay(month: number, year?: number) {
    try {
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
    } catch (error) {
      handleDatabaseError(
        error,
        'Error getting vehicle entries by day',
        { month, year },
        this.logger,
      );
    }
  }

  async countEntriesByMonth(month: number, year?: number) {
    const { start, end } = getMonthRange(month, year);
    const result = await this.accessLogRepository.count({
      where: { entry_date: Between(start, end) },
    });
    return result;
  }

  private async enrichAccessLogs(accessLogs: AccessLog[]) {
    try {
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
    } catch (error) {
      handleDatabaseError(
        error,
        'Error enriching access logs',
        { accessLogs },
        this.logger,
      );
    }
  }

  private async handleEntryAccess(vehicle_id: string, timestamp: Date, vehicle?: Vehicle) {
    try {
      const latestAccessLog = await this.accessLogRepository.findOne({
        where: { vehicle_id, exit_date: IsNull() },
        order: { entry_date: 'DESC' },
      });
      if (latestAccessLog) handleValidationError('Vehicle already has an entry without exit', { vehicle_id, timestamp }, this.logger);
      const newAccessLog = await this.accessLogRepository.save({
        vehicle_id,
        entry_date: timestamp,
        vehicle_type: vehicle?.type?.name || 'unregistered',
      });
      this.notificationsService.notifyVehicle(newAccessLog);
      this.dwellTimeMonitorService.scheduleDwellTimeCheck(newAccessLog);
      return newAccessLog;
    } catch (error) {
      handleDatabaseError(
        error,
        'Error handling entry access',
        { vehicle_id, timestamp },
        this.logger,
      );
    }
  }

  private async handleExitAccess(vehicle_id: string, timestamp: Date) {
    try {
      const latestAccessLog = await this.accessLogRepository.findOne({
        where: { vehicle_id, exit_date: IsNull() },
        order: { entry_date: 'DESC' },
      });
      if (!latestAccessLog) handleNotFoundError('Access log', vehicle_id, this.logger);
      if (timestamp <= latestAccessLog.entry_date) {
        handleValidationError('Exit timestamp must be after entry timestamp', { vehicle_id, timestamp }, this.logger);
      }
      await this.accessLogRepository.update(latestAccessLog.id, {
        exit_date: timestamp,
      });
      const updatedAccessLog = await this.accessLogRepository.findOne({
        where: { id: latestAccessLog.id },
      });
      this.notificationsService.notifyVehicle(updatedAccessLog);
      return updatedAccessLog;
    } catch (error) {
      handleDatabaseError(
        error,
        'Error handling exit access',
        { vehicle_id, timestamp },
        this.logger,
      );
    }
  }
}
