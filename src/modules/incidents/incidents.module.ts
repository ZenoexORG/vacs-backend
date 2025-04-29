import { PaginationService } from 'src/shared/services/pagination.service';
import { Module } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident, Vehicle]),
    NotificationsModule,
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService, PaginationService],
  exports: [IncidentsService],
})
export class IncidentsModule {}
