import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { VehicleType } from '../vehicle_types/entities/vehicle-type.entity';
import { PaginationService } from 'src/shared/services/pagination.service';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
  ) { }

  async create(createVehicleDto: CreateVehicleDto) {
    const { id, owner_id, type_id } = createVehicleDto;

    const vehicleExists = await this.vehicleRepository.findOne({ where: { id }, select: { id: true } });
    if (vehicleExists) throw new BadRequestException('Vehicle with this license plate already exists');

    const userExists = await this.userRepository.findOne({ where: { id: owner_id }, select: { id: true } });
    if (!userExists) throw new NotFoundException('User with this identifier does not exist');

    const vehicleTypeExists = await this.vehicleTypeRepository.findOne({ where: { id: type_id }, select: { id: true } });
    if (!vehicleTypeExists) throw new NotFoundException('Vehicle type does not exist');

    const newVehicle = await this.vehicleRepository.save(createVehicleDto);

    setImmediate(() => {
      this.notificationsService.notifyVehicleCreated(newVehicle);
    });

    return newVehicle;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const result = await this.paginationService.paginate(
      this.vehicleRepository,
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        relations: { type: true, user: true },
        order: { created_at: 'DESC' },
      },
    )
    return {
      data: this.formatVehicles(result.data),
      meta: result.meta,
    };
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: { type: true, user: true },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }
    const formattedVehicle = this.formatVehicles([vehicle]);
    return formattedVehicle[0];
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const { owner_id, type_id } = updateVehicleDto;

    const vehicleExists = await this.vehicleRepository.findOne({ where: { id }, select: { id: true } });
    if (!vehicleExists) throw new NotFoundException(`Vehicle with id ${id} not found`);
    const userExists = await this.userRepository.findOne({ where: { id: owner_id }, select: { id: true } });
    if (!userExists) throw new NotFoundException(`User with id ${owner_id} does not exist`);
    const vehicleTypeExists = await this.vehicleTypeRepository.findOne({ where: { id: type_id }, select: { id: true } });
    if (!vehicleTypeExists) throw new NotFoundException(`Vehicle type does not exist`);

    await this.vehicleRepository.update(id, updateVehicleDto);
    const updatedVehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: { type: true, user: true },
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

  private formatVehicles(vehicles: Vehicle[]) {
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      type_id: vehicle.type.id,
      type: vehicle.type.name,
      owner_id: vehicle.user.id,
      owner_fullname: `${vehicle.user.name} ${vehicle.user.last_name}`,
      soat: vehicle.soat ?? null,
      created_at: vehicle.created_at,
    }));
  }
}
