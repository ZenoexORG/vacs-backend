import { IsString, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({description: 'Id único del rol', example: 1})
    @IsNumber()
    id: number;

    @ApiProperty({description: 'Nombre del rol', example: 'admin'})
    @IsString()
    name: string;

    @ApiProperty({description: 'Descripción del rol', example: 'Administrador del sistema'})
    @IsOptional()
    @IsString()
    description?: string;
}