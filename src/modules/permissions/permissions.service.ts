import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { Permission } from './entities/permission.entity';
import { PaginationService } from 'src/shared/services/pagination.service';
import { handleNotFoundError, handleDatabaseError, handleValidationError } from 'src/shared/utils/errors.utils';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    private readonly paginationService: PaginationService,
  ) { }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    try {
      const existingPermission = await this.permissionsRepository.findOne({
        where: { name: createPermissionDto.name },
      });
      if (existingPermission) handleValidationError('name', { dto: createPermissionDto }, this.logger);
      return this.permissionsRepository.save(createPermissionDto);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error creating permission',
        { dto: createPermissionDto },
        this.logger,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const result = await this.paginationService.paginate(
      this.permissionsRepository,
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
      const permission = await this.permissionsRepository.findOne({
        where: { id },
      });
      if (!permission) handleNotFoundError('Permission not found', id, this.logger);
      return permission;
    } catch (error) {
      handleDatabaseError(
        error,
        'Error finding permission',
        { id },
        this.logger,
      );
    }
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      const permission = await this.permissionsRepository.findOne({
        where: { id },
      });
      if (!permission) handleNotFoundError('Permission not found', id, this.logger);
      return this.permissionsRepository.update(id, updatePermissionDto);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error updating permission',
        { id, dto: updatePermissionDto },
        this.logger,
      );
    }
  }

  async remove(id: number) {
    try {
      const permission = await this.permissionsRepository.findOne({
        where: { id },
      });
      if (!permission) handleNotFoundError('Permission not found', id, this.logger);
      return this.permissionsRepository.delete(id);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error deleting permission',
        { id },
        this.logger,
      );
    }
  }
}
