import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DateParamDto {
  @ApiProperty({
    example: '2025-04-15',
    description: 'Date of the report in YYYY-MM-DD format',
    type: String,
  })  
  @IsDate({ message: 'Invalid date format. Use YYYY-MM-DD.' })
  date: Date;
}