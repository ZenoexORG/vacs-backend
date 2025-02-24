import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleClassDto {
    @ApiProperty({description: 'Nombre de la clase de vehículo', example: 'Clase 1'})
    @IsString()
    name: string;

    @ApiProperty({description: 'Descripción de la clase de vehículo', example: 'Vehículos de carga'})
    @IsString()
    @IsOptional()
    description: string;
}