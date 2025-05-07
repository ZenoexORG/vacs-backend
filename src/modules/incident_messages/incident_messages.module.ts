import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentMessagesController } from './incident_messages.controller'
import { IncidentMessagesService } from './incident_messages.service';
import { IncidentMessage } from './entities/incident_messages.entity';
import { PaginationService } from 'src/shared/services/pagination.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { Incident } from '../incidents/entities/incident.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([IncidentMessage, Incident]),
        NotificationsModule
    ],
    controllers: [IncidentMessagesController],
    providers: [IncidentMessagesService, PaginationService],
    exports: [IncidentMessagesService]
})
export class IncidentMessagesModule { }