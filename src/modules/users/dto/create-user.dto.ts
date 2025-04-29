import { IsString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { KindIdentification, Gender } from 'src/shared/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User id', example: '123456789' })
  @IsInt({ message: 'Id must be a string' })
  id: string;

  @ApiProperty({ description: 'User identification type', example: 'CC' })
  @IsEnum(KindIdentification, { message: 'Invalid identification type' })
  kind_id: KindIdentification;

  @ApiProperty({ description: 'User first name', example: 'Juan' })
  @IsString({ message: 'First name must be a string' })
  name: string;

  @ApiProperty({ description: 'User last name', example: 'Perez' })
  @IsString({ message: 'Last name must be a string' })
  last_name: string;

  @ApiProperty({ description: 'User gender', example: 'M' })
  @IsEnum(Gender, { message: 'Invalid gender' })
  gender: Gender;

  @ApiProperty({ description: 'Employee role id', example: 1 })
  @IsOptional()
  @IsInt({ message: 'Role id must be a number' })
  role_id?: number;
}
