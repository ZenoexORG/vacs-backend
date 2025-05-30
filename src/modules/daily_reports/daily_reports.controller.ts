import { Controller, Get, Post, Query, Param, NotFoundException, Res, BadRequestException } from '@nestjs/common';
import { ConvertDates } from 'src/shared/decorators/date-conversion.decorator';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { DailyReportService } from './services/daily-report.service';
import { DateRangeDto } from "./dto/date-range.dto";
import { ReportDto } from './dto/report.dto';
import { DateParamDto } from './dto/date.dto';
import { Auth } from 'src/shared/decorators/permissions.decorator';
import { AppPermissions } from 'src/shared/enums/permissions.enum';
import { formatDate } from 'src/shared/utils/date.utils';


@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: DailyReportService) { }

  @ApiOperation({ summary: 'Get consolidated report data for a date range' })
  @ApiResponse({ status: 200, description: 'Consolidated report data retrieved successfully.' })
  @ApiQuery({ name: 'startDate', description: 'Start date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'endDate', description: 'End date in YYYY-MM-DD format' })
  @Auth(AppPermissions.REPORTS_VIEW)
  @Get('range')
  @ConvertDates(['generated_at', 'updated_at'])
  async getReportsForRange(@Query() dateRange: DateRangeDto): Promise<ReportDto[]> {
    if (dateRange.startDate > dateRange.endDate) {
      throw new BadRequestException('Start date must be before or equal to end date');
    }
    return this.reportService.findReportsByDateRange(dateRange);
  }

  @ApiOperation({ summary: 'Get PDF report by date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date of the report in YYYY-MM-DD format' })
  @ApiQuery({ name: 'endDate', description: 'End date of the report in YYYY-MM-DD format' })
  @ApiResponse({ status: 200, description: 'PDF report retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @Auth(AppPermissions.REPORTS_CREATE)
  @Get('range/pdf')
  async getPdfReportByRange(
    @Query() DateRange: DateRangeDto,
    @Res() res: Response
  ) {
    const { startDate, endDate } = DateRange;

    const pdfBuffer = await this.reportService.getRangeReportAsPdf({ startDate, endDate });
    const filename = `report-${formatDate(startDate)}-${formatDate(endDate)}.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @ApiOperation({ summary: 'Get PDF report by date' })
  @ApiResponse({ status: 200, description: 'PDF report retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiParam({ name: 'date', description: 'Date of the report in YYYY-MM-DD format' })
  @Auth(AppPermissions.REPORTS_CREATE)
  @Get(':date/pdf')
  async getPdfReport(
    @Param() { date }: DateParamDto,
    @Res() res: Response
  ) {
    const pdfBuffer = await this.reportService.getReportAsPdf(date);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=report-${date}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @ApiOperation({ summary: 'Generate or regenerate report data for specific date' })
  @ApiResponse({ status: 200, description: 'Report generated successfully.', type: ReportDto })
  @ApiParam({ name: 'date', description: 'Date of the report in YYYY-MM-DD format' })
  @Auth(AppPermissions.REPORTS_CREATE)
  @Post(':date/generate')
  @ConvertDates(['generated_at', 'updated_at'])
  async generateReport(@Param() { date }: DateParamDto): Promise<ReportDto> {
    return this.reportService.generateReportForDate(date);
  }

  @ApiOperation({ summary: 'Get report data by date' })

  @ApiResponse({ status: 200, description: 'Report data retrieved successfully.', type: ReportDto })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiParam({ name: 'date', description: 'Date of the report in YYYY-MM-DD format' })
  @Auth(AppPermissions.REPORTS_VIEW)
  @Get(':date')
  @ConvertDates(['generated_at', 'updated_at'])
  async getReport(@Param() { date }: DateParamDto): Promise<ReportDto> {
    ;
    const report = await this.reportService.findReportByDate(date);
    if (!report) {
      throw new NotFoundException(`Report for date ${date} not found`);
    }
    return report;
  }

}