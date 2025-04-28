import { IsNotEmpty, IsString, Matches, IsISO8601  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessLogDto {
  @ApiProperty({ description: 'ID (plate) of the vehicle', type: String, required: true, example: 'ABC123'})
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9]{6}$/, { message: 'vehicle_id must be 6 alphanumeric characters' })
  vehicle_id: string;

  @ApiProperty({ description: 'Timestamp of the access log', type: String, required: true, example: '2023-10-01T12:00:00Z'})
  @IsNotEmpty()
  @IsISO8601({ strict: true }, { message: 'Invalid date format. Expected ISO 8601 format' })
  timestamp: Date;

  @ApiProperty({ description: 'Type of access (entry or exit)', type: String, required: true, example: 'entry'})
  @IsNotEmpty()
  @IsString()
  access_type: string;
}
