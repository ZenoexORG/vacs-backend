import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { VehicleClass } from '../vehicle_classes/entities/vehicle-class.entity';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationService } from 'src/shared/services/pagination.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VehicleClass)
    private readonly vehicleClassRepository: Repository<VehicleClass>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { id: createVehicleDto.id },
    });
    if (existingVehicle) {
      throw new BadRequestException('Vehicle already exists');
    }
    const user = await this.userRepository.findOne({
      where: { id: createVehicleDto.owner_id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const vehicleClass = await this.vehicleClassRepository.findOne({
      where: { id: createVehicleDto.class_id },
    });
    if (!vehicleClass) {
      throw new NotFoundException('Vehicle class not found');
    }
    return this.vehicleRepository.save(createVehicleDto);
  }

  async findAll(paginationDto: PaginationDto){
    const { page, limit } = paginationDto;
    const result = await this.paginationService.paginate(
      this.vehicleRepository, 
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        relations: { class: true, user: true },
        order: { id: 'ASC' },
      },
    )
    const formattedVehicles = this.formatVehicles(result.data);
    return {
      data: formattedVehicles,
      meta: result.meta,
    };    
  }

  async findOne(id: string){
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['class', 'user'],
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    const formattedVehicle = this.formatVehicles([vehicle]);
    return formattedVehicle[0];
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    if (updateVehicleDto.owner_id) {
      const user = await this.userRepository.findOne({
      where: { id: updateVehicleDto.owner_id },
      });
      if (!user) {
      throw new NotFoundException('User not found');
      }
    }
    
    if (updateVehicleDto.class_id) {
      const vehicleClass = await this.vehicleClassRepository.findOne({
      where: { id: updateVehicleDto.class_id },
      });
      if (!vehicleClass) {
      throw new NotFoundException('Vehicle class not found');
      }
    }
    return this.vehicleRepository.update(id, updateVehicleDto);
  }

  async remove(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return this.vehicleRepository.remove(vehicle);
  }  

  private formatVehicles(vehicles: Vehicle[]){
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      type: vehicle.class.name,
      owner_id: vehicle.user.id,
      user_fullname: `${vehicle.user.name} ${vehicle.user.last_name}`,
      soat: vehicle.soat ?? null,
      created_at: vehicle.created_at,
    }));
  }
}
