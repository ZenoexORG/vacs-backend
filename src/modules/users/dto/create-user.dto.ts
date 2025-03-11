import { IsOptional, IsString, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ description: 'User id', example: 123456789 })
    @IsInt({ message: 'Id must be a number' })
    id: number;

    @ApiProperty({ description: 'User first name', example: 'Juan' })
    @IsString({ message: 'First name must be a string' })
    name: string;

    @ApiProperty({ description: 'User last name', example: 'Perez' })
    @IsString({ message: 'Last name must be a string' })
    last_name: string;

    @ApiProperty({ description: 'User role id', example: 1 })
    @IsOptional()
    @IsInt({ message: 'Role id must be a number' })
    role_id?: number;
}
