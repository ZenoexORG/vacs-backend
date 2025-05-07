import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Incident } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { getMonthRange } from '../../shared/utils/date.utils';
import { PaginationService } from 'src/shared/services/pagination.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
    private readonly paginationService: PaginationService,
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(createIncidentDto: CreateIncidentDto) {
    const newIncident = await this.incidentRepository.save(createIncidentDto);
    this.notificationsService.notifyIncidentReported(newIncident);
    return newIncident;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const result = await this.paginationService.paginate(
      this.incidentRepository,
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        order: { id: 'ASC' },
        relations: { incident_messages: true },
      },
    );
    return {
      data: result.data,
      meta: result.meta,
    };
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
    await this.incidentRepository.update(id, updateIncidentDto);
    const updatedIncident = await this.incidentRepository.findOne({ where: { id } });
    this.notificationsService.notifyIncidentResolved(updatedIncident);
    return updatedIncident;
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
}
