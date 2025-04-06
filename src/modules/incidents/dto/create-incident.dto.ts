import { IsOptional, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIncidentDto {
  @ApiProperty({ description: 'Vehicle id', example: 'ABC123' })
  @IsString({ message: 'Vehicle id must be a string' })
  vehicle_id: string;

  @ApiProperty({
    description: 'Incident date',
    example: '2021-10-01T00:00:00.000Z',
  })
  @IsDate({ message: 'Incident date must be a date' })
  incident_date: Date;

  @ApiProperty({
    description: 'Solution date',
    example: '2021-10-01T00:00:00.000Z',
  })
  @IsDate({ message: 'Solution date must be a date' })
  @IsOptional()
  solution_date?: Date;

  @ApiProperty({ description: 'Comment', example: 'The problem was solved' })
  @IsString({ message: 'Comment must be a string' })
  @IsOptional()
  comment?: string;
}
