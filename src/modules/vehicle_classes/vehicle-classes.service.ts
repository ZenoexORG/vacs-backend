import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleClass } from './entities/vehicle-class.entity';
import { CreateVehicleClassDto } from './dto/create-vehicle-class.dto';
import { UpdateVehicleClassDto } from './dto/update-vehicle-class.dto';

@Injectable()
export class VehicleClassesService {
    constructor(
        @InjectRepository(VehicleClass)
        private readonly vehicleClassRepository: Repository<VehicleClass>,
    ) { }

    create(createVehicleClassDto: CreateVehicleClassDto) {
        return this.vehicleClassRepository.save(createVehicleClassDto);
    }

    findAll() {
        return this.vehicleClassRepository.find();
    }

    findOne(id: number) {
        return this.vehicleClassRepository.findOne({ where: { id } });
    }

    update(id: number, updateVehicleClassDto: UpdateVehicleClassDto) {
        return this.vehicleClassRepository.update(id, updateVehicleClassDto);
    }

    remove(id: number) {
        return this.vehicleClassRepository.delete(id);
    }
}
