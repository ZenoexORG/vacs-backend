import { IsString, IsInt, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
    @ApiProperty({ description: 'Employee id', example: 123456789 })
    @IsInt({ message: 'Id must be a number' })
    @IsNotEmpty({ message: 'Id is required' })
    id: number;

    @ApiProperty({ description: 'Employee first name', example: 'Juan' })
    @IsNotEmpty({ message: 'First name is required' })
    @IsString({ message: 'First name must be a string' })
    name: string;

    @ApiProperty({ description: 'Employee last name', example: 'Perez' })
    @IsNotEmpty({ message: 'Last name is required' })
    @IsString({ message: 'Last name must be a string' })
    last_name: string;

    @ApiProperty({ description: 'Employee role id', example: 1 })
    @IsOptional()
    @IsInt({ message: 'Role id must be a number' })
    role_id?: number;

    @ApiProperty({ description: 'Employee username', example: 'juanperez' })
    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    username: string;

    @ApiProperty({ description: 'Employee password', example: 'password' })
    @IsNotEmpty({ message: 'Password is required' })
    password: Buffer;
}
