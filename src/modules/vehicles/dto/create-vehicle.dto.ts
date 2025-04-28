import { IsString, IsInt, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ description: 'Vehicle license plate', example: 'ABC123' })
  @IsString({ message: 'License plate must be a string' })
  @Matches(/^[A-Z]{3}\d{3}$/, { message: 'License plate must be in the format ABC123' })
  id: string;

  @ApiProperty({ description: 'Vehicle type id', example: 1 })
  @IsInt({ message: 'Type id must be a number' })
  type_id: number;

  @ApiProperty({ description: 'Vehicle user id', example: 1 })
  @IsInt({ message: 'User id must be a string' })
  @IsOptional()
  owner_id?: string;

  @ApiProperty({ description: 'Vehicle soat', example: '123456789' })
  @Matches(/^[0-9]{9}$/, { message: 'Soat must be in the format 123456789' })
  @IsString({ message: 'Soat must be a string' })
  @IsOptional()
  soat?: string;
}
