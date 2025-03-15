import { Injectable } from "@nestjs/common";
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

    findOne(id: number) {
        return this.incidentRepository.findOne({ where: { id } });
    }

    update(id: number, updateIncidentDto: UpdateIncidentDto) {
        return this.incidentRepository.update(id, updateIncidentDto);
    }

    remove(id: number) {
        return this.incidentRepository.delete(id);
    }
}
