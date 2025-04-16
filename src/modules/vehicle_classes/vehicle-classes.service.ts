import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleClass } from './entities/vehicle-class.entity';
import { CreateVehicleClassDto } from './dto/create-vehicle-class.dto';
import { UpdateVehicleClassDto } from './dto/update-vehicle-class.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

@Injectable()
export class VehicleClassesService {
  constructor(
    @InjectRepository(VehicleClass)
    private readonly vehicleClassRepository: Repository<VehicleClass>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createVehicleClassDto: CreateVehicleClassDto) {
    const existingVehicleClass = await this.vehicleClassRepository.findOne({
      where: { name: createVehicleClassDto.name },
    });
    if (existingVehicleClass) {
      throw new BadRequestException('Vehicle Class already exists');
    }
    return this.vehicleClassRepository.save(createVehicleClassDto);
  }

  async findAll(paginationDto: PaginationDto){
    const { page, limit } = paginationDto;
    const result = await this.paginationService.paginate(
      this.vehicleClassRepository,
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
    const vehicleClass = await this.vehicleClassRepository.findOne({
      where: { id },
    });
    if (!vehicleClass) {
      throw new NotFoundException('Vehicle Class not found');
    }
    return vehicleClass;
  }

  async update(id: number, updateVehicleClassDto: UpdateVehicleClassDto) {
    const vehicleClass = await this.vehicleClassRepository.findOne({
      where: { id },
    });
    if (!vehicleClass) {
      throw new NotFoundException('Vehicle Class not found');
    }
    return this.vehicleClassRepository.update(id, updateVehicleClassDto);    
  }

  async remove(id: number) {
    const vehicleClass = await this.vehicleClassRepository.findOne({
      where: { id },
    });
    if (!vehicleClass) {
      throw new NotFoundException('Vehicle Class not found');
    }
    return this.vehicleClassRepository.delete(id);
  }  
}
