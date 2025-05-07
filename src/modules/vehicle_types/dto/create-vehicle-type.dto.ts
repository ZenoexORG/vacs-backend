import { IsString, IsOptional, IsEnum, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KindVehicle } from 'src/shared/enums';

export class CreateVehicleTypeDto {
  @ApiProperty({ description: 'Vehicle type name', example: 'AUTHORIZED' })
  @IsEnum(KindVehicle, { message: 'Type must be a valid value' })
  @IsString({ message: 'Name must be a string' })
  name: KindVehicle;

  @ApiProperty({
    description: 'Vehicle type description',
    example: 'Authorized vehicles',
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Allowed time in minutes for this vehicle type',
    example: 15,
    default: 15
  })
  @IsInt({ message: 'Allowed time must be an integer' })
  @IsPositive({ message: 'Allowed time must be positive' })
  @IsOptional()
  allowed_time?: number;
}
