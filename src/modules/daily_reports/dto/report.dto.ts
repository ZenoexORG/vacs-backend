import { ApiProperty } from '@nestjs/swagger';
import { HourlyData } from '../interfaces/hourlyData.interface';

export class ReportDto {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: '2024-04-14', description: 'Date the report belongs to (YYYY-MM-DD)' })
	report_date: string;

	@ApiProperty({ example: 250, description: 'Total number of entries for the day' })
	total_entries: number;

	@ApiProperty({ example: 240, description: 'Total number of exits for the day' })
	total_exits: number;

	@ApiProperty({ example: 5, description: 'Total incidents reported' })
	total_incidents: number;

	@ApiProperty({ example: 30, description: 'Number of active vehicles' })
	active_vehicles: number;

	@ApiProperty({
		example: { "08": 12, "09": 30 },
		description: 'Entries grouped by hour',
	})
	entries_by_hour: HourlyData;

	@ApiProperty({
		example: { "08": 10, "09": 25 },
		description: 'Exits grouped by hour',
	})
	exits_by_hour: HourlyData;

	@ApiProperty({
		example: { "08": 1, "10": 2 },
		description: 'Incidents grouped by hour',
	})
	incidents_by_hour: HourlyData;

	@ApiProperty({
		example: { "Authorized": 5, "Private": 3 },
		description: 'Entries grouped by class/type',
	})
	entries_by_class: HourlyData;

	@ApiProperty({
		example: { "Authorized": 2, "Private": 1 },
		description: 'Incidents grouped by class/type',
	})
	incidents_by_class: HourlyData;

	@ApiProperty({ example: 15.5, description: 'Average time spent (in minutes)' })
	average_time: number;

	@ApiProperty({ example: '2024-04-14T23:59:00.000Z', description: 'Timestamp when the report was generated' })
	generated_at: Date;

	@ApiProperty({ example: '2024-04-14T23:59:00.000Z', description: 'Timestamp when the report was last updated' })
	updated_at: Date;
}
