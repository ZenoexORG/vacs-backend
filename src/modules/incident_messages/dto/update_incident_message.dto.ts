import { PartialType } from '@nestjs/swagger';
import { CreateIncidentMessageDto } from './create_incident_message.dto';

export class UpdateIncidentMessageDto extends PartialType(CreateIncidentMessageDto) { }