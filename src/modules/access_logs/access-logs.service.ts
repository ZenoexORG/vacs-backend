import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { getMonthRange } from '../../shared/utils/date.utils';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { AccessLog } from './entities/access-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';

@Injectable()
export class AccessLogsService {
  constructor(
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createAccessLogDto: CreateAccessLogDto) {
    const existingOpenLog = await this.accessLogRepository.findOne({
      where: { vehicle_id: createAccessLogDto.vehicle_id, exit_date: IsNull() },
    });

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
      const accessLogs = await this.accessLogRepository.find();
      const vehicleIds = [...new Set(accessLogs.map((log) => log.vehicle_id))];
      const vehicles = await this.vehicleRepository.find({
        where: { id: In(vehicleIds) },
        relations: ['class'],
        select: ['id', 'class', 'user_id'],
      });
      const vehicleMap = new Map(
        vehicles.map((vehicle) => [vehicle.id, vehicle]),
      );
      const enrichedLogs = accessLogs.map((log) => {
        const vehicle = vehicleMap.get(log.vehicle_id);
        return {
          ...log,
          type: vehicle?.class?.name || 'Unknown',
          user_id: vehicle?.user_id || null,
        };
      });
      return {
        data: enrichedLogs,
        meta: {
          page: 1,
          total_pages: 1,
        },
      };
    }
    return this.getPaginatedAccessLogs(page, limit);
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
      order: { entry_date: 'DESC' },
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
        vehicle_id,
      });
    }
  }

  async getVehicleEntriesByDay(month: number, year?: number) {
    const { start, end } = getMonthRange(month, year);
    const result = await this.accessLogRepository
      .createQueryBuilder('log')
      .select([
        "TO_CHAR(log.entry_date, 'MON DD') AS date",
        'COUNT(log.id) AS total',
      ])
      .where('log.entry_date BETWEEN :start AND :end', { start, end })
      .groupBy('date')
      .orderBy('date')
      .getRawMany();

    return result.map(({ date, total }) => ({ date, total: parseInt(total) }));
  }

  private async getPaginatedAccessLogs(page, limit) {
    const skippedItems = (page - 1) * limit;
    const [accessLogs, total] = await this.accessLogRepository.findAndCount({
      skip: skippedItems,
      take: limit,
    });
    const vehicleIds = [...new Set(accessLogs.map((log) => log.vehicle_id))];
    const vehicles = await this.vehicleRepository.find({
      where: { id: In(vehicleIds) },
      relations: ['class'],
      select: ['id', 'class', 'user_id'],
    });
    const vehicleMap = new Map(
      vehicles.map((vehicle) => [vehicle.id, vehicle]),
    );

    const enrichedLogs = accessLogs.map((log) => {
      const vehicle = vehicleMap.get(log.vehicle_id);
      return {
        ...log,
        type: vehicle?.class?.name || 'Unknown',
        user_id: vehicle?.user_id || null,
      };
    });

    return {
      data: enrichedLogs,
      meta: {
        page: +page,
        total_pages: Math.ceil(total / limit),
      },
    };
  }
  1;
}
