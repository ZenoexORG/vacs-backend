import { IsString, IsOptional, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({ description: 'Rol name', example: 'Administrador' })
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({ description: 'Role description', example: 'Administrador' })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;
}
