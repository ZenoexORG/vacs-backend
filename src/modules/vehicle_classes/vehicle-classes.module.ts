import { Module } from '@nestjs/common';
import { VehicleClassesService } from './vehicle-classes.service';
import { VehicleClassesController } from './vehicle-classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleClass } from './entities/vehicle-class.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleClass, Vehicle])],
  controllers: [VehicleClassesController],
  providers: [VehicleClassesService],
})
export class VehicleClassesModule { }
