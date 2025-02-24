import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
    constructor(
        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>,
    ) { }

    create(createVehicleDto: CreateVehicleDto) {
        return this.vehicleRepository.save(createVehicleDto);
    }

    findAll() {
        return this.vehicleRepository.find();
    }

    findOne(id: string) {
        return this.vehicleRepository.findOne({ where: { id } });
    }

    update(id: string, updateVehicleDto: UpdateVehicleDto) {
        return this.vehicleRepository.update(id, updateVehicleDto);
    }

    remove(id: string) {
        return this.vehicleRepository.delete(id);
    }
}