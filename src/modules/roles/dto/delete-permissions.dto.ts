import { IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePermissionsDto {
  @ApiProperty({ description: 'Permission ids', example: [1, 2, 3] })
  @IsArray({ message: 'Permission ids must be an array' })
  @ArrayNotEmpty({ message: 'Permission ids is required' })
  permissionIds: number[];
}
