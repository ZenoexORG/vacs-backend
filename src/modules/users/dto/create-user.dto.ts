import { IsOptional, IsString, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({description: 'Id único del usuario (cédula)', example: 123456789})
    @IsNumber()
    id: number;

    @ApiProperty({description: 'Nombres del usuario', example: 'Juan'})
    @IsString()
    name: string;

    @ApiProperty({description: 'Apellidos del usuario', example: 'Pérez'})
    @IsString()
    last_name: string;

    @ApiProperty({description: 'Id del rol del usuario', example: 1})
    @IsOptional()
    @IsNumber()
    role_id?: number;
}