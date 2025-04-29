import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { DailyReport } from './entities/report.entity';
import { AccessLog } from '../access_logs/entities/access-log.entity';
import { Incident } from '../incidents/entities/incident.entity';
import { VehicleType } from '../vehicle_types/entities/vehicle-type.entity';
import { DailyReportData } from './interfaces/dailyReportData.interface';
import { HourlyData } from './interfaces/hourlyData.interface';
import { DateRangeDto } from './dto/date-range.dto';
import { getDateRange } from 'src/shared/utils/date.utils';
import { hourUtcToLocal } from 'src/shared/utils/hour.utils';
import { initializeHourlyData } from 'src/shared/utils/hour.utils';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
	constructor(
		@InjectRepository(DailyReport)
		private readonly reportRepository: Repository<DailyReport>,
		@InjectRepository(AccessLog)
		private readonly accessLogsRepository: Repository<AccessLog>,
		@InjectRepository(Incident)
		private readonly incidentsRepository: Repository<Incident>,
		@InjectRepository(VehicleType)
		private readonly VehicleTypeesRepository: Repository<VehicleType>,
	) { }

	@Cron('58 23 * * *')
	async generateDailyReport() {
		const data = await this.generateReportData();
		return this.createReport(data);
	}

	async findAllReports(): Promise<DailyReport[]> {
		return this.reportRepository.find({
			order: { report_date: 'DESC' }
		});
	}

	async findReportByDate(date: Date): Promise<DailyReport> {
		const report = await this.reportRepository.findOne({ where: { report_date: date } });
		if (!report) throw new NotFoundException(`Report not found for date: ${date}`);
		return report;
	}

	async findReportsByDateRange({ startDate, endDate }: DateRangeDto): Promise<DailyReport[]> {
		if (!startDate || !endDate) throw new BadRequestException('Start date and end date are required');
		return this.reportRepository.find({
			where: { report_date: Between(startDate, endDate) },
			order: { report_date: 'DESC' },
		});
	}

	async generateReportData(): Promise<DailyReportData> {
		const [total_entries, total_exits, total_incidents, active_vehicles, entries_by_hour, exits_by_hour, incidents_by_hour, entries_by_type, incidents_by_type, average_time] =
			await Promise.all([
				this.getTotalEntries(),
				this.getTotalExits(),
				this.getTotalIncidents(),
				this.getActiveVehicles(),
				this.getEntriesByHour(),
				this.getExitsByHour(),
				this.getIncidentsByHour(),
				this.getEntriesByType(),
				this.getIncidentsByType(),
				this.getAverageTime()
			]);
		return {
			total_entries,
			total_exits,
			total_incidents,
			active_vehicles,
			entries_by_hour,
			exits_by_hour,
			incidents_by_hour,
			entries_by_type,
			incidents_by_type,
			average_time,
		};
	}

	async createReport(reportData: CreateReportDto) {
		const { base } = getDateRange();
		const existingReport = await this.reportRepository.findOne({
			where: { report_date: base }
		});
		if (existingReport) {
			await this.reportRepository.update(existingReport.id, reportData);
			return this.reportRepository.findOne({ where: { id: existingReport.id } });
		}
		const newReport = this.reportRepository.create({
			report_date: base,
			...reportData
		});
		return this.reportRepository.save(newReport);
	}

	private async getTotalEntries(): Promise<number> {
		const { base, tomorrow } = getDateRange();
		return await this.accessLogsRepository.count({
			where: {
				entry_date: Between(base, tomorrow),
			}
		});
	}

	private async getTotalExits(): Promise<number> {
		const { base, tomorrow } = getDateRange();
		return await this.accessLogsRepository.count({
			where: {
				exit_date: Between(base, tomorrow),
			}
		});
	}

	private async getTotalIncidents(): Promise<number> {
		const { base, tomorrow } = getDateRange();
		return await this.incidentsRepository.count({
			where: {
				incident_date: Between(base, tomorrow),
			}
		});
	}

	private async getActiveVehicles(): Promise<number> {
		const { base, tomorrow } = getDateRange();
		const result = await this.accessLogsRepository
			.createQueryBuilder('accessLog')
			.select('COUNT(DISTINCT accessLog.vehicle_id)', 'count')
			.where('accessLog.entry_date BETWEEN :base AND :tomorrow', { base, tomorrow })
			.getRawOne();
		return result?.count ? parseInt(result.count) : 0;
	}

	private async getEntriesByHour(): Promise<HourlyData> {
		const { base, tomorrow } = getDateRange();
		const hourlyData = initializeHourlyData();

		const entriesByHour = await this.accessLogsRepository
			.createQueryBuilder('accessLog')
			.select('EXTRACT(HOUR FROM accessLog.entry_date)', 'hour')
			.addSelect('COUNT(*)', 'count')
			.where('accessLog.entry_date IS NOT NULL')
			.andWhere('accessLog.entry_date BETWEEN :base AND :tomorrow', { base, tomorrow })
			.groupBy('hour')
			.getRawMany();

		entriesByHour.forEach(entry => {
			const utcHour = parseInt(entry.hour, 10);
			const localHour = hourUtcToLocal(utcHour);
			hourlyData[localHour] = parseInt(entry.count);
		});
		return hourlyData;
	}

	private async getExitsByHour(): Promise<HourlyData> {
		const { base, tomorrow } = getDateRange();
		const hourlyData = initializeHourlyData();

		const exitsByHour = await this.accessLogsRepository
			.createQueryBuilder('accessLog')
			.select('EXTRACT(HOUR FROM accessLog.exit_date)', 'hour')
			.addSelect('COUNT(*)', 'count')
			.where('accessLog.exit_date IS NOT NULL')
			.andWhere('accessLog.exit_date BETWEEN :base AND :tomorrow', { base, tomorrow })
			.groupBy('hour')
			.getRawMany();

		exitsByHour.forEach(entry => {
			const localHour = hourUtcToLocal(parseInt(entry.hour, 10));
			hourlyData[localHour] = parseInt(entry.count);
		});
		return hourlyData;
	}

	private async getIncidentsByHour(): Promise<HourlyData> {
		const { base, tomorrow } = getDateRange();
		const hourlyData = initializeHourlyData();

		const incidentsByHour = await this.incidentsRepository
			.createQueryBuilder('incident')
			.select('EXTRACT(HOUR FROM incident.incident_date)', 'hour')
			.addSelect('COUNT(*)', 'count')
			.where('incident.incident_date BETWEEN :base AND :tomorrow', { base, tomorrow })
			.groupBy('hour')
			.getRawMany();

		incidentsByHour.forEach(entry => {
			const localHour = hourUtcToLocal(parseInt(entry.hour, 10));
			hourlyData[localHour] = parseInt(entry.count);
		});
		return hourlyData;
	}

	private async getEntriesByType(): Promise<HourlyData> {
		const { base, tomorrow } = getDateRange();
		const typeData = await this.initializeByTypeData();

		const entriesByType = await this.accessLogsRepository
			.createQueryBuilder('accessLog')
			.select('accessLog.vehicle_type', 'type')
			.addSelect('COUNT(*)', 'count')
			.where('accessLog.vehicle_type IS NOT NULL')
			.andWhere('accessLog.entry_date IS NOT NULL')			
			.andWhere('accessLog.entry_date BETWEEN :base AND :tomorrow', { base, tomorrow })			
			.groupBy('accessLog.vehicle_type')
			.getRawMany();

		entriesByType.forEach(entry => {
			typeData[entry.type] = parseInt(entry.count);
		});
		return typeData;
	}

	private async getIncidentsByType(): Promise<HourlyData> {
		const { base, tomorrow } = getDateRange();
		const typeData = await this.initializeByTypeData();

		const incidentsByType = await this.incidentsRepository
			.createQueryBuilder('incident')
			.leftJoin('vehicles', 'vehicle', 'incident.vehicle_id = vehicle.id')
			.leftJoin('vehicle_types', 'VehicleType', 'vehicle.type_id = VehicleType.id')
			.select('COALESCE(VehicleType.name, \'unregistered\')', 'type')
			.addSelect('COUNT(*)', 'count')
			.where('incident.incident_date IS NOT NULL')			
			.andWhere('incident.incident_date BETWEEN :base AND :tomorrow', { base, tomorrow })
			.groupBy('COALESCE(VehicleType.name, \'unregistered\')')
			.getRawMany();

		incidentsByType.forEach(entry => {
			typeData[entry.type] = parseInt(entry.count);
		});
		return typeData;
	}

	private async initializeByTypeData(): Promise<HourlyData> {
		const VehicleTypees = await this.VehicleTypeesRepository.find();
		return VehicleTypees.reduce((acc, VehicleType) => {
			acc[VehicleType.name] = 0;
			return acc;
		}, {} as HourlyData);
	}

	private async getAverageTime(): Promise<number> {
		const { base, tomorrow } = getDateRange();

		const averageTime = await this.accessLogsRepository
			.createQueryBuilder('accessLog')
			.select('AVG(EXTRACT(EPOCH FROM (accessLog.exit_date - accessLog.entry_date)) / 60)', 'avg_time')
			.where('accessLog.entry_date BETWEEN :base AND :tomorrow', { base, tomorrow })
			.getRawOne();

		return averageTime?.avg_time ? parseFloat(averageTime.avg_time) : 0;
	}
}