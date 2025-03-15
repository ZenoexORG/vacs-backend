import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

@Injectable()
export class VehiclesService {
    constructor(
        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>,
    ) { }

    create(createVehicleDto: CreateVehicleDto) {
        return this.vehicleRepository.save(createVehicleDto);
    }

    async findAll(paginationDto: PaginationDto) {        
        const { page, limit } = paginationDto;        
        if (!page && !limit) {
            return this.vehicleRepository.find()
        }
        return this.getPaginatedVehicles(page, limit);
    }
    
    private async getPaginatedVehicles(page, limit) {           
        const skippedItems = (page - 1) * limit;
        const [vehicles, total] = await this.vehicleRepository.findAndCount({ skip: skippedItems, take: limit });
        return {
            data: vehicles,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
                per_page: limit,
            }
        }
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
