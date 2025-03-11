import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
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

    async findAll() {
        return this.permissionsRepository.find();
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
