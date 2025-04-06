import { Injectable, BadRequestException } from '@nestjs/common';
import { VehiclesService } from '../vehicles/vehicles.service';
import { IncidentsService } from '../incidents/incidents.service';
import { AccessLogsService } from '../access_logs/access-logs.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly incidentsService: IncidentsService,
    private readonly accessLogsService: AccessLogsService,
  ) {}

  async getStats(month: number) {
    if (!month || month < 1 || month > 12) {
      throw new BadRequestException('Invalid month');
    }
    const totalVehicles = await this.vehiclesService.countVehicles(month);
    const totalIncidents = await this.incidentsService.countIncidents(month);

    const prevVehicles = await this.vehiclesService.countVehicles(month - 1);
    const prevIncidents = await this.incidentsService.countIncidents(month - 1);

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
    if (prev === 0) return [100, 'up'];
    const percentage = ((current - prev) / prev) * 100;
    return [Math.abs(percentage), percentage > 0 ? 'up' : 'down'];
  }

  async getAccessLogsByMonth(month: number, year?: number) {
    return this.accessLogsService.getVehicleEntriesByDay(month, year);
  }
}
