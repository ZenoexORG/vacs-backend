import { Injectable, BadRequestException } from '@nestjs/common';
import { VehiclesService } from '../vehicles/vehicles.service';
import { IncidentsService } from '../incidents/incidents.service';
import { AccessLogsService } from '../access_logs/access-logs.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly accessLogsService: AccessLogsService,
  ) {}

  async getStats(month: number) {
    if (!month || month < 1 || month > 12) {
      throw new BadRequestException('Invalid month');
    }    
    
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? new Date().getFullYear() - 1 : new Date().getFullYear();

    const totalVehicles = await this.accessLogsService.countVehiclesByMonth(month);
    const totalIncidents = await this.incidentsService.countIncidents(month);

    const prevVehicles = await this.accessLogsService.countVehiclesByMonth(prevMonth, prevYear);
    const prevIncidents = await this.incidentsService.countIncidents(prevMonth, prevYear);

    return {
      vehicles: {
        value: totalVehicles,
        percent: this.calculateGrowth(prevVehicles, totalVehicles),
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
    return [Math.abs(percentage), percentage > 0 ? 'up' : 'down'];
  }

  async getAccessLogsByMonth(month: number, year?: number) {
    return this.accessLogsService.getVehicleEntriesByDay(month, year);
  }
}
