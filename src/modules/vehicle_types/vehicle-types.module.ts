import { PaginationService } from 'src/shared/services/pagination.service';
import { Module } from '@nestjs/common';
import { VehicleTypesService } from './vehicle-types.service';
import { VehicleTypesController } from './vehicle-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleType } from './entities/vehicle-type.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleType, Vehicle])],
  controllers: [VehicleTypesController],
  providers: [VehicleTypesService, PaginationService],
  exports: [VehicleTypesService],
})
export class VehicleTypesModule {}
