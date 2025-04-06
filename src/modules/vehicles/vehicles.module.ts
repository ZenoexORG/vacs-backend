import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { User } from '../users/entities/user.entity';
import { VehicleClass } from '../vehicle_classes/entities/vehicle-class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, User, VehicleClass])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
