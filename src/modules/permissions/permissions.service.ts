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

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
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
    if (!page && !limit) {
      const permissions = await this.permissionsRepository.find();
      return {
        data: permissions,
        meta: {
          page: 1,
          total_pages: 1,
        },
      };
    }
    return this.getPaginatedPermissions(page, limit);
  }

  private async getPaginatedPermissions(page, limit) {
    const skippedItems = (page - 1) * limit;
    const [permissions, total] = await this.permissionsRepository.findAndCount({
      skip: skippedItems,
      take: limit,
    });
    return {
      data: permissions,
      meta: {
        page: +page,
        total_pages: Math.ceil(total / limit),
      },
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
