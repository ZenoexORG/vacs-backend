import { Module } from '@nestjs/common';
import { AccessLogsService } from './access-logs.service';
import { PaginationService } from '../../shared/services/pagination.service';
import { AccessLogsController } from './access-logs.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessLog } from './entities/access-log.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { VehicleType } from '../vehicle_types/entities/vehicle-type.entity';
import { IncidentsModule } from '../incidents/incidents.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'dwell-time' }),
    TypeOrmModule.forFeature([AccessLog, Vehicle, VehicleType]),
    IncidentsModule,
    NotificationsModule
  ],
  controllers: [AccessLogsController],
  providers: [AccessLogsService, PaginationService],
  exports: [AccessLogsService],
})
export class AccessLogsModule { }
