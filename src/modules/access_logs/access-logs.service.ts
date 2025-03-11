import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
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

  findAll() {
    return this.accessLogRepository.find();
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
