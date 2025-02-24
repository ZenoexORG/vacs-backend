import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePermissionsDto {
    @ApiProperty({description: 'Ids de los permisos', example: [1, 2, 3]})
    @IsArray()
    @ArrayNotEmpty()    
    permissionIds: number[];
}