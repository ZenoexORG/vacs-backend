import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    async create(createVehicleDto: CreateVehicleDto) {
        const existingVehicle = await this.vehicleRepository.findOne({ where: { id: createVehicleDto.id } });
        if (existingVehicle) {
            throw new BadRequestException('Vehicle already exists');
        }
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

    async findOne(id: string) {
        const vehicle = await this.vehicleRepository.findOne({ where: { id } });
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }
        return vehicle
    }

    async update(id: string, updateVehicleDto: UpdateVehicleDto) {
        const vehicle = await this.vehicleRepository.findOne({ where: { id } });
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }
        return this.vehicleRepository.update(id, updateVehicleDto);
    }

    async remove(id: string) {
        const vehicle = await this.vehicleRepository.findOne({ where: { id } });
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }
        return this.vehicleRepository.remove(vehicle);
    }
}
