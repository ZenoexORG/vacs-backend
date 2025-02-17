import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
    @ApiProperty({description: 'Id único del empleado (cédula)', example: 123456789})
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty({description: 'Nombres del empleado', example: 'Juan'})
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({description: 'Apellidos del empleado', example: 'Pérez'})
    @IsNotEmpty()
    @IsString()
    last_name: string;

    @ApiProperty({description: 'Id del rol del empleado', example: 1})
    @IsOptional()
    @IsNumber()
    role_id?: number;

    @ApiProperty({description: 'Nombre de usuario del empleado', example: 'juanperez'})
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({description: 'Contraseña del empleado', example: '123456'})
    @IsNotEmpty()
    password: Buffer;
}