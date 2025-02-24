import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsDto {
    @ApiProperty({description: 'Id del rol', example: 1})
    @IsInt()
    role_id: number;
    
    @ApiProperty({description: 'Ids de los permisos', example: [1, 2, 3]})
    @IsArray()
    @ArrayNotEmpty()    
    permissionIds: number[];
}
