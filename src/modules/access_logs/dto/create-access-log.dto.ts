import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessLogDto {
  @ApiProperty({ description: 'Entry date', example: '2021-10-10T12:00:00Z' })
  @IsNotEmpty({ message: 'Entry date is required' })
  @IsDate({ message: 'Entry date must be a date' })
  entry_date: Date;

  @ApiProperty({ description: 'Exit date', example: '2021-10-10T12:00:00Z' })
  @IsDate({ message: 'Exit date must be a date' })
  @IsOptional()
  exit_date: Date;

  @ApiProperty({ description: 'Vehicle id', example: 'ABC123' })
  @IsNotEmpty({ message: 'Vehicle id is required' })
  @IsString({ message: 'Vehicle id must be a string' })
  vehicle_id: string;
}
