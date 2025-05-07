import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from '../incidents/entities/incident.entity';
import { IncidentMessage } from './entities/incident_messages.entity';
import { CreateIncidentMessageDto } from './dto/create_incident_message.dto';
import { UpdateIncidentMessageDto } from './dto/update_incident_message.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

@Injectable()
export class IncidentMessagesService {
	constructor(
		@InjectRepository(IncidentMessage)
		private readonly incidentMessageRepository: Repository<IncidentMessage>,
		@InjectRepository(Incident)
		private readonly incidentRepository: Repository<Incident>,
		private readonly paginationService: PaginationService,
	) { }

	async create(createIncidentMessageDto: CreateIncidentMessageDto, authorId: string) {
		const incident = await this.incidentRepository.findOne({
			where: { id: createIncidentMessageDto.incident_id },
			select: { id: true }
		});
		if (!incident) throw new NotFoundException(`Incident with ID ${createIncidentMessageDto.incident_id} not found`);
		const newIncidentMessage = this.incidentMessageRepository.create({
			...createIncidentMessageDto,
			author: { id: authorId },
		});
		return this.incidentMessageRepository.save(newIncidentMessage);
	}

	async findAll(paginationDto: PaginationDto) {
		const { page, limit } = paginationDto;

		return this.paginationService.paginate(
			this.incidentMessageRepository,
			page || 1,
			limit || Number.MAX_SAFE_INTEGER,
			{
				order: { created_at: 'desc' },
				relations: { incident: true, author: true }
			}
		);
	}

	async findOne(id: number) {
		const message = await this.incidentMessageRepository.findOne({
			where: { id },
			relations: { incident: true, author: true }
		});

		if (!message) {
			throw new NotFoundException(`Incident message with ID ${id} not found`);
		}

		return message;
	}

	async update(id: number, updateIncidentMessageDto: UpdateIncidentMessageDto) {
		const message = await this.incidentMessageRepository.findOne({
			where: { id }
		});

		if (!message) {
			throw new NotFoundException(`Incident message with ID ${id} not found`);
		}

		await this.incidentMessageRepository.update(id, updateIncidentMessageDto);

		const updatedMessage = await this.incidentMessageRepository.findOne({
			where: { id },
			relations: { incident: true, author: true }
		});

		return updatedMessage;
	}

	async remove(id: number) {
		const message = await this.incidentMessageRepository.findOne({
			where: { id }
		});

		if (!message) {
			throw new NotFoundException(`Incident message with ID ${id} not found`);
		}

		return this.incidentMessageRepository.remove(message);
	}
}