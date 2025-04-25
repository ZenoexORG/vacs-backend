import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ description: 'Vehicle license plate', example: 'ABC123' })
  @IsString({ message: 'License plate must be a string' })
  id: string;

  @ApiProperty({ description: 'Vehicle type id', example: 1 })
  @IsInt({ message: 'Type id must be a number' })
  type_id: number;

  @ApiProperty({ description: 'Vehicle user id', example: 1 })
  @IsInt({ message: 'User id must be a string' })
  @IsOptional()
  owner_id?: string;

  @ApiProperty({ description: 'Vehicle soat', example: 'ABC123' })
  @IsString({ message: 'Soat must be a string' })
  @IsOptional()
  soat?: string;
}
