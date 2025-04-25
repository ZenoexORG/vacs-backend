import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleType } from './entities/vehicle-type.entity';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

@Injectable()
export class VehicleTypesService {
  constructor(
    @InjectRepository(VehicleType)
    private readonly vehicleTypeRepository: Repository<VehicleType>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createVehicleTypeDto: CreateVehicleTypeDto) {
    const existingVehicleType = await this.vehicleTypeRepository.findOne({
      where: { name: createVehicleTypeDto.name },
    });
    if (existingVehicleType) {
      throw new BadRequestException('Vehicle type already exists');
    }
    return this.vehicleTypeRepository.save(createVehicleTypeDto);
  }

  async findAll(paginationDto: PaginationDto){
    const { page, limit } = paginationDto;
    const result = await this.paginationService.paginate(
      this.vehicleTypeRepository,
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        order: { id: 'ASC' },
      },
    );
    return {
      data: result.data,
      meta: result.meta,
    };    
  }

  async findOne(id: number) {
    const vehicleType = await this.vehicleTypeRepository.findOne({
      where: { id },
    });
    if (!vehicleType) {
      throw new NotFoundException('Vehicle type not found');
    }
    return vehicleType;
  }

  async update(id: number, updateVehicleTypeDto: UpdateVehicleTypeDto) {
    const vehicleType = await this.vehicleTypeRepository.findOne({
      where: { id },
    });
    if (!vehicleType) {
      throw new NotFoundException('Vehicle type not found');
    }
    return this.vehicleTypeRepository.update(id, updateVehicleTypeDto);    
  }

  async remove(id: number) {
    const vehicleType = await this.vehicleTypeRepository.findOne({
      where: { id },
    });
    if (!vehicleType) {
      throw new NotFoundException('Vehicle type not found');
    }
    return this.vehicleTypeRepository.delete(id);
  }  
}
