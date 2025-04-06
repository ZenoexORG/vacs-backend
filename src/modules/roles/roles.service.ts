import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Permission } from '../permissions/entities/permission.entity';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { DeletePermissionsDto } from './dto/delete-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/shared/dtos';
import { Role } from './entities/role.entity';
import { Repository, In } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,

    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.rolesRepository.findOne({
      where: { name: createRoleDto.name },
    });
    if (existingRole) {
      throw new BadRequestException('Role already exists');
    }
    return this.rolesRepository.save(createRoleDto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    if (!page && !limit) {
      const roles = await this.rolesRepository.find({
        relations: ['permissions'],
      });
      const formattedRoles = roles.map((role) => ({
        ...role,
        permissions: this.formatPermissions(role.permissions ?? []),
      }));
      return {
        data: formattedRoles,
        meta: {
          page: 1,
          total_pages: 1,
        },
      };
    }
    return this.getPaginatedRoles(page, limit);
  }

  async findOne(id: number) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['users', 'employees', 'permissions'],
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return this.rolesRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return this.rolesRepository.delete(id);
  }

  async assignPermissions(
    id: number,
    assignPermissionsDto: AssignPermissionsDto,
  ) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Role not found');
    const permissions = await this.permissionsRepository.find({
      where: { id: In(assignPermissionsDto.permissionIds) },
    });
    role.permissions = [...(role.permissions || []), ...permissions];
    return this.rolesRepository.save(role);
  }

  async removePermissions(
    id: number,
    deletePermissionsDto: DeletePermissionsDto,
  ) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Role not found');
    role.permissions = (role.permissions ?? []).filter(
      (permission) =>
        !deletePermissionsDto.permissionIds.includes(permission.id),
    );
    return this.rolesRepository.save(role);
  }

  private async getPaginatedRoles(page, limit) {
    const skippedItems = (page - 1) * limit;
    const [roles, total] = await this.rolesRepository.findAndCount({
      skip: skippedItems,
      take: limit,
      relations: ['permissions'],
    });
    const formattedRoles = roles.map((role) => ({
      ...role,
      permissions: this.formatPermissions(role.permissions ?? []),
    }));
    return {
      data: formattedRoles,
      meta: {
        page: +page,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  private formatPermissions(permissions: Permission[]) {
    const groupedPermissions = permissions.reduce((acc, permission) => {
      const [action, category] = permission.name.split(':');
      const formattedPermission = category
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (!acc[formattedPermission]) {
        acc[formattedPermission] = new Set();
      }

      acc[formattedPermission].add(
        action.charAt(0).toUpperCase() + action.slice(1),
      );
      return acc;
    }, {});

    return Object.entries(groupedPermissions).map(([category, actions]) => ({
      category,
      actions: Array.from(actions as Set<string>),
    }));
  }
}
