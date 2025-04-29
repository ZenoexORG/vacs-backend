import { Module } from '@nestjs/common';
import { AccessLogsService } from './access-logs.service';
import { PaginationService } from '../../shared/services/pagination.service';
import { AccessLogsController } from './access-logs.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessLog } from './entities/access-log.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessLog, Vehicle]),
    NotificationsModule
  ],
  controllers: [AccessLogsController],
  providers: [AccessLogsService, PaginationService],
  exports: [AccessLogsService],
})
export class AccessLogsModule {}
