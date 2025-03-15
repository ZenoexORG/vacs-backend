import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { DeletePermissionsDto } from './dto/delete-permissions.dto';
import { PaginationDto } from 'src/shared/dtos';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';


@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,

    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    if (!page && !limit) {
      return this.rolesRepository.find({ relations: ['users', 'employees', 'permissions'] });
    }
    return this.getPaginatedRoles(page, limit);
  }

  private async getPaginatedRoles(page, limit) {
    const skippedItems = (page - 1) * limit;
    const [roles, total] = await this.rolesRepository.findAndCount({ skip: skippedItems, take: limit, relations: ['users', 'employees', 'permissions'] });
    return {
      data: roles,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
        per_page: limit,
      }
    }
  }

  async findOne(id: number) {
    return this.rolesRepository.findOne({ where: { id }, relations: ['users', 'employees', 'permissions'] });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.rolesRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    return this.rolesRepository.delete(id);
  }

  async assignPermissions(id: number, assignPermissionsDto: AssignPermissionsDto) {
    const role = await this.rolesRepository.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role not found');

    const permissions = await this.permissionsRepository.findByIds(assignPermissionsDto.permissionIds);
    role.permissions = [...(role.permissions || []), ...permissions];

    return this.rolesRepository.save(role);
  }

  async removePermissions(id: number, deletePermissionsDto: DeletePermissionsDto) {
    const role = await this.rolesRepository.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role not found');

    role.permissions = (role.permissions ?? []).filter(
      permission => !deletePermissionsDto.permissionIds.includes(permission.id)
    );

    return this.rolesRepository.save(role);
  }
}
