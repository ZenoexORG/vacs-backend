import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleClassDto {
  @ApiProperty({ description: 'Vehicle class name', example: 'AUTHORIZED' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Vehicle class description',
    example: 'Authorized vehicles',
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description: string;
}
