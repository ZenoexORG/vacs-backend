import { Injectable } from '@nestjs/common';
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
    ) { }

    async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        const permission = this.permissionsRepository.create(createPermissionDto);
        return this.permissionsRepository.save(permission);
    }

    async findAll(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        if (!page && !limit) {
            return this.permissionsRepository.find();
        }
        return this.getPaginatedPermissions(page, limit);
    }

    private async getPaginatedPermissions(page, limit) {
        const skippedItems = (page - 1) * limit;
        const [permissions, total] = await this.permissionsRepository.findAndCount({ skip: skippedItems, take: limit });
        return {
            data: permissions,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
                per_page: limit,
            }
        }
    }

    async findOne(id: number) {
        return this.permissionsRepository.findOne({ where: { id } });
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto) {
        return this.permissionsRepository.update(id, updatePermissionDto);
    }

    async remove(id: number) {
        return this.permissionsRepository.delete(id);
    }
}
