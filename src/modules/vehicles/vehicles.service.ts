import { Injectable, Logger } from '@nestjs/common';
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
import { handleNotFoundError, handleDatabaseError, handleValidationError } from 'src/shared/utils/errors.utils';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);
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
    try {
      const { id, owner_id, type_id } = createVehicleDto;

      const vehicleExists = await this.vehicleRepository.findOne({ where: { id }, select: { id: true } });
      if (vehicleExists) handleValidationError('id', { dto: createVehicleDto }, this.logger);

      const userExists = await this.userRepository.findOne({ where: { id: owner_id }, select: { id: true } });
      if (!userExists) handleNotFoundError('User not found', owner_id, this.logger);

      const vehicleTypeExists = await this.vehicleTypeRepository.findOne({ where: { id: type_id }, select: { id: true } });
      if (!vehicleTypeExists) handleNotFoundError('Vehicle type not found', type_id, this.logger);

      const newVehicle = await this.vehicleRepository.save(createVehicleDto);

      setImmediate(() => {
        this.notificationsService.notifyVehicle(newVehicle);
      });

      return newVehicle;
    } catch (error) {
      handleDatabaseError(
        error,
        'Error creating vehicle',
        { dto: createVehicleDto },
        this.logger,
      );
    }
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
    try {
      const vehicle = await this.vehicleRepository.findOne({
        where: { id },
        relations: { type: true, user: true },
      });
      if (!vehicle) handleNotFoundError('Vehicle not found', id, this.logger);
      const formattedVehicle = this.formatVehicles([vehicle]);
      return formattedVehicle[0];
    } catch (error) {
      handleDatabaseError(
        error,
        'Error finding vehicle',
        { id },
        this.logger,
      );
    }
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    try {
      const { owner_id, type_id } = updateVehicleDto;
      const vehicleExists = await this.vehicleRepository.findOne({ where: { id }, select: { id: true } });
      if (!vehicleExists) handleNotFoundError('Vehicle not found', id, this.logger);
      const userExists = await this.userRepository.findOne({ where: { id: owner_id }, select: { id: true } });
      if (owner_id && !userExists) handleValidationError('owner_id', { dto: updateVehicleDto }, this.logger);
      const vehicleTypeExists = await this.vehicleTypeRepository.findOne({ where: { id: type_id }, select: { id: true } });
      if (type_id && !vehicleTypeExists) handleValidationError('type_id', { dto: updateVehicleDto }, this.logger);

      await this.vehicleRepository.update(id, updateVehicleDto);
      const updatedVehicle = await this.vehicleRepository.findOne({
        where: { id },
        relations: { type: true, user: true },
      });
      this.notificationsService.notifyVehicle(updatedVehicle);
      return updatedVehicle;
    } catch (error) {
      handleDatabaseError(
        error,
        'Error updating vehicle',
        { id, dto: updateVehicleDto },
        this.logger,
      );
    }
  }

  async remove(id: string): Promise<Vehicle> {
    try {
      const vehicle = await this.vehicleRepository.findOne({ where: { id } });
      if (!vehicle) handleNotFoundError('Vehicle not found', id, this.logger);
      this.notificationsService.notifyVehicle(vehicle);
      return this.vehicleRepository.remove(vehicle);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error deleting vehicle',
        { id },
        this.logger,
      );
    }
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
