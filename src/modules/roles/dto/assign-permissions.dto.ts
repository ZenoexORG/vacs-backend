import { IsArray, IsInt, ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsDto {
    @ApiProperty({ description: 'Role id', example: 1 })
    @IsInt({ message: 'Role id must be a number' })
    @IsNotEmpty({ message: 'Role id is required' })
    role_id: number;

    @ApiProperty({ description: 'Permission ids', example: [1, 2, 3] })
    @IsArray({ message: 'Permission ids must be an array' })
    @ArrayNotEmpty({ message: 'Permission ids is required' })
    permissionIds: number[];
}
