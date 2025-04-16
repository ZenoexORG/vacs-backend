import {
	Controller,
	Get,
	Post,
	Query,
	Param,	
	NotFoundException,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiParam,
	ApiQuery,	
	ApiResponse,
} from '@nestjs/swagger';
import { ReportService } from './daily_reports.service';
import { DateRangeDto } from "./dto/date-range.dto";
import { ReportDto } from './dto/report.dto';
import { DateParamDto } from './dto/date.dto';
import { Auth } from 'src/shared/decorators/permissions.decorator';
import { AppPermissions } from 'src/shared/enums/permissions.enum';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
	constructor(private readonly reportService: ReportService) { }

	@ApiOperation({ summary: 'Generate daily report' })	
	@Auth(AppPermissions.REPORTS_GENERATE)
	@Post()
	async create() {
		return this.reportService.generateDailyReport();
	}

	@ApiOperation({ summary: 'Get all reports' })	
	@Auth(AppPermissions.REPORTS_READ)
	@ApiResponse({ status: 200, description: 'All reports retrieved successfully.', type: [ReportDto] })
	@Get()
	async findAllReports() {
		return this.reportService.findAllReports();
	}

	@ApiOperation({ summary: 'Get report by date range' })	
	@Auth(AppPermissions.REPORTS_READ)
	@ApiQuery({ name: 'startDate', required: true, description: 'Start of the date range (YYYY-MM-DD)' })
	@ApiQuery({ name: 'endDate', required: true, description: 'End of the date range (YYYY-MM-DD)' })
	@ApiResponse({ status: 200, description: 'Reports retrieved successfully.', type: [ReportDto] })
	@ApiResponse({ status: 400, description: 'Invalid date range.' })
	@ApiResponse({ status: 404, description: 'No reports found for the given date range.' })
	@ApiResponse({ status: 500, description: 'Internal server error.' })
	@Get('range')
	async findReportByDateRange(@Query() dateRangeDto: DateRangeDto) {
		return this.reportService.findReportsByDateRange(dateRangeDto);
	}

	@ApiOperation({ summary: 'Get report by date' })	
	@Auth(AppPermissions.REPORTS_READ)
	@ApiParam({ name: 'date', description: 'Date of the report in YYYY-MM-DD format' })
	@ApiResponse({ status: 200, description: 'Report retrieved successfully.', type: ReportDto })
	@ApiResponse({ status: 400, description: 'Invalid date format.' })
	@ApiResponse({ status: 404, description: 'Report not found.' })
	@ApiResponse({ status: 500, description: 'Internal server error.' })
	@Get(':date')
	async findReportByDate(@Param() { date }: DateParamDto) {
		const report = await this.reportService.findReportByDate(date);
		if (!report) {
			throw new NotFoundException('Report not found.');
		}
		return report;
	}
}