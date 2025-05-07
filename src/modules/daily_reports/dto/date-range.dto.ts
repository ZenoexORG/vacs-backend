import { IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DateRangeDto {
  @ApiProperty({ example: '2025-01-01', description: 'Start date in YYYY-MM-DD format' })
  @IsDateString({ strict: true }, { message: 'Start date must be a valid date' })
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: string;

  @ApiProperty({ example: '2025-01-31', description: 'End date in YYYY-MM-DD format' })
  @IsDateString({ strict: true }, { message: 'End date must be a valid date' })
  @IsNotEmpty({ message: 'End date is required' })
  endDate: string;
}