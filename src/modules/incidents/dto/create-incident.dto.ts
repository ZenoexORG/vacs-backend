import { IsNumber, IsOptional, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIncidentDto {
    @ApiProperty({description: 'ID del vehículo', example: 1})
    @IsNumber()
    vehicle_id: string;

    @ApiProperty({description: 'Fecha del incidente', example: '2021-10-01T00:00:00.000Z'})
    @IsDate()
    incident_date: Date;

    @ApiProperty({description: 'Fecha de solución del incidente', example: '2021-10-01T00:00:00.000Z'})
    @IsDate()
    @IsOptional()
    solution_date?: Date;

    @ApiProperty({description: 'Comentario del incidente', example: 'Choque con otro vehículo'})
    @IsString()
    @IsOptional()
    comment?: string;
}