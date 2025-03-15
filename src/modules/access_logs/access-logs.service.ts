import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { AccessLog } from './entities/access-log.entity';

@Injectable()
export class AccessLogsService {
  constructor(
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
  ) { }

  create(createAccessLogDto: CreateAccessLogDto) {
    return this.accessLogRepository.save(createAccessLogDto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    if (!page && !limit) {
      return this.accessLogRepository.find();
    }
    return this.getPaginatedAccessLogs(page, limit);
  }

  private async getPaginatedAccessLogs(page, limit) {
    const skippedItems = (page - 1) * limit;
    const [accessLogs, total] = await this.accessLogRepository.findAndCount({ skip: skippedItems, take: limit });
    return {
      data: accessLogs,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
        per_page: limit,
      }
    }
  }

  findOne(id: number) {
    return this.accessLogRepository.findOne({ where: { id } });
  }

  update(id: number, updateAccessLogDto: UpdateAccessLogDto) {
    return this.accessLogRepository.update(id, updateAccessLogDto);
  }

  remove(id: number) {
    return this.accessLogRepository.delete(id);
  }
}
