import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral, FindOptionsOrder, FindOptionsWhere, FindOptionsRelations } from 'typeorm';
import { PaginatedResponse } from '../interfaces/pagination.interface';

@Injectable()
export class PaginationService {
  async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    page: number,
    limit: number,
    options: {
      order?: FindOptionsOrder<T>;
      where?: FindOptionsWhere<T>;
      relations?: FindOptionsRelations<T>;
    } = {}
  ): Promise<PaginatedResponse<T>> {
    const skippedItems = (page - 1) * limit;
    
    const [data, total] = await repository.findAndCount({
      skip: skippedItems,
      take: limit,
      order: options.order || ({} as FindOptionsOrder<T>),
      where: options.where,
      relations: options.relations,
    });

    return {
      data,
      meta: {
        page: +page,
        total_pages: Math.max(1,Math.ceil(total / limit)),
      },
    };
  }
}