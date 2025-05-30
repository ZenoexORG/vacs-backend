import { IsISO8601, IsNotEmpty, IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PriorityLevel } from 'src/shared/enums/priorityLevel.enum';
import { IncidentStatus } from 'src/shared/enums/incidentStatus.enum';

export class CreateIncidentDto {
  @ApiProperty({ description: 'Access log ID', example: 1 })
  @IsNotEmpty({ message: 'Access log ID is required' })
  @IsInt({ message: 'Access log ID must be an integer' })
  access_log_id: number;

  @ApiProperty({ description: 'Incident date', example: '2025-05-01T00:00:00.000Z' })
  @IsISO8601({}, { message: 'Incident date must be in ISO8601 format' })
  date: string;

  @ApiProperty({
    description: 'Priority level',
    example: 'MEDIUM',
    enum: PriorityLevel
  })
  @IsEnum(PriorityLevel, { message: 'Priority must be LOW, MEDIUM, HIGH, or CRITICAL' })
  @IsNotEmpty({ message: 'Priority is required' })
  priority: string;

  @ApiProperty({
    description: 'Incident status',
    example: 'OPEN',
    enum: IncidentStatus
  })
  @IsEnum(IncidentStatus, { message: 'Status must be open, in_progress, resolved, closed, escalated, or cancelled' })
  @IsNotEmpty({ message: 'Status is required' })
  status: IncidentStatus;
}