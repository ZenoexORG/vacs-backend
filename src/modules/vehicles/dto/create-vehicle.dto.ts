import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
    @ApiProperty({description: 'Placa del vehículo', example: 'ABC123'})
    @IsString()
    id: string;

    @ApiProperty({ description: 'ID de la clase de vehículo', example: 1 })
    @IsNumber()
    class_id: number;

    @ApiProperty({ description: 'ID de usuario del propietario del vehículo', example: 1 })
    @IsNumber()
    @IsOptional()
    user_id?: number;

    @ApiProperty({ description: 'SOAT del vehículo', example: 'ABC123', required: false })
    @IsString()
    @IsOptional()
    soat?: string;
}