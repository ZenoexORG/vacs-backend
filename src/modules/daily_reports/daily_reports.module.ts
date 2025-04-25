import { Module } from '@nestjs/common';
import { Incident } from '../incidents/entities/incident.entity';
import { AccessLog } from '../access_logs/entities/access-log.entity'
import { VehicleType } from '../vehicle_types/entities/vehicle-type.entity';
import { DailyReport } from './entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './daily_reports.service';
import { ReportController } from './daily_reports.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DailyReport, Incident, AccessLog, VehicleType])],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService]
})
export class ReportModule {}
