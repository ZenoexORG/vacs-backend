import { Injectable, Logger } from '@nestjs/common';
import { IncidentsService } from '../incidents/incidents.service';
import { AccessLogsService } from '../access_logs/access-logs.service';
import { handleDatabaseError, handleValidationError } from 'src/shared/utils/errors.utils';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly accessLogsService: AccessLogsService,
  ) { }

  async getStats(month: number, year?: number) {
    try {
      if (!month || month < 1 || month > 12) {
        handleValidationError('month', { month }, this.logger);
      }
      if (year && (year < 1900 || year > new Date().getFullYear())) {
        handleValidationError('year', { year }, this.logger);
      }

      const prevMonth = month === 1 ? 12 : month - 1;
      const currentYear = year || new Date().getFullYear();
      const prevYear = month === 1 ? currentYear - 1 : currentYear;

      const [totalEntries, totalIncidents, prevEntries, prevIncidents] = await Promise.all([
        this.accessLogsService.countEntriesByMonth(month, year),
        this.incidentsService.countIncidents(month, year),
        this.accessLogsService.countEntriesByMonth(prevMonth, prevYear),
        this.incidentsService.countIncidents(prevMonth, prevYear),
      ]);

      return {
        entries: {
          value: totalEntries,
          percent: this.calculateGrowth(prevEntries, totalEntries),
        },
        incidents: {
          value: totalIncidents,
          percent: this.calculateGrowth(prevIncidents, totalIncidents),
        },
      };
    } catch (error) {
      handleDatabaseError(
        error,
        'Error fetching dashboard stats',
        { month, year },
        this.logger,
      );
    }
  }

  private calculateGrowth(prev: number, current: number) {
    if (prev === 0 && current === 0) return [0, 'up'];
    if (prev === 0) return [100, 'up'];
    const percentage = ((current - prev) / prev) * 100;
    return [Math.abs(Math.round(percentage * 100) / 100), percentage > 0 ? 'up' : 'down'];
  }

  async getAccessLogsByMonth(month: number, year?: number) {
    return this.accessLogsService.getVehicleEntriesByDay(month, year);
  }
}
