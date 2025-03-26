import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { AccessLog } from './entities/access-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { getMonthRange } from '../../shared/utils/date.utils';

@Injectable()
export class AccessLogsService {
  constructor(
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
  ) { }

  async create(createAccessLogDto: CreateAccessLogDto) {    
    const existingOpenLog = await this.accessLogRepository.findOne({ where: { vehicle_id: createAccessLogDto.vehicle_id, exit_date: IsNull() }});

    if (existingOpenLog) {
      throw new BadRequestException('Vehicle already has an open access log');
    }
    
    const entryDate = new Date(createAccessLogDto.entry_date);
    if (isNaN(entryDate.getTime())) {
      throw new BadRequestException('Invalid entry date');
    }
    
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

  async findOne(id: number) {
    const accessLog = await this.accessLogRepository.findOne({ where: { id } });
    if (!accessLog) {
      throw new NotFoundException('Access log not found');
    }
    return accessLog;
  }

  async update(id: number, updateAccessLogDto: UpdateAccessLogDto) {
    const accessLog = await this.accessLogRepository.findOne({ where: { id } });
    if (!accessLog) {
      throw new NotFoundException('Access log not found');
    }
    return this.accessLogRepository.update(id, updateAccessLogDto);
  }

  async remove(id: number) {
    const accessLog = await this.accessLogRepository.findOne({ where: { id } });
    if (!accessLog) {
      throw new NotFoundException('Access log not found');
    }
    return this.accessLogRepository.delete(id);
  }

  async registerEntryOrExit(vehicle_id: string, timestamp: string) {
    const latestAccessLog = await this.accessLogRepository.findOne({ 
      where: { vehicle_id },
      order: { entry_date: 'DESC' }
    });    

    const newTimestamp = new Date(timestamp);

    if (isNaN(newTimestamp.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (latestAccessLog && !latestAccessLog.exit_date) {
      const entryDate = new Date(latestAccessLog.entry_date);
      if (newTimestamp < entryDate) {
        throw new BadRequestException('Exit date cannot be before entry date');
      }
      return this.update(latestAccessLog.id, { exit_date: newTimestamp });
    } else {
      return this.accessLogRepository.save({ 
        entry_date: newTimestamp, 
        vehicle_id 
      });    
    }
  }

  async getVehicleEntriesByDay(month: number, year?: number) {
    const { start, end } = getMonthRange(month, year);
    const result = await this.accessLogRepository
      .createQueryBuilder('log')
      .select([
        "TO_CHAR(log.entry_date, 'MON DD') AS date",
        "COUNT(log.id) AS total"
      ])
      .where('log.entry_date BETWEEN :start AND :end', { start, end })
      .groupBy('date')
      .orderBy('date')
      .getRawMany();
    
    return result.map(({ date, total }) => ({ date, total: parseInt(total) }));
  }  
}
