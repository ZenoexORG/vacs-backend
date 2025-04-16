import { Module } from '@nestjs/common';
import { Incident } from '../incidents/entities/incident.entity';
import { AccessLog } from '../access_logs/entities/access-log.entity'
import { VehicleClass } from '../vehicle_classes/entities/vehicle-class.entity';
import { DailyReport } from './entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './daily_reports.service';
import { ReportController } from './daily_reports.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DailyReport, Incident, AccessLog, VehicleClass])],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService]
})
export class ReportModule {}
