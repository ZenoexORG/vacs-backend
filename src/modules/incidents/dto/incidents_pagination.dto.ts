import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';

export class IncidentsPaginationDto extends PaginationDto {
    @ApiProperty({ description: 'Incident status', required: false })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiProperty({ description: 'Incident priority', required: false })
    @IsString()
    @IsOptional()
    priority?: string;
}