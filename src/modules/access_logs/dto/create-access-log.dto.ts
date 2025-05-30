import { IsNotEmpty, Matches, IsISO8601, IsEnum } from 'class-validator';
import { IsNotFutureDate } from 'src/shared/validators/is-not-future-date.validator';
import { AccessType } from 'src/shared/enums/accessType.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessLogDto {
  @ApiProperty({ example: 'ABC123', description: 'Vehicle ID (license plate) in the format ABC123', type: String })
  @IsNotEmpty({ message: 'Vehicle ID (license plate) is required' })
  @Matches(/^[A-Z]{3}\d{3}$/, { message: 'Vehicle ID must be in the format ABC123' })
  vehicle_id: string;

  @ApiProperty({ example: '2025-02-01T08:00:00', description: 'Timestamp of the access log' })
  @IsNotEmpty({ message: 'Timestamp is required' })
  @IsISO8601({ strict: true }, { message: 'Timestamp must be a valid date in ISO format' })
  @IsNotFutureDate({ message: 'Timestamp must not be in the future' })
  timestamp: string;

  @ApiProperty({ example: 'entry', description: 'Access type (entry or exit)', enum: AccessType })
  @IsEnum(AccessType, { message: 'Access type must be either ENTRY or EXIT' })
  access_type: AccessType;
}
