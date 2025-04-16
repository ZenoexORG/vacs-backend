import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsISO8601 } from 'class-validator';

export class RegisterEntryExitDto {
  @ApiProperty({
    example: 'ABC1234',
    description: 'License plate of the vehicle',
    type: String,
  })
  @IsString({ message: 'Vehicle license plate must be a string' })
  vehicle_id: string;

  @ApiProperty({
    example: '2025-02-01T08:00:00',
    description: 'Timestamp of entry or exit in ISO 8601 format',
    type: String,
  })
  @IsISO8601({ strict: true }, { message: 'Invalid date format. Expected ISO 8601 format' })
  timestamp: string;
}