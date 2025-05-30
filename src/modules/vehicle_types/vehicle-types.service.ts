import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleType } from './entities/vehicle-type.entity';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { PaginationService } from 'src/shared/services/pagination.service';
import { handleNotFoundError, handleDatabaseError, handleValidationError } from 'src/shared/utils/errors.utils';
import { DwellTimeMonitorService } from '../incidents/dwell-time-monitor.service';

@Injectable()
export class VehicleTypesService {
  private readonly logger = new Logger(VehicleTypesService.name);
  constructor(
    @InjectRepository(VehicleType)
    private readonly vehicleTypeRepository: Repository<VehicleType>,
    private readonly paginationService: PaginationService,
    private readonly dwellTimeMonitorService: DwellTimeMonitorService,
  ) { }

  async create(createVehicleTypeDto: CreateVehicleTypeDto) {
    try {
      const existingVehicleType = await this.vehicleTypeRepository.findOne({
        where: { name: createVehicleTypeDto.name },
      });
      if (existingVehicleType) handleValidationError('name', { dto: createVehicleTypeDto }, this.logger);
      return this.vehicleTypeRepository.save(createVehicleTypeDto);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error creating vehicle type',
        { dto: createVehicleTypeDto },
        this.logger,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
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
    try {
      const vehicleType = await this.vehicleTypeRepository.findOne({
        where: { id },
      });
      if (!vehicleType) handleNotFoundError('Vehicle type not found', id, this.logger);
      return vehicleType;
    } catch (error) {
      handleDatabaseError(
        error,
        'Error finding vehicle type',
        { id },
        this.logger,
      );
    }
  }

  async update(id: number, updateVehicleTypeDto: UpdateVehicleTypeDto) {
    try {
      const vehicleType = await this.vehicleTypeRepository.findOne({
        where: { id },
      });
      if (!vehicleType) handleNotFoundError('Vehicle type not found', id, this.logger);
      const result = await this.vehicleTypeRepository.update(id, updateVehicleTypeDto);
      await this.dwellTimeMonitorService.loadAllowedTimesFromDb();
      return result;
    } catch (error) {
      handleDatabaseError(
        error,
        'Error updating vehicle type',
        { id, dto: updateVehicleTypeDto },
        this.logger,
      );
    }
  }

  async remove(id: number) {
    try {
      const vehicleType = await this.vehicleTypeRepository.findOne({
        where: { id },
      });
      if (!vehicleType) handleNotFoundError('Vehicle type not found', id, this.logger);
      return this.vehicleTypeRepository.delete(id);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error deleting vehicle type',
        { id },
        this.logger,
      );
    }
  }
}
