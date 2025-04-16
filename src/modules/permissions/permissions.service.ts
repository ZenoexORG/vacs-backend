import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { Permission } from './entities/permission.entity';
import { PaginationService } from 'src/shared/services/pagination.service';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existingPermission = await this.permissionsRepository.findOne({
      where: { name: createPermissionDto.name },
    });
    if (existingPermission) {
      throw new BadRequestException('Permission already exists');
    }
    return this.permissionsRepository.save(createPermissionDto);
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
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return this.permissionsRepository.update(id, updatePermissionDto);
  }

  async remove(id: number) {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return this.permissionsRepository.delete(id);
  }  
}
