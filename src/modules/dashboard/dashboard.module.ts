import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { IncidentsModule } from '../incidents/incidents.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { AccessLogsModule } from '../access_logs/access-logs.module';

@Module({
  imports: [IncidentsModule, VehiclesModule, AccessLogsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule {}