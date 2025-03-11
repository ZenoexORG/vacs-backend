import { Transform, TransformFnParams } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
	@IsNumber()
	@IsOptional()
	@Transform((params: TransformFnParams) => parseInt(params.value, 10))
	page?: number = 1;

	@IsNumber()
	@IsOptional()
	@Transform((params: TransformFnParams) => parseInt(params.value, 10))
	limit?: number = 10;
}
