import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KindRole } from 'src/shared/enums';

export class CreateRoleDto {
  @ApiProperty({ description: 'Rol name', example: 'Administrador' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ description: 'Rol type', example: 'UTB' })
  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(KindRole, { message: 'Type must be a valid value' })
  @IsString({ message: 'Type must be a string' })
  type: KindRole;

  @ApiProperty({description: 'Role color', example: '#FF5733'})
  @IsString({ message: 'Color must be a string' })
  @IsNotEmpty({ message: 'Color is required' })
  color: string;
}
