import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Incident } from './entities/incident.entity';
import { handleNotFoundError, handleDatabaseError } from 'src/shared/utils/errors.utils';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentsPaginationDto } from './dto/incidents_pagination.dto';
import { getMonthRange } from '../../shared/utils/date.utils';
import { PaginationService } from 'src/shared/services/pagination.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class IncidentsService {
  private readonly logger = new Logger(IncidentsService.name);
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
    private readonly paginationService: PaginationService,
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(createIncidentDto: CreateIncidentDto) {
    try {
      const newIncident = await this.incidentRepository.save(createIncidentDto);
      const totalIncidents = await this.incidentRepository.count();
      this.notificationsService.notifyIncident(newIncident);
      this.notificationsService.notifyIncidentCount(totalIncidents);
      return newIncident;
    } catch (error) {
      return handleDatabaseError(
        error,
        'creating incident',
        { dto: createIncidentDto },
        this.logger,
      );
    }
  }

  async findAll(paginationDto: IncidentsPaginationDto) {
    const { page, limit, status, priority } = paginationDto;
    const where: any = {}
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }
    const result = await this.paginationService.paginate(
      this.incidentRepository,
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        where: Object.keys(where).length > 0 ? where : undefined,
        order: { id: 'ASC' },
        relations: { incident_messages: true, access_log: true },
        select: {
          id: true,
          access_log_id: true,
          date: true,
          priority: true,
          status: true,
          incident_messages: true,
          access_log: {
            vehicle_id: true
          }
        }

      },
    );
    const transformedData = result.data.map(incident => {
      const { access_log, ...rest } = incident;
      return {
        ...rest,
        vehicle_id: access_log?.vehicle_id || null
      };
    });
    return {
      data: transformedData,
      meta: result.meta,
    };
  }

  async findOne(id: number) {
    try {
      const incident = await this.incidentRepository.findOne(
        {
          where: { id },
          relations: { incident_messages: true, access_log: true },
          select: {
            id: true,
            access_log_id: true,
            date: true,
            priority: true,
            status: true,
            incident_messages: true,
            access_log: {
              vehicle_id: true
            }
          }
        });
      if (!incident) handleNotFoundError('Incident', id, this.logger);
      const { access_log, ...rest } = incident;
      return {
        ...rest,
        vehicle_id: access_log?.vehicle_id || null
      };
    } catch (error) {
      handleDatabaseError(error, 'finding incident', { id }, this.logger,
      );
    }
  }

  async update(id: number, updateIncidentDto: UpdateIncidentDto) {
    try {
      const incident = await this.incidentRepository.findOne({ where: { id } });
      if (!incident) return handleNotFoundError('Incident', id, this.logger);
      await this.incidentRepository.update(id, updateIncidentDto);
      const updatedIncident = await this.incidentRepository.findOne({ where: { id } });
      const totalIncidents = await this.incidentRepository.count();
      this.notificationsService.notifyIncident(updatedIncident);
      this.notificationsService.notifyIncidentCount(totalIncidents);
      return updatedIncident;
    } catch (error) {
      return handleDatabaseError(
        error,
        'updating incident',
        { id, dto: updateIncidentDto },
        this.logger,
      );
    }
  }

  async remove(id: number) {
    try {
      const incident = await this.incidentRepository.findOne({ where: { id } });
      if (!incident) return handleNotFoundError('Incident', id, this.logger);
      return this.incidentRepository.delete(id);
    } catch (error) {
      return handleDatabaseError(
        error,
        'deleting incident',
        { id },
        this.logger,
      );
    }
  }

  async countIncidents(month: number, year?: number) {
    const { start, end } = getMonthRange(month, year);
    return this.incidentRepository.count({
      where: { date: Between(start, end) },
    });
  }

  async findByAccessLogIds(accessLogIds: number[]): Promise<Incident[]> {
    if (!accessLogIds.length) return [];
    return this.incidentRepository.find({
      where: { access_log_id: In(accessLogIds) },
      relations: { incident_messages: true },
    });
  }
}
