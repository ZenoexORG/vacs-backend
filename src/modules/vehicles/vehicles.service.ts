import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { VehicleClass } from '../vehicle_classes/entities/vehicle-class.entity';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { getMonthRange } from 'src/shared/utils/date.utils';
import { Vehicle } from './entities/vehicle.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VehicleClass)
    private readonly vehicleClassRepository: Repository<VehicleClass>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { id: createVehicleDto.id },
    });
    if (existingVehicle) {
      throw new BadRequestException('Vehicle already exists');
    }
    const user = await this.userRepository.findOne({
      where: { id: createVehicleDto.user_id },
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
    if (!page && !limit) {
      const vehicles = await this.vehicleRepository.find({
        relations: ['class', 'user'],
      });
      const formattedVehicles = this.formatVehicles(vehicles);
      return {
        data: formattedVehicles,
        meta: {
          page: 1,
          total_pages: 1,
        },
      };
    }
    return this.getPaginatedVehicles(page, limit);
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
    return this.vehicleRepository.update(id, updateVehicleDto);
  }

  async remove(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return this.vehicleRepository.remove(vehicle);
  }

  async countVehicles(month: number): Promise<number> {
    const { start, end } = getMonthRange(month);
    return this.vehicleRepository.count({
      where: { created_at: Between(start, end) },
    });
  }

  private async getPaginatedVehicles(page, limit){
    const skippedItems = (page - 1) * limit;
    const [vehicles, total] = await this.vehicleRepository.findAndCount({
      skip: skippedItems,
      take: limit,
      relations: ['class', 'user'],
    });
    const formattedVehicles = this.formatVehicles(vehicles);
    return {
      data: formattedVehicles,
      meta: {
        page: +page,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  private formatVehicles(vehicles: Vehicle[]){
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      type: vehicle.class.name,
      user_id: vehicle.user.id,
      user_fullname: `${vehicle.user.name} ${vehicle.user.last_name}`,
      soat: vehicle.soat ?? null,
      created_at: vehicle.created_at,
    }));
  }
}
