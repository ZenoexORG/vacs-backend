import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessLogDto {
    @ApiProperty({description: 'Fecha de entrada', example: '2021-10-10T12:00:00Z'})
    @IsNotEmpty()
    @IsDate()
    entry_date: Date;

    @ApiProperty({description: 'Fecha de salida', example: '2021-10-10T12:00:00Z'})    
    @IsDate()
    @IsOptional()
    exit_date: Date;

    @ApiProperty({description: 'Id del vehículo', example: 1})
    @IsNotEmpty()
    @IsString()
    vehicle_id: string;
}