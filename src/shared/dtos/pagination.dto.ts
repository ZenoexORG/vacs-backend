import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @Transform((params: TransformFnParams) => parseInt(params.value, 10))
  @IsPositive({ message: 'Page must be a positive integer' })
  @IsInt({ message: 'Page must be an integer' })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ description: 'Number of items per page', required: false, default: 10 })
  @Transform((params: TransformFnParams) => parseInt(params.value, 10))
  @IsPositive({ message: 'Limit must be a positive integer' })
  @IsInt({ message: 'Limit must be an integer' })
  @IsOptional()
  limit?: number = 10;
}
