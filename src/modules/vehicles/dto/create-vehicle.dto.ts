import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
    @ApiProperty({ description: 'Vehicle license plate', example: 'ABC123' })
    @IsString({ message: 'License plate must be a string' })
    id: string;

    @ApiProperty({ description: 'Vehicle class id', example: 1 })
    @IsInt({ message: 'Class id must be a number' })
    class_id: number;

    @ApiProperty({ description: 'Vehicle user id', example: 1 })
    @IsInt({ message: 'User id must be a number' })
    @IsOptional()
    user_id?: number;

    @ApiProperty({ description: 'Vehicle soat', example: 'ABC123' })
    @IsString({ message: 'Soat must be a string' })
    @IsOptional()
    soat?: string;
}
