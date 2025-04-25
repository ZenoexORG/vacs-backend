import { IsString, IsOptional, IsEnum } from 'class-validator';
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
}
