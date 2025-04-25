import { PaginationService } from 'src/shared/services/pagination.service';
import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { User } from '../users/entities/user.entity';
import { VehicleType } from '../vehicle_types/entities/vehicle-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, User, VehicleType])],
  controllers: [VehiclesController],
  providers: [VehiclesService, PaginationService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
