import { Module } from '@nestjs/common';
import { Incident } from '../incidents/entities/incident.entity';
import { AccessLog } from '../access_logs/entities/access-log.entity'
import { VehicleType } from '../vehicle_types/entities/vehicle-type.entity';
import { DailyReport } from './entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyReportService } from './services/daily-report.service';
import { ReportDataService } from './services/report-data.service';
import { ReportPdfService } from './services/report-pdf.service';import { ReportChartService } from './services/report-chart.service';
import { ReportController } from './daily_reports.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DailyReport, Incident, AccessLog, VehicleType])],
    controllers: [ReportController],
    providers: [
        DailyReportService,
        ReportDataService,
        ReportPdfService,
        ReportChartService
    ],
    exports: [
        DailyReportService,
        ReportDataService,
        ReportPdfService,
        ReportChartService
    ],
})
export class ReportModule {}
