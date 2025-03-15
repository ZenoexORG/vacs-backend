import { IsString, IsInt, IsOptional, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { KindIdentification, Gender } from 'src/shared/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
    @ApiProperty({ description: 'Employee id', example: '123456789' })
    @IsInt({ message: 'Id must be a string' })
    @IsNotEmpty({ message: 'Id is required' })
    id: string;

    @ApiProperty({ description: 'Employee identification type', example: 'CC' })
    @IsNotEmpty({ message: 'Identification type is required' })
    @IsEnum(KindIdentification, { message: 'Invalid identification type' })
    kind_id: KindIdentification;

    @ApiProperty({ description: 'Employee first name', example: 'Juan' })
    @IsNotEmpty({ message: 'First name is required' })
    @IsString({ message: 'First name must be a string' })
    name: string;

    @ApiProperty({ description: 'Employee last name', example: 'Perez' })
    @IsNotEmpty({ message: 'Last name is required' })
    @IsString({ message: 'Last name must be a string' })
    last_name: string;

    @ApiProperty({ description: 'Employee gender', example: 'M' })
    @IsNotEmpty({ message: 'Gender is required' })
    @IsEnum(Gender, {message: 'Invalid gender'})
    gender: Gender;

    @ApiProperty({ description: 'Employee role id', example: 1 })
    @IsOptional()
    @IsInt({ message: 'Role id must be a number' })
    role_id?: number;

    @ApiProperty({ description: 'Employee username', example: 'juanperez' })
    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    username: string;

    @ApiProperty({ description: 'Employee password', example: 'password' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
