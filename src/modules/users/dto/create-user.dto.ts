import { IsString, IsInt, IsEnum, IsOptional, Length, Matches, IsNotEmpty } from 'class-validator';
import { KindIdentification, Gender } from 'src/shared/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User ID (National ID)', example: '1234567890' })
  @IsString({ message: 'User id must be a string' })
  @Length(4, 10, { message: 'User id must be between 8 and 10 digits' })
  @Matches(/^[0-9]{8,10}$/, { message: 'ID must be in the format of 8 to 10 digits' })
  @IsNotEmpty({ message: 'Id is required' })
  id: string;

  @ApiProperty({ description: 'User identification type', example: 'CC' })
  @IsEnum(KindIdentification, { message: 'Invalid identification type' })
  kind_id: KindIdentification;

  @ApiProperty({ description: 'User first name', example: 'Juan' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'First name can only contain letters and spaces' })
  @Length(2, 50, { message: 'First name must be between 3 and 50 characters long' })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  name: string;

  @ApiProperty({ description: 'User last name', example: 'Perez' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'Last name can only contain letters and spaces' })
  @Length(2, 50, { message: 'Last name must be between 3 and 50 characters long' })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  last_name: string;

  @ApiProperty({ description: 'User gender', example: 'M' })
  @IsEnum(Gender, { message: 'Gender must be M or F' })
  @IsNotEmpty({ message: 'Gender is required' })
  gender: Gender;

  @ApiProperty({ description: 'Employee role id', example: 1 })
  @IsInt({ message: 'Role id must be an integer' })
  @IsOptional()
  role_id?: number;
}
