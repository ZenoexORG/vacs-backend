import { PaginationService } from 'src/shared/services/pagination.service';
import { Module } from '@nestjs/common';
import { VehicleTypesService } from './vehicle-types.service';
import { VehicleTypesController } from './vehicle-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleType } from './entities/vehicle-type.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { AccessLog } from '../access_logs/entities/access-log.entity';
import { IncidentsModule } from '../incidents/incidents.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([VehicleType, Vehicle, AccessLog]),
    IncidentsModule,
    BullModule.registerQueue({ name: 'dwell-time' }),
  ],
  controllers: [VehicleTypesController],
  providers: [VehicleTypesService, PaginationService],
  exports: [VehicleTypesService],
})
export class VehicleTypesModule { }
