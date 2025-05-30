import { IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DateParamDto {
  @ApiProperty({ example: '2025-04-15', description: 'Date of the report in YYYY-MM-DD format' })
  @IsNotEmpty({ message: 'Date is required' })
  // @IsDate({ message: 'Date must be a valid date' })
  @Type(() => Date)
  date: Date;
}