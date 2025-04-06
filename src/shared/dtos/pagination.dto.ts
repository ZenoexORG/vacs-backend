import { Transform, TransformFnParams } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  @Transform((params: TransformFnParams) => parseInt(params.value, 10))
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  @Transform((params: TransformFnParams) => parseInt(params.value, 10))
  limit?: number = 10;
}
