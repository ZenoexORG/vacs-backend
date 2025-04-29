import { Injectable, BadRequestException } from '@nestjs/common';
import { IncidentsService } from '../incidents/incidents.service';
import { AccessLogsService } from '../access_logs/access-logs.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly accessLogsService: AccessLogsService,
  ) {}

  async getStats(month: number, year?: number) {
    if (!month || month < 1 || month > 12) {
      throw new BadRequestException('Invalid month');
    }
    if (year && (year < 1900 || year > new Date().getFullYear())) {
      throw new BadRequestException('Invalid year');
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
