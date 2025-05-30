import { PaginationService } from 'src/shared/services/pagination.service';
import { Module } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { BullModule } from '@nestjs/bull';
import { DwellTimeProcessor } from './dwell-time.processor';
import { DwellTimeMonitorService } from './dwell-time-monitor.service';
import { AccessLog } from '../access_logs/entities/access-log.entity';
import { VehicleType } from '../vehicle_types/entities/vehicle-type.entity';
import { TimezoneService } from 'src/shared/services/timezone.service';
import { IncidentMessage } from '../incident_messages/entities/incident_messages.entity';


@Module({
  imports: [
    BullModule.registerQueue({ name: 'dwell-time', }),
    TypeOrmModule.forFeature([Incident, Vehicle, AccessLog, VehicleType, IncidentMessage]),
    NotificationsModule,
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService, PaginationService,
    DwellTimeProcessor, DwellTimeMonitorService, TimezoneService],
  exports: [IncidentsService, DwellTimeMonitorService, DwellTimeProcessor],
})
export class IncidentsModule { }
