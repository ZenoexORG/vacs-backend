import { IsNotEmpty, IsString, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIncidentMessageDto {
    @ApiProperty({ description: 'Incident ID', example: 1 })
    @IsInt({ message: 'Incident ID must be an integer' })
    @IsPositive({ message: 'Incident ID must be positive' })
    @IsNotEmpty({ message: 'Incident ID is required' })
    incident_id: number;

    @ApiProperty({ description: 'Message text', example: 'Vehicle issue has been addressed' })
    @IsString({ message: 'Message must be a string' })
    @IsNotEmpty({ message: 'Message is required' })
    message: string;
}