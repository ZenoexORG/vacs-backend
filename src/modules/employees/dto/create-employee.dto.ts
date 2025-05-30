import {
  IsString, IsInt, IsOptional, IsNotEmpty, Length,
  IsEnum, Matches, IsPositive
} from 'class-validator';
import { KindIdentification, Gender } from 'src/shared/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Employee ID (National ID)', example: '1234567890' })
  @IsString({ message: 'Id must be a string' })
  @Length(4, 10, { message: 'Id must be between 8 and 10 digits' })
  @Matches(/^[0-9]{8,10}$/, { message: 'Id must be in the format of 8 to 10 digits' })
  @IsNotEmpty({ message: 'Id is required' })
  id: string;

  @ApiProperty({ description: 'Employee identification type', example: 'CC' })
  @IsNotEmpty({ message: 'Identification type is required' })
  @IsEnum(KindIdentification, { message: 'Invalid identification type' })
  kind_id: KindIdentification;

  @ApiProperty({ description: 'Employee first name', example: 'Juan' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'First name can only contain letters and spaces' })
  @Length(2, 50, { message: 'First name must be between 3 and 50 characters long' })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  name: string;

  @ApiProperty({ description: 'Employee last name', example: 'Perez' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'Last name can only contain letters and spaces' })
  @Length(2, 50, { message: 'Last name must be between 3 and 50 characters long' })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  last_name: string;

  @ApiProperty({ description: 'Employee gender', example: 'M' })
  @IsEnum(Gender, { message: 'Invalid gender' })
  @IsNotEmpty({ message: 'gender is required' })
  gender: Gender;

  @ApiProperty({ description: 'Employee role id', example: 1 })
  @IsPositive({ message: 'Role id must be a positive integer' })
  @IsInt({ message: 'Role id must be an integer' })
  @IsOptional()
  role_id?: number;

  @ApiProperty({ description: 'Unique usernam', example: 'jdoe' })
  @IsString({ message: 'Username must be a string' })
  @Matches(/^[a-zA-Z0-9_\.]+$/, { message: 'Username can only contain letters, numbers, dots, and underscores' })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters long' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({ description: 'Employee password', example: 'password' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
  @Length(8, 255, { message: 'Password must be at least 8 characters long' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
