import { Injectable, Logger } from '@nestjs/common';
import { PaginationService } from 'src/shared/services/pagination.service';
import { RolePermissionsService } from 'src/shared/services/role-permissions.service';
import { Permission } from '../permissions/entities/permission.entity';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { UpdateRolePermissionsDto } from './dto/update-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/shared/dtos';
import { Role } from './entities/role.entity';
import { Repository, In } from 'typeorm';
import {
  handleValidationError, handleConflictError,
  handleNotFoundError, handleDatabaseError,
} from 'src/shared/utils/errors.utils';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    private readonly paginationService: PaginationService,
    private readonly rolePermissionsService: RolePermissionsService,
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      if (!createRoleDto.type) handleValidationError('type', { dto: createRoleDto }, this.logger);
      const existingRole = await this.rolesRepository.findOne({
        where: { name: createRoleDto.name },
      });
      if (existingRole) handleConflictError('Role already exists', { name: createRoleDto.name }, this.logger);
      return this.rolesRepository.save(createRoleDto);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error creating role',
        { dto: createRoleDto },
        this.logger,
      );

    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const result = await this.paginationService.paginate(
      this.rolesRepository,
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        relations: { permissions: true },
        order: { id: 'ASC' },
      },
    );
    const formattedRoles = result.data.map((role) => ({
      ...role,
      permissions: this.formatPermissions(role.permissions ?? []),
    }));
    return {
      data: formattedRoles,
      meta: result.meta,
    };
  }

  async findOne(id: number) {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id },
        relations: ['employees', 'permissions'],
      });
      if (!role) handleNotFoundError('Role', id, this.logger);
      const formattedRole = {
        ...role,
        permissions: this.formatPermissions(role.permissions ?? []),
      }
      return formattedRole;
    } catch (error) {
      handleDatabaseError(
        error,
        'finding role',
        { id },
        this.logger,
      );
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.rolesRepository.findOne({ where: { id } });
      if (!role) handleNotFoundError('Role', id, this.logger);
      return this.rolesRepository.update(id, updateRoleDto);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error updating role',
        { id, dto: updateRoleDto },
        this.logger,
      );
    }
  }

  async remove(id: number) {
    try {
      const role = await this.rolesRepository.findOne({ where: { id } });
      if (!role) handleNotFoundError('Role', id, this.logger);
      return this.rolesRepository.delete(id);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error deleting role',
        { id },
        this.logger,
      );
    }
  }

  async assignPermissions(id: number, assignPermissionsDto: AssignPermissionsDto) {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id },
        relations: { permissions: true },
      });
      if (!role) handleNotFoundError('Role', id, this.logger);
      const permissions = await this.permissionsRepository.find({
        where: { id: In(assignPermissionsDto.permissionIds) },
      });
      role.permissions = [...(role.permissions || []), ...permissions];
      const existingPermissions = await this.permissionsRepository.find({
        where: { id: In(role.permissions.map(permission => permission.id)) },
      });
      if (existingPermissions.length !== role.permissions.length) {
        handleConflictError('Some permissions do not exist', { id, dto: assignPermissionsDto }, this.logger);
      }
      const newRole = await this.rolesRepository.save(role);
      return {
        ...newRole,
        permissions: this.formatPermissions(newRole.permissions ?? []),
      };
    } catch (error) {
      handleDatabaseError(
        error,
        'Error assigning permissions to role',
        { id, dto: assignPermissionsDto },
        this.logger,
      );
    }
  }

  async updatePermissions(roleId: number, updateRolePermissionsDto: UpdateRolePermissionsDto) {
    try {
      const { permissionIds } = updateRolePermissionsDto;

      const role = await this.rolesRepository.findOne({
        where: { id: roleId },
        relations: { permissions: true },
      });

      if (!role) handleNotFoundError('Role', roleId, this.logger);

      const permissions = await this.permissionsRepository.find({
        where: { id: In(permissionIds) },
      });

      role.permissions = permissions;
      const existingPermissions = await this.permissionsRepository.find({
        where: { id: In(role.permissions.map(permission => permission.id)) },
      });
      if (existingPermissions.length !== role.permissions.length) {
        handleConflictError('Some permissions do not exist', { roleId, dto: updateRolePermissionsDto }, this.logger);
      }
      const newRole = await this.rolesRepository.save(role);
      await this.rolePermissionsService.refreshRolePermissions();
      return {
        ...newRole,
        permissions: this.formatPermissions(newRole.permissions ?? []),
      };
    } catch (error) {
      handleDatabaseError(
        error,
        'Error updating role permissions',
        { roleId, dto: updateRolePermissionsDto },
        this.logger,
      );
    }
  }

  private formatPermissions(permissions: Permission[]): string[] {
    return permissions.map(permission => {
      const [category, action] = permission.name.split(':');
      return `${category}:${action}`;
    });
  }
}
