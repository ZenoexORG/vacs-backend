import { IsOptional, IsString, IsISO8601, Matches, IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PriorityLevel } from 'src/shared/enums/priorityLevel.enum';

export class CreateIncidentDto {
  @ApiProperty({ description: 'Vehicle id', example: 'ABC123' })
  @Matches(/^[A-Z]{3}\d{3}$/, { message: 'Vehicle id must be in the format ABC123' })
  @IsString({ message: 'Vehicle id must be a string' })
  @IsNotEmpty({ message: 'Vehicle id is required' })
  vehicle_id: string;

  @ApiProperty({ description: 'Incident date', example: '2025-05-01T00:00:00.000Z' })
  @IsISO8601({}, { message: 'Incident date must be in ISO8601 format' })
  incident_date: string;

  @ApiProperty({
    description: 'Priority level',
    example: 'MEDIUM',
    enum: PriorityLevel
  })
  @IsEnum(PriorityLevel, { message: 'Priority must be LOW, MEDIUM, HIGH, or CRITICAL' })
  @IsNotEmpty({ message: 'Priority is required' })
  priority: string;

  @ApiProperty({
    description: 'Incident status (resolved or not)',
    example: false,
    default: false
  })
  @IsBoolean({ message: 'Status must be a boolean' })
  @IsOptional()
  status?: boolean;
}