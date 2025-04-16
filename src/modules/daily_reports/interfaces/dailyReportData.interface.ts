import { HourlyData } from "./hourlyData.interface";

export interface DailyReportData {
	total_entries: number;
	total_exits: number;
	total_incidents: number;
	active_vehicles: number;
	entries_by_hour: HourlyData;
	exits_by_hour: HourlyData;
	incidents_by_hour: HourlyData;
	entries_by_class: HourlyData;
	incidents_by_class: HourlyData;
	average_time: number;
}
