import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DailyReport } from "../entities/report.entity";
import { ReportDataService } from "./report-data.service";
import { ReportPdfService } from "./report-pdf.service";
import { ReportOptionsDto } from "../dto/report-options.dto";
import { getDateRange } from "src/shared/utils/date.utils";
import { DateRangeDto } from "../dto/date-range.dto";
import { CreateReportDto } from "../dto/create-report.dto";
import { DateParamDto } from "../dto/date.dto";

@Injectable()
export class DailyReportService {
  private readonly logger = new Logger(DailyReportService.name);

  constructor(
    @InjectRepository(DailyReport)
    private readonly reportRepository: Repository<DailyReport>,
    private readonly reportDataService: ReportDataService,
    private readonly reportPdfService: ReportPdfService
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async dailyReportJob() {
    try {
      const { base } = getDateRange();
      this.logger.log(`Generando reporte automático para: ${base.toISOString().split('T')[0]}`);
      
      const reportData = await this.reportDataService.getReportData(base);
      const report = await this.createReport(reportData);
      
      this.logger.log(`Reporte generado con éxito. ID: ${report.id}`);
    } catch (error) {
      this.logger.error(`Error al generar reporte automático: ${error.message}`, error.stack);
    }
  }  
  
  async getReportAsPdf(date, options?: ReportOptionsDto): Promise<Buffer> {    
    const report = await this.findReportByDate(date);
    return this.reportPdfService.generateSingleReport(report, options);
  }
  
  async getRangeReportAsPdf({ startDate, endDate } : DateRangeDto, options?: ReportOptionsDto): Promise<Buffer> {
    const reports = await this.findReportsByDateRange({ startDate, endDate });
    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No se encontraron reportes para el rango: ${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`);
    }
    return this.reportPdfService.generateRangeReport(reports, options);
  }

  async createReport(reportData: CreateReportDto, targetDate?: Date): Promise<DailyReport> {
    const reportDate = targetDate || getDateRange().base;
    
    try {
      const existingReport = await this.reportRepository.findOne({
        where: { report_date: reportDate },
      });
      
      if (existingReport) {
        await this.reportRepository.update(existingReport.id, {
          ...reportData
        });
        
        return this.reportRepository.findOneOrFail({ where: { id: existingReport.id } });
      }
      
      const newReport = this.reportRepository.create({
        ...reportData,
        report_date: reportDate,        
      });
      
      return this.reportRepository.save(newReport);
    } catch (error) {
      this.logger.error(`Error al crear/actualizar reporte: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAllReports(): Promise<DailyReport[]> {
    return this.reportRepository.find({
      order: { report_date: 'DESC' },
    });
  }

  async findReportByDate(date): Promise<DailyReport> {    
    const report = await this.reportRepository.findOne({
      where: { report_date: date },
    });
    
    if (!report) {
      throw new NotFoundException(`No se encontró reporte para la fecha: ${date.toISOString().split('T')[0]}`);
    }    
    return report;
  }

  async findReportsByDateRange( {startDate, endDate }: DateRangeDto): Promise<DailyReport[]> {    
    endDate.setDate(endDate.getDate() + 1);        
    const reports = await this.reportRepository.find({
      where: {
        report_date: Between(startDate, endDate),
      },
      order: { report_date: 'ASC' },
    });
    
    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No se encontraron reportes para el rango: ${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`);
    }
    
    return reports;
  }

  async generateReportForDate(date: Date): Promise<DailyReport> {
    try {
      const reportData = await this.reportDataService.getReportData(date);
      return this.createReport(reportData, date);
    } catch (error) {
      this.logger.error(`Error al generar reporte para fecha ${date}: ${error.message}`, error.stack);
      throw error;
    }
  }
}