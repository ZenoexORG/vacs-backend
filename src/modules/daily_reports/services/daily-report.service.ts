import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DailyReport } from "../entities/report.entity";
import { ReportDataService } from "./report-data.service";
import { ReportPdfService } from "./report-pdf.service";
import { getDateRange, formatDate } from "src/shared/utils/date.utils";
import { DateRangeDto } from "../dto/date-range.dto";
import { CreateReportDto } from "../dto/create-report.dto";
import { TimezoneService } from "src/shared/services/timezone.service";


@Injectable()
export class DailyReportService {
  private readonly logger = new Logger(DailyReportService.name);

  constructor(
    @InjectRepository(DailyReport)
    private readonly reportRepository: Repository<DailyReport>,
    private readonly reportDataService: ReportDataService,
    private readonly reportPdfService: ReportPdfService,
    private readonly timezoneService: TimezoneService,
  ) { }

  @Cron('56 23 * * *')
  async dailyReportJob() {
    try {
      const currentDate = this.timezoneService.startOfDay(new Date())!;
      const reportData = await this.reportDataService.getReportData(currentDate);
      await this.createReport(reportData);
      this.logger.log(`Reporte diario generado para la fecha ${formatDate(currentDate)}`);
    } catch (error) {
      this.logger.error(`Error al generar reporte automático: ${error.message}`);
    }
  }

  async getReportAsPdf(date): Promise<Buffer> {
    const report = await this.findReportByDate(date);
    return this.reportPdfService.generateSingleReport(report);
  }

  async getRangeReportAsPdf({ startDate, endDate }: DateRangeDto): Promise<Buffer> {
    const reports = await this.findReportsByDateRange({ startDate, endDate });
    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No se encontraron reportes para el rango: ${formatDate(startDate)} - ${formatDate(endDate)}`);
    }
    return this.reportPdfService.generateRangeReport(reports);
  }

  async createReport(reportData: CreateReportDto, targetDate?: Date): Promise<DailyReport> {
    const date = this.timezoneService.toISOString(targetDate || new Date())!;

    try {
      const existingReport = await this.reportRepository.findOne({
        where: { report_date: date },
      });

      if (existingReport) {
        await this.reportRepository.update(existingReport.id, {
          ...reportData
        });

        return this.reportRepository.findOneOrFail({ where: { id: existingReport.id } });
      }

      const newReport = this.reportRepository.create({
        ...reportData,
        report_date: date,
      });

      return this.reportRepository.save(newReport);
    } catch (error) {
      this.logger.error(`Error al crear/actualizar reporte: ${error.message}`);
      throw error;
    }
  }

  async findAllReports(): Promise<DailyReport[]> {
    return this.reportRepository.find({
      order: { report_date: 'DESC' },
    });
  }

  async findReportByDate(date): Promise<DailyReport> {
    const formattedDate = this.timezoneService.toISOString(date)!;
    const report = await this.reportRepository.findOne({
      where: { report_date: formattedDate },
    });

    if (!report) {
      throw new NotFoundException(`No se encontró reporte para la fecha: ${formatDate(formattedDate)}`);
    }
    return report;
  }

  async findReportsByDateRange({ startDate, endDate }: DateRangeDto): Promise<DailyReport[]> {
    const reports = await this.reportRepository.find({
      where: {
        report_date: Between(startDate, endDate),
      },
      order: { report_date: 'ASC' },
    });

    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No se encontraron reportes para el rango: ${formatDate(startDate)} - ${formatDate(endDate)}`);
    }
    return reports;
  }

  async generateReportForDate(date: Date): Promise<DailyReport> {
    try {
      const reportData = await this.reportDataService.getReportData(date);
      return this.createReport(reportData, date);
    } catch (error) {
      this.logger.error(`Error al generar reporte para fecha ${date}: ${error.message}`);
      throw error;
    }
  }
}