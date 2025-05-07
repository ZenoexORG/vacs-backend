import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AccessLog } from '../../access_logs/entities/access-log.entity';
import { Incident } from '../../incidents/entities/incident.entity';
import { VehicleType } from '../../vehicle_types/entities/vehicle-type.entity';
import { DailyReportData } from '../interfaces/dailyReportData.interface';
import { HourlyData } from '../interfaces/hourlyData.interface';
import { formatDate, getDateRange, normalizeDateToUTC } from 'src/shared/utils/date.utils';
import { hourUtcToLocal, initializeHourlyData } from 'src/shared/utils/hour.utils';
import { DateRangeDto } from '../dto/date-range.dto';

interface DateRange {
  base: Date;
  tomorrow: Date;
}

@Injectable()
export class ReportDataService {
  private readonly logger = new Logger(ReportDataService.name);

  constructor(
    @InjectRepository(AccessLog)
    private readonly accessLogsRepository: Repository<AccessLog>,
    @InjectRepository(Incident)
    private readonly incidentsRepository: Repository<Incident>,
    @InjectRepository(VehicleType)
    private readonly vehicleTypesRepository: Repository<VehicleType>,
  ) { }

  async getReportData(targetDate?: Date): Promise<DailyReportData> {
    try {
      const dateRange = getDateRange(targetDate);

      this.logger.debug(`Generando datos para reporte: ${formatDate(dateRange.base)} - ${formatDate(dateRange.tomorrow)}`);

      const [
        total_entries,
        total_exits,
        total_incidents,
        active_vehicles,
        entries_by_hour,
        exits_by_hour,
        incidents_by_hour,
        entries_by_type,
        incidents_by_type,
        average_time
      ] = await Promise.all([
        this.getTotalEntries(dateRange),
        this.getTotalExits(dateRange),
        this.getTotalIncidents(dateRange),
        this.getActiveVehicles(dateRange),
        this.getEntriesByHour(dateRange),
        this.getExitsByHour(dateRange),
        this.getIncidentsByHour(dateRange),
        this.getEntriesByType(dateRange),
        this.getIncidentsByType(dateRange),
        this.getAverageTime(dateRange)
      ]);

      return {
        total_entries,
        total_exits,
        total_incidents,
        active_vehicles,
        entries_by_hour,
        exits_by_hour,
        incidents_by_hour,
        entries_by_type,
        incidents_by_type,
        average_time,
      };
    } catch (error) {
      this.logger.error(`Error al generar datos de reporte: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async getTotalEntries(dateRange: DateRange = getDateRange()): Promise<number> {
    try {
      const { base, tomorrow } = dateRange;
      return await this.accessLogsRepository.count({
        where: {
          entry_date: Between(base, tomorrow),
        }
      });
    } catch (error) {
      this.logger.warn(`Error al obtener total de entradas: ${error.message}`);
      return 0;
    }
  }

  private async getTotalExits(dateRange: DateRange = getDateRange()): Promise<number> {
    try {
      const { base, tomorrow } = dateRange;
      return await this.accessLogsRepository.count({
        where: {
          exit_date: Between(base, tomorrow),
        }
      });
    } catch (error) {
      this.logger.warn(`Error al obtener total de salidas: ${error.message}`);
      return 0;
    }
  }

  private async getTotalIncidents(dateRange: DateRange = getDateRange()): Promise<number> {
    try {
      const { base, tomorrow } = dateRange;
      return await this.incidentsRepository.count({
        where: {
          incident_date: Between(base, tomorrow),
        }
      });
    } catch (error) {
      this.logger.warn(`Error al obtener total de incidentes: ${error.message}`);
      return 0;
    }
  }

  private async getActiveVehicles(dateRange: DateRange = getDateRange()): Promise<number> {
    try {
      const { base, tomorrow } = dateRange;
      const result = await this.accessLogsRepository
        .createQueryBuilder('accessLog')
        .select('COUNT(DISTINCT accessLog.vehicle_id)', 'count')
        .where('accessLog.entry_date BETWEEN :base AND :tomorrow', { base, tomorrow })
        .getRawOne();
      return result?.count ? parseInt(result.count) : 0;
    } catch (error) {
      this.logger.warn(`Error al obtener vehículos activos: ${error.message}`);
      return 0;
    }
  }

  private async getEntriesByHour(dateRange: DateRange = getDateRange()): Promise<HourlyData> {
    try {
      const { base, tomorrow } = dateRange;
      const hourlyData = initializeHourlyData();

      const entriesByHour = await this.accessLogsRepository
        .createQueryBuilder('accessLog')
        .select('EXTRACT(HOUR FROM accessLog.entry_date)', 'hour')
        .addSelect('COUNT(*)', 'count')
        .where('accessLog.entry_date BETWEEN :base AND :tomorrow', { base, tomorrow })
        .groupBy('hour')
        .getRawMany();

      entriesByHour.forEach(entry => {
        const utcHour = parseInt(entry.hour, 10);
        const localHour = hourUtcToLocal(utcHour);
        hourlyData[localHour] = parseInt(entry.count);
      });
      return hourlyData;
    } catch (error) {
      this.logger.warn(`Error al obtener entradas por hora: ${error.message}`);
      return initializeHourlyData();
    }
  }

  private async getExitsByHour(dateRange: DateRange = getDateRange()): Promise<HourlyData> {
    try {
      const { base, tomorrow } = dateRange;
      const hourlyData = initializeHourlyData();

      const exitsByHour = await this.accessLogsRepository
        .createQueryBuilder('accessLog')
        .select('EXTRACT(HOUR FROM accessLog.exit_date)', 'hour')
        .addSelect('COUNT(*)', 'count')
        .where('accessLog.exit_date BETWEEN :base AND :tomorrow', { base, tomorrow })
        .groupBy('hour')
        .getRawMany();

      exitsByHour.forEach(entry => {
        const localHour = hourUtcToLocal(parseInt(entry.hour, 10));
        hourlyData[localHour] = parseInt(entry.count);
      });
      return hourlyData;
    } catch (error) {
      this.logger.warn(`Error al obtener salidas por hora: ${error.message}`);
      return initializeHourlyData();
    }
  }

  private async getIncidentsByHour(dateRange: DateRange = getDateRange()): Promise<HourlyData> {
    try {
      const { base, tomorrow } = dateRange;
      const hourlyData = initializeHourlyData();

      const incidentsByHour = await this.incidentsRepository
        .createQueryBuilder('incident')
        .select('EXTRACT(HOUR FROM incident.incident_date)', 'hour')
        .addSelect('COUNT(*)', 'count')
        .where('incident.incident_date BETWEEN :base AND :tomorrow', { base, tomorrow })
        .groupBy('hour')
        .getRawMany();

      incidentsByHour.forEach(entry => {
        const localHour = hourUtcToLocal(parseInt(entry.hour, 10));
        hourlyData[localHour] = parseInt(entry.count);
      });
      return hourlyData;
    } catch (error) {
      this.logger.warn(`Error al obtener incidentes por hora: ${error.message}`);
      return initializeHourlyData();
    }
  }

  private async getEntriesByType(dateRange: DateRange = getDateRange()): Promise<HourlyData> {
    try {
      const { base, tomorrow } = dateRange;
      const typeData = await this.initializeByTypeData();

      const entriesByType = await this.accessLogsRepository
        .createQueryBuilder('accessLog')
        .select('accessLog.vehicle_type', 'type')
        .addSelect('COUNT(*)', 'count')
        .where('accessLog.entry_date BETWEEN :base AND :tomorrow', { base, tomorrow })
        .groupBy('accessLog.vehicle_type')
        .getRawMany();

      entriesByType.forEach(entry => {
        typeData[entry.type] = parseInt(entry.count);
      });
      return typeData;
    } catch (error) {
      this.logger.warn(`Error al obtener entradas por tipo: ${error.message}`);
      return {};
    }
  }

  private async getIncidentsByType(dateRange: DateRange = getDateRange()): Promise<HourlyData> {
    try {
      const { base, tomorrow } = dateRange;
      const typeData = await this.initializeByTypeData();

      const incidentsByType = await this.incidentsRepository
        .createQueryBuilder('incident')
        .leftJoin('vehicles', 'vehicle', 'incident.vehicle_id = vehicle.id')
        .leftJoin('vehicle_types', 'VehicleType', 'vehicle.type_id = VehicleType.id')
        .select('COALESCE(VehicleType.name, \'Sin Registrar\')', 'type')
        .addSelect('COUNT(*)', 'count')
        .where('incident.incident_date BETWEEN :base AND :tomorrow', { base, tomorrow })
        .groupBy('COALESCE(VehicleType.name, \'Sin Registrar\')')
        .getRawMany();

      incidentsByType.forEach(entry => {
        typeData[entry.type] = parseInt(entry.count);
      });
      return typeData;
    } catch (error) {
      this.logger.warn(`Error al obtener incidentes por tipo: ${error.message}`);
      return {};
    }
  }

  private async initializeByTypeData(): Promise<HourlyData> {
    try {
      const vehicleTypes = await this.vehicleTypesRepository.find();
      return vehicleTypes.reduce((acc, vehicleType) => {
        acc[vehicleType.name] = 0;
        return acc;
      }, {} as HourlyData);
    } catch (error) {
      this.logger.warn(`Error al inicializar datos por tipo: ${error.message}`);
      return {};
    }
  }

  private async getAverageTime(dateRange: DateRange = getDateRange()): Promise<number> {
    try {
      const { base, tomorrow } = dateRange;

      const averageTime = await this.accessLogsRepository
        .createQueryBuilder('accessLog')
        .select('AVG(EXTRACT(EPOCH FROM (accessLog.exit_date - accessLog.entry_date)) / 60)', 'avg_time')
        .where('accessLog.entry_date BETWEEN :base AND :tomorrow', { base, tomorrow })
        .andWhere('accessLog.exit_date IS NOT NULL')
        .getRawOne();

      return averageTime?.avg_time ? parseFloat(averageTime.avg_time) : 0;
    } catch (error) {
      this.logger.warn(`Error al obtener tiempo promedio: ${error.message}`);
      return 0;
    }
  }

  async getPeakHours(dateRange?: DateRange): Promise<Record<string, any>> {
    try {
      const range = dateRange || getDateRange();
      const [entriesByHour, exitsByHour] = await Promise.all([
        this.getEntriesByHour(range),
        this.getExitsByHour(range)
      ]);

      let maxEntries = 0;
      let peakEntryHour = 0;
      Object.entries(entriesByHour).forEach(([hour, count]) => {
        if (count > maxEntries) {
          maxEntries = count;
          peakEntryHour = parseInt(hour);
        }
      });

      let maxExits = 0;
      let peakExitHour = 0;
      Object.entries(exitsByHour).forEach(([hour, count]) => {
        if (count > maxExits) {
          maxExits = count;
          peakExitHour = parseInt(hour);
        }
      });

      return {
        peakEntryHour: {
          hour: peakEntryHour,
          count: maxEntries
        },
        peakExitHour: {
          hour: peakExitHour,
          count: maxExits
        }
      };
    } catch (error) {
      this.logger.warn(`Error al obtener horas pico: ${error.message}`);
      return {
        peakEntryHour: { hour: 0, count: 0 },
        peakExitHour: { hour: 0, count: 0 }
      };
    }
  }
}