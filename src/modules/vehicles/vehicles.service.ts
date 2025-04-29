import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { VehicleType } from '../vehicle_types/entities/vehicle-type.entity';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationService } from 'src/shared/services/pagination.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VehicleType)
    private readonly vehicleTypeRepository: Repository<VehicleType>,
    private readonly paginationService: PaginationService,
    private readonly notificationsService: NotificationsService,
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
    const vehicleType = await this.vehicleTypeRepository.findOne({
      where: { id: createVehicleDto.type_id },
    });
    if (!vehicleType) {
      throw new NotFoundException('Vehicle type not found');
    }    
    const newVehicle = await this.vehicleRepository.save(createVehicleDto);
    this.notificationsService.notifyVehicleCreated(newVehicle);
    return newVehicle;
  }

  async findAll(paginationDto: PaginationDto){
    const { page, limit } = paginationDto;
    const result = await this.paginationService.paginate(
      this.vehicleRepository, 
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        relations: { type: true, user: true },
        order: { id: 'ASC' },
      },
    )    
    return {
      data: this.formatVehicles(result.data),
      meta: result.meta,
    };    
  }

  async findOne(id: string){
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['type', 'user'],
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
    
    if (updateVehicleDto.type_id) {
      const vehicleType = await this.vehicleTypeRepository.findOne({
      where: { id: updateVehicleDto.type_id },
      });
      if (!vehicleType) {
      throw new NotFoundException('Vehicle type not found');
      }
    }
    await this.vehicleRepository.update(id, updateVehicleDto);
    const updatedVehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['type', 'user'],
    });
    this.notificationsService.notifyVehicleUpdated(updatedVehicle);
    return updatedVehicle;    
  }

  async remove(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    this.notificationsService.notifyVehicleDeleted(vehicle);
    return this.vehicleRepository.remove(vehicle);
  }  

  private formatVehicles(vehicles: Vehicle[]){
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      type_id: vehicle.type.id,
      type: vehicle.type.name,
      owner_id: vehicle.user.id,
      fullname: `${vehicle.user.name} ${vehicle.user.last_name}`,
      soat: vehicle.soat ?? null,
      created_at: vehicle.created_at,
    }));
  }
}
