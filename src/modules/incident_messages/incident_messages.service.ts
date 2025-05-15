import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from '../incidents/entities/incident.entity';
import { IncidentMessage } from './entities/incident_messages.entity';
import { CreateIncidentMessageDto } from './dto/create_incident_message.dto';
import { UpdateIncidentMessageDto } from './dto/update_incident_message.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { PaginationService } from 'src/shared/services/pagination.service';
import { handleNotFoundError, handleDatabaseError } from 'src/shared/utils/errors.utils';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class IncidentMessagesService {
	private readonly logger = new Logger(IncidentMessagesService.name);
	constructor(
		@InjectRepository(IncidentMessage)
		private readonly incidentMessageRepository: Repository<IncidentMessage>,
		@InjectRepository(Incident)
		private readonly incidentRepository: Repository<Incident>,
		private readonly paginationService: PaginationService,
		private readonly notificationsService: NotificationsService,
	) { }

	async create(createIncidentMessageDto: CreateIncidentMessageDto, authorId: string) {
		try {
			const incident = await this.incidentRepository.findOne({
				where: { id: createIncidentMessageDto.incident_id },
				select: { id: true }
			});
			if (!incident) handleNotFoundError('Incident', createIncidentMessageDto.incident_id, this.logger);
			const newIncidentMessage = this.incidentMessageRepository.create({
				...createIncidentMessageDto,
				author: { id: authorId },
			});
			const result = await this.incidentMessageRepository.save(newIncidentMessage);
			this.notificationsService.notifyIncidentMessages(result)
			return result;
		} catch (error) {
			handleDatabaseError(
				error,
				'creating incident message',
				{ dto: createIncidentMessageDto },
				this.logger,
			);
		}
	}

	async findAll(paginationDto: PaginationDto) {
		const { page, limit } = paginationDto;

		const result = await this.paginationService.paginate(
			this.incidentMessageRepository,
			page || 1,
			limit || Number.MAX_SAFE_INTEGER,
			{
				order: { created_at: 'desc' },
				relations: { incident: true, author: true },
				select: {
					id: true,
					incident_id: true,
					message: true,
					created_at: true,
					incident: {
						id: true,
						access_log_id: true,
						date: true,
						priority: true,
						status: true,
					},
					author: {
						name: true,
						last_name: true,
					}
				}
			}
		);
		const formattedResult = result.data.map((message) => {
			const { author, ...rest } = message;
			return {
				...rest,
				author: `${author.name} ${author.last_name}`,
			}
		});
		return {
			data: formattedResult,
			meta: result.meta,
		};
	}

	async findOne(id: number) {
		try {
			const message = await this.incidentMessageRepository.findOne({
				where: { id },
				relations: { incident: true, author: true },
				select: {
					id: true,
					incident_id: true,
					message: true,
					created_at: true,
					incident: {
						id: true,
						access_log_id: true,
						date: true,
						priority: true,
						status: true,
					},
					author: {
						name: true,
						last_name: true,
					}
				}
			});

			if (!message) {
				handleNotFoundError('Incident message', id, this.logger);
			}
			const { author, ...rest } = message;
			return {
				...rest,
				author: `${author.name} ${author.last_name}`,
			}
		} catch (error) {
			handleDatabaseError(
				error,
				'finding incident message',
				{ id },
				this.logger,
			);
		}
	}

	async update(id: number, updateIncidentMessageDto: UpdateIncidentMessageDto) {
		try {
			const message = await this.incidentMessageRepository.findOne({
				where: { id }
			});

			if (!message) handleNotFoundError('Incident message', id, this.logger);

			await this.incidentMessageRepository.update(id, updateIncidentMessageDto);

			const updatedMessage = await this.incidentMessageRepository.findOne({
				where: { id },
				relations: { incident: true, author: true }
			});
			this.notificationsService.notifyIncidentMessages(updatedMessage)
			return updatedMessage;
		} catch (error) {
			handleDatabaseError(
				error,
				'updating incident message',
				{ id, dto: updateIncidentMessageDto },
				this.logger,
			);
		}
	}

	async remove(id: number) {
		try {
			const message = await this.incidentMessageRepository.findOne({
				where: { id }
			});

			if (!message) handleNotFoundError('Incident message', id, this.logger);
			return this.incidentMessageRepository.remove(message);
		} catch (error) {
			handleDatabaseError(
				error,
				'deleting incident message',
				{ id },
				this.logger,
			);
		}
	}
}