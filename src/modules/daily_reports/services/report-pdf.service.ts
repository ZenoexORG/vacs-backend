import { Injectable, Logger } from '@nestjs/common';
import { DailyReport } from '../entities/report.entity';
import { ReportOptionsDto } from '../dto/report-options.dto';
import { ReportChartService } from './report-chart.service';
import { formatReportDate } from 'src/shared/utils/date.utils';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

@Injectable()
export class ReportPdfService {
  private readonly logger = new Logger(ReportPdfService.name);

  constructor(
    private readonly reportChartService: ReportChartService
  ) {}

  async generateSingleReport(report: DailyReport, options?: ReportOptionsDto): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: options?.paperSize || 'A4',
          layout: options?.orientation || 'portrait',
          margin: 50,
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        
        await this.addReportCoverPage(doc, report);
        
        if (options?.includeCharts !== false) {
          await this.addReportCharts(doc, report, options);
        }                        
        
        doc.end();
      } catch (error) {
        this.logger.error(`Error generando reporte PDF: ${error.message}`, error.stack);
        reject(error);
      }
    });
  }

  async generateRangeReport(reports: DailyReport[], options?: ReportOptionsDto): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: options?.paperSize || 'A4',
          layout: options?.orientation || 'portrait',
          margin: 50,
          autoFirstPage: false,
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));  
                
        doc.addPage();
        
        reports.sort((a, b) => {
          const dateA = a.report_date instanceof Date ? a.report_date : new Date(a.report_date);
          const dateB = b.report_date instanceof Date ? b.report_date : new Date(b.report_date);
          return dateA.getTime() - dateB.getTime();
        });
        
        await this.addRangeCoverPage(doc, reports);
                
        if (options?.includeCharts !== false) {
          await this.addRangeCharts(doc, reports, options);
        }              
        doc.end();
      } catch (error) {
        this.logger.error(`Error generando reporte de rango PDF: ${error.message}`, error.stack);
        reject(error);
      }
    });
  }

  private async addReportCoverPage(doc: PDFKit.PDFDocument, report: DailyReport): Promise<void> {    
    const logoPath = './assets/logo.png';
    const logoLargeWidth = 120;
    const logoLargeHeight = 60;
    const logoSmallWidth = 60;
    const logoSmallHeight = 30;
      
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, (doc.page.width - logoLargeWidth) / 2, 50, { 
        width: logoLargeWidth, 
        height: logoLargeHeight 
      });
      doc.moveDown(4);
    }
      
    doc.fontSize(28)
       .font('Helvetica-Bold')
       .fillColor('#2E86C1')
       .text('Reporte Diario', { align: 'center' })
       .moveDown(1);
      
    doc.fontSize(16)
       .font('Helvetica')
       .fillColor('#333333')
       .text(`Fecha del Reporte: ${formatReportDate(report.report_date)}`, { align: 'center' })
       .moveDown(3);
      
    doc.moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .strokeColor('#cccccc')
       .stroke();
    doc.moveDown(3);
      
    const metrics = [
      { label: 'Entradas', value: report.total_entries },
      { label: 'Salidas', value: report.total_exits },
      { label: 'Incidentes', value: report.total_incidents },
      { label: 'Vehículos Activos', value: report.active_vehicles },
      { label: 'Tiempo Prom. (min)', value: report.average_time.toFixed(2) },
    ];
    await this.addMetricsSummary(doc, metrics, '#E3F2FD', '#3498DB');
    doc.moveDown(4);
      
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width - 70, 30, { 
        width: logoSmallWidth, 
        height: logoSmallHeight 
      });
    }
  }
    
  private async addMetricsSummary(doc: PDFKit.PDFDocument, 
    metrics: Array<{ label: string; value: string | number }>,
    fillcolor: string = '#E3F2FD',
    strokeColor: string = '#3498DB',    
  ): Promise<void> {      
    const metricWidth = (doc.page.width - 100) / metrics.length;
    const startY = doc.y;

    metrics.forEach((metric, index) => {
      const x = 50 + index * metricWidth;

      doc.font('Helvetica-Bold')
        .fillOpacity(0.1)
        .roundedRect(x, startY, metricWidth - 10, 60, 8)        
        .fillAndStroke(fillcolor, strokeColor);
      
      doc.fillOpacity(1)
        .fillColor('#444444')
        .fontSize(10)
        .text(metric.label, x + 5, startY + 10, { 
          width: metricWidth - 20, 
          align: 'center' 
        });

      doc.fontSize(18)
        .fillColor('#154360')
        .text(metric.value.toString(), x + 5, startY + 30, { 
          width: metricWidth - 20, 
          align: 'center' 
        });
    })
  }

  private async addReportCharts(doc: PDFKit.PDFDocument, report: DailyReport, options?: ReportOptionsDto): Promise<void> {
    const chartWidth = doc.page.width - 100;
    const chartHeight = 300;
        
    if (options?.includeHourlyData !== false) {
      doc.addPage();
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#2E86C1').text('Actividad Por Hora', { align: 'center' });
      doc.moveDown();
      
      const hours = Array.from({ length: 24 }, (_, i) => i.toString());
      
      try {        
        const hourlyChart = await this.reportChartService.generateChartImage(
          [
            {
              label: 'Entradas',
              data: hours.map(h => report.entries_by_hour?.[h] ?? 0),
              backgroundColor: '#4CAF50',
            },
            {
              label: 'Salidas',
              data: hours.map(h => report.exits_by_hour?.[h] ?? 0),
              backgroundColor: '#2196F3',
            },
            {
              label: 'Incidentes',
              data: hours.map(h => report.incidents_by_hour?.[h] ?? 0),
              backgroundColor: '#F44336',
            },
          ],
          hours.map(h => `${h}:00`),
          'Movimientos por Hora',
          'line',
          {
            xAxisLabel: 'Hora',
            yAxisLabel: 'Cantidad',
            width: chartWidth,
            height: chartHeight,
            devicePixelRatio: 2.5,
            imageFormat: 'png',
            lineWidth: 3,
            pointRadius: 5,
          }
        );
        
        doc.image(hourlyChart, 50, doc.y, { width: chartWidth });
        doc.moveDown(2);
      } catch (error) {
        this.logger.error(`Error generando gráfico de horas: ${error.message}`);
        doc.text('No se pudo generar el gráfico de actividad por hora', { align: 'center' });
      }
    }
        
    if (Object.keys(report.entries_by_type || {}).length > 0) {
      doc.addPage();
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#2E86C1').text('Distribución por Tipo de Vehículo', { align: 'center' });
      doc.moveDown();
      
      try {
        const vehicleTypeChart = await this.reportChartService.generateDistributionChart(
          report.entries_by_type,
          'Distribución de Vehículos',
          'pie',
          {
            width: chartWidth,
            height: chartWidth * 0.75,
            devicePixelRatio: 2.5,
            imageFormat: 'png',
          }
        );
        
        doc.image(vehicleTypeChart, 50, doc.y, { width: chartWidth });
        doc.moveDown(2);
      } catch (error) {
        this.logger.error(`Error generando gráfico de tipos de vehículo: ${error.message}`);
        doc.text('No se pudo generar el gráfico de tipos de vehículo', { align: 'center' });
      }
    }
        
    if (Object.keys(report.incidents_by_type || {}).length > 0) {
      doc.addPage();
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#2E86C1').text('Distribución de Incidentes', { align: 'center' });
      doc.moveDown();
      
      try {
        const incidentTypeChart = await this.reportChartService.generateDistributionChart(
          report.incidents_by_type,
          'Tipos de Incidentes',
          'doughnut',
          {
            width: chartWidth,
            height: chartWidth * 0.75,
            devicePixelRatio: 2.5,
            imageFormat: 'png'            
          }
        );
        
        doc.image(incidentTypeChart, 50, doc.y, { width: chartWidth });
      } catch (error) {
        this.logger.error(`Error generando gráfico de tipos de incidente: ${error.message}`);
        doc.text('No se pudo generar el gráfico de tipos de incidentes', { align: 'center' });
      }
    }
  }
    
  private async addRangeCoverPage(doc: PDFKit.PDFDocument, reports: DailyReport[]): Promise<void> {
    const logoPath = './assets/logo.png';
        
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, (doc.page.width - 120) / 2, 50, { width: 120, height: 60 });
      doc.moveDown(4);
    }
        
    const startDate = reports[0].report_date;
    const endDate = reports[reports.length - 1].report_date;
        
    doc.fontSize(25)
       .font('Helvetica-Bold')
       .fillColor('#2E86C1')
       .text('Reporte de Rango de Fechas', { align: 'center' });
    
    doc.moveDown();
    doc.fontSize(14)
       .font('Helvetica')
       .fillColor('#333333')
       .text(`Período: ${formatReportDate(startDate)} al ${formatReportDate(endDate)}`, { align: 'center' });
    
    doc.moveDown(2);
        
    const totalEntries = reports.reduce((sum, r) => sum + r.total_entries, 0);
    const totalExits = reports.reduce((sum, r) => sum + r.total_exits, 0);
    const totalIncidents = reports.reduce((sum, r) => sum + r.total_incidents, 0);
    const avgActiveVehicles = reports.reduce((sum, r) => sum + r.active_vehicles, 0) / reports.length;
    const avgTime = reports.reduce((sum, r) => sum + r.average_time, 0) / reports.length;
        
    const metrics = [
      { label: 'Total Entradas', value: totalEntries },
      { label: 'Total Salidas', value: totalExits },
      { label: 'Total Incidentes', value: totalIncidents },
      { label: 'Prom. Vehículos', value: avgActiveVehicles.toFixed(2) },
      { label: 'Prom. Tiempo (min)', value: avgTime.toFixed(2) },
    ];
    
    await this.addMetricsSummary(doc, metrics, '#E3F2FD', '#3498DB');
    
    doc.moveDown(2);

    const startX = 50;
    const colWidths = [120, 80, 80, 80, 130];
        
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#2E86C1')
       .text('Resumen por Día', startX, doc.y, { align: 'left' });
    doc.moveDown();        
    
    doc.font('Helvetica-Bold').fontSize(10);
    const currentY = doc.y - doc.currentLineHeight();
    doc.text('Fecha', startX, currentY);
    doc.text('Entradas', startX + colWidths[0],currentY);
    doc.text('Salidas', startX + colWidths[0] + colWidths[1], currentY);
    doc.text('Incidentes', startX + colWidths[0] + colWidths[1] + colWidths[2], currentY);
    doc.text('Tiempo Prom. (min)', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY);
        
    doc.moveDown(0.5);
    doc.moveTo(startX, doc.y).lineTo(startX + colWidths.reduce((a, b) => a + b, 0), doc.y).stroke();
    doc.moveDown(0.5);
        
    doc.font('Helvetica').fontSize(9);
    
    reports.forEach((report, i) => {
      const y = doc.y;
            
      if (i % 2 === 0) {
        doc.rect(startX - 5, y - 2, colWidths.reduce((a, b) => a + b, 0) + 10, 16).fillOpacity(0.05);
      }
      
      doc.fillOpacity(1).fillColor('#000');
      doc.text(formatReportDate(report.report_date), startX, y);
      doc.text(report.total_entries.toString(), startX + colWidths[0], y);
      doc.text(report.total_exits.toString(), startX + colWidths[0] + colWidths[1], y);
      doc.text(report.total_incidents.toString(), startX + colWidths[0] + colWidths[1] + colWidths[2], y);
      doc.text(report.average_time.toFixed(2), startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y);
      
      doc.moveDown();
            
      if (doc.y > doc.page.height - 100 && i < reports.length - 1) {
        doc.addPage();
        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('Fecha', startX, 50);
        doc.text('Entradas', startX + colWidths[0], 50);
        doc.text('Salidas', startX + colWidths[0] + colWidths[1], 50);
        doc.text('Incidentes', startX + colWidths[0] + colWidths[1] + colWidths[2], 50);
        doc.text('Tiempo Prom.', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], 50);
        
        doc.moveDown(0.5);
        doc.moveTo(startX, doc.y).lineTo(startX + colWidths.reduce((a, b) => a + b, 0), doc.y).stroke();
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(9);
      }
    });
  }

  private async addRangeCharts(doc: PDFKit.PDFDocument, reports: DailyReport[], options?: ReportOptionsDto): Promise<void> {
    const chartWidth = doc.page.width - 100;
    const chartHeight = 300;
    
    doc.addPage();
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#2E86C1').text('Tendencia en el Período', { align: 'center' });
    doc.moveDown();
    
    try {      
      const timeSeriesData = reports.map(report => ({
        date: report.report_date,
        entries: report.total_entries,
        exits: report.total_exits,
        incidents: report.total_incidents
      }));
      
      const trendChart = await this.reportChartService.generateTimeSeriesChart(
        [
          {
            label: 'Entradas',
            data: timeSeriesData.map(item => ({ date: item.date, value: item.entries })),
            color: '#4CAF50'
          },
          {
            label: 'Salidas',
            data: timeSeriesData.map(item => ({ date: item.date, value: item.exits })),
            color: '#2196F3'
          },
          {
            label: 'Incidentes',
            data: timeSeriesData.map(item => ({ date: item.date, value: item.incidents })),
            color: '#F44336'
          }
        ],
        'Tendencia de Actividad',
        {
          xAxisLabel: 'Fecha',
          yAxisLabel: 'Cantidad',
          width: chartWidth,
          height: chartHeight,
          devicePixelRatio: 2.5,
          imageFormat: 'png'
        }
      );
      
      doc.image(trendChart, 50, doc.y, { width: chartWidth });
      doc.moveDown(2);
    } catch (error) {
      this.logger.error(`Error generando gráfico de tendencia: ${error.message}`);
      doc.text('No se pudo generar el gráfico de tendencia', { align: 'center' });
    }
        
    if (options?.includeHourlyData !== false) {
      doc.addPage();
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#2E86C1').text('Distribución Horaria Consolidada', { align: 'center' });
      doc.moveDown();
      
      try {        
        const hourlyData = Array(24).fill(0);
        reports.forEach(report => {
          Object.entries(report.entries_by_hour || {}).forEach(([hour, count]) => {
            hourlyData[parseInt(hour)] += count;
          });
        });
                
        const hourlyChart = await this.reportChartService.generateChartImage(
          [
            {
              label: 'Actividad',
              data: hourlyData,
              backgroundColor: '#4CAF50',
            }
          ],
          Array.from({ length: 24 }, (_, i) => `${i}:00`),
          'Distribución de Actividad por Hora',
          'bar',
          {
            xAxisLabel: 'Hora',
            yAxisLabel: 'Cantidad Total',
            width: chartWidth,
            height: chartHeight
          }
        );
        
        doc.image(hourlyChart, 50, doc.y, { width: chartWidth });
        doc.moveDown(2);
      } catch (error) {
        this.logger.error(`Error generando gráfico de distribución horaria: ${error.message}`);
        doc.text('No se pudo generar el gráfico de distribución horaria', { align: 'center' });
      }
    }
        
    try {      
      const vehicleTypes = {};
      reports.forEach(report => {
        Object.entries(report.entries_by_type || {}).forEach(([type, count]) => {
          vehicleTypes[type] = (vehicleTypes[type] || 0) + count;
        });
      });
      
      if (Object.keys(vehicleTypes).length > 0) {
        doc.addPage();
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#2E86C1').text('Distribución por Tipo de Vehículo', { align: 'center' });
        doc.moveDown();
        
        const vehicleTypeChart = await this.reportChartService.generateDistributionChart(
          vehicleTypes,
          'Distribución de Vehículos en el Período',
          'pie',
          {
            width: chartWidth,
            height: chartWidth * 0.75,
            devicePixelRatio: 2.5,
            imageFormat: 'png'
          }          
        );
        
        doc.image(vehicleTypeChart, 50, doc.y, { width: chartWidth });
      }
    } catch (error) {
      this.logger.error(`Error generando gráfico de tipos de vehículo: ${error.message}`);
    }
  }
}