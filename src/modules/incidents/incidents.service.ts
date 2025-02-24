import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Incident } from "./entities/incident.entity";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import { UpdateIncidentDto } from "./dto/update-incident.dto";

@Injectable()
export class IncidentsService {
    constructor(
        @InjectRepository(Incident)
        private readonly incidentRepository: Repository<Incident>,
    ) { }

    create(createIncidentDto: CreateIncidentDto) {
        return this.incidentRepository.save(createIncidentDto);
    }

    findAll() {
        return this.incidentRepository.find();
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
