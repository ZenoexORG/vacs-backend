import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { HourlyData } from '../interfaces/hourlyData.interface';

export class CreateReportDto {
  @IsNumber()
  @IsNotEmpty()
  total_entries: number;

  @IsNumber()
  @IsNotEmpty()
  total_exits: number;

  @IsNumber()
  @IsNotEmpty()
  total_incidents: number;

  @IsNumber()
  @IsNotEmpty()
  active_vehicles: number;

  @IsObject()
  @IsNotEmpty()
  entries_by_hour: HourlyData;

  @IsObject()
  @IsNotEmpty()
  exits_by_hour: HourlyData;

  @IsObject()
  @IsNotEmpty()
  incidents_by_hour: HourlyData;

  @IsObject()
  @IsNotEmpty()
  entries_by_type: HourlyData;

  @IsObject()
  @IsNotEmpty()
  incidents_by_type: HourlyData;

  @IsNumber()
  @IsNotEmpty()
  average_time: number;
}
