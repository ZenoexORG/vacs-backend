import { IsString, IsNotEmpty, IsEnum, IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KindRole } from 'src/shared/enums';

export class CreateRoleDto {
  @ApiProperty({ description: 'Rol name', example: 'Administrador' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ description: 'Role type', example: 'utb' })
  @IsEnum(KindRole, { message: 'Role type must be one of the following: utb, admin, user' })
  @IsString({ message: 'Role type must be a string' })
  @IsNotEmpty({ message: 'Role type is required' })
  type: KindRole;

  @ApiProperty({ description: 'Role color', example: '#FF5733' })
  @IsHexColor({ message: 'Color must be a valid hex color code' })
  @IsNotEmpty({ message: 'Color is required' })
  color: string;
}
