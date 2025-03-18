import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleClass } from './entities/vehicle-class.entity';
import { CreateVehicleClassDto } from './dto/create-vehicle-class.dto';
import { UpdateVehicleClassDto } from './dto/update-vehicle-class.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

@Injectable()
export class VehicleClassesService {
    constructor(
        @InjectRepository(VehicleClass)
        private readonly vehicleClassRepository: Repository<VehicleClass>,
    ) { }

    async create(createVehicleClassDto: CreateVehicleClassDto) {
        const existingVehicleClass = await this.vehicleClassRepository.findOne({ where: { name: createVehicleClassDto.name } });
        if (existingVehicleClass) {
            throw new BadRequestException('Vehicle Class already exists');
        }
        return this.vehicleClassRepository.save(createVehicleClassDto);
    }

    async findAll(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        if (!page && !limit) {
            return this.vehicleClassRepository.find()
        }
        return this.getPaginatedVehicleClasses(page, limit);
    }

    private async getPaginatedVehicleClasses(page, limit) {
        const skippedItems = (page - 1) * limit;
        const [vehicleClasses, total] = await this.vehicleClassRepository.findAndCount({ skip: skippedItems, take: limit });
        return {
            data: vehicleClasses,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
                per_page: limit,
            }
        }
    }

    async findOne(id: number) {
        const vehicleClass = await this.vehicleClassRepository.findOne({ where: { id } });
        if (!vehicleClass) {
            throw new NotFoundException('Vehicle Class not found');
        }
        return vehicleClass;
    }

    async update(id: number, updateVehicleClassDto: UpdateVehicleClassDto) {
        const vehicleClass = await this.vehicleClassRepository.findOne({ where: { id } });
        if (!vehicleClass) {
            throw new NotFoundException('Vehicle Class not found');
        }
        return this.vehicleClassRepository.update(id, updateVehicleClassDto);
    }

    async remove(id: number) {
        const vehicleClass = await this.vehicleClassRepository.findOne({ where: { id } });
        if (!vehicleClass) {
            throw new NotFoundException('Vehicle Class not found');
        }
        return this.vehicleClassRepository.delete(id);
    }
}
