import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Incident } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { getMonthRange } from '../../shared/utils/date.utils';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
  ) {}

  create(createIncidentDto: CreateIncidentDto) {
    return this.incidentRepository.save(createIncidentDto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    if (!page && !limit) {
      const incidents = await this.incidentRepository.find({order: { id: 'ASC' }});
      return {
        data: incidents,
        meta: {
          page: 1,
          total_pages: 1,
        },
      };
    }
    return this.getPaginatedIncidents(page, limit);
  }

  async findOne(id: number) {
    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    return incident;
  }

  async update(id: number, updateIncidentDto: UpdateIncidentDto) {
    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    return this.incidentRepository.update(id, updateIncidentDto);
  }

  async remove(id: number) {
    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    return this.incidentRepository.delete(id);
  }

  async countIncidents(month: number, year?: number) {
    const { start, end } = getMonthRange(month, year);
    return this.incidentRepository.count({
      where: { incident_date: Between(start, end) },
    });
  }

  private async getPaginatedIncidents(page, limit) {
    const skippedItems = (page - 1) * limit;
    const [incidents, total] = await this.incidentRepository.findAndCount({
      skip: skippedItems,
      take: limit,
      order: { id: 'ASC' },
    });
    return {
      data: incidents,
      meta: {
        page: +page,
        total_pages: Math.ceil(total / limit),
      },
    };
  }
}
