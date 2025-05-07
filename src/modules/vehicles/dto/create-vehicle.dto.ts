import { IsString, IsInt, IsPositive, IsOptional, Matches, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ description: 'Vehicle license plate', example: 'ABC123' })
  @IsString({ message: 'License plate must be a string' })
  @Length(1, 20, { message: 'License plate cannot exceed 20 characters' })
  @Matches(/^[A-Z]{3}\d{3}$/, { message: 'License plate must follow Colombian format (3 uppercase letters followed by 3 numbers)' })
  @IsNotEmpty({ message: 'License plate is required' })
  id: string;

  @ApiProperty({ description: 'Vehicle type unique id', example: 1 })
  @IsPositive({ message: 'Type ID must be a positive integer' })
  @IsInt({ message: 'Type ID must be an integer' })
  @IsNotEmpty({ message: 'Type ID is required' })
  type_id: number;

  @ApiProperty({ description: 'Owner ID (user identification)', example: '1234567890' })
  @Matches(/^[0-9]{8,10}$/, { message: 'Owner ID must be between 8 and 10 digits' })
  @IsString({ message: 'Owner ID must be a string' })
  @Length(4, 10, { message: 'Owner ID must be between 4 and 10 digits' })
  @Matches(/^[0-9]{8,10}$/, { message: 'Owner ID must be in the format of 8 to 10 digits' })
  @IsNotEmpty({ message: 'Owner ID is required' })
  owner_id: string;

  @ApiProperty({ description: 'SOAT (mandatory insurance) number', example: 'SOAT123456' })
  @IsString({ message: 'SOAT must be a string' })
  @Length(1, 20, { message: 'SOAT cannot exceed 20 characters' })
  @IsOptional()
  soat?: string;
}
