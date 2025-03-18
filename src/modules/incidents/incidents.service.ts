import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Incident } from "./entities/incident.entity";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import { UpdateIncidentDto } from "./dto/update-incident.dto";
import { PaginationDto } from "../../shared/dtos/pagination.dto";

@Injectable()
export class IncidentsService {
    constructor(
        @InjectRepository(Incident)
        private readonly incidentRepository: Repository<Incident>,
    ) { }

    create(createIncidentDto: CreateIncidentDto) {        
        return this.incidentRepository.save(createIncidentDto);
    }

    async findAll(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        if (!page && !limit) {
            return this.incidentRepository.find();
        }
        return this.getPaginatedIncidents(page, limit);
    }

    private async getPaginatedIncidents(page, limit) {
        const skippedItems = (page - 1) * limit;
        const [incidents, total] = await this.incidentRepository.findAndCount({ skip: skippedItems, take: limit });
        return {
            data: incidents,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
                per_page: limit,
            }
        }
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
}
