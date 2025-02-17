import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
    @ApiProperty({description: 'Nombre del permiso', example: 'create:permission'})
    @IsNotEmpty()
    @IsString()
    name: string;    
}