import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { UpdateRolePermissionsDto } from './dto/update-permissions.dto';
import { RolesService } from './roles.service';
import { Auth } from 'src/shared/decorators/permissions.decorator';
import { AppPermissions } from 'src/shared/enums/permissions.enum';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @ApiOperation({ summary: 'Create a role' })
  @ApiBody({ type: CreateRoleDto })
  @Auth(AppPermissions.ROLES_CREATE)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })
  @Auth(AppPermissions.ROLES_VIEW)
  @Get()
  async findAll(@Query() paginationDto) {
    return this.rolesService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get a role by id' })
  @ApiParam({ name: 'id', description: 'Role unique id', example: 1, type: Number })
  @Auth(AppPermissions.ROLES_VIEW)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({
    name: 'id',
    description: 'Role unique id',
    example: 1,
    type: Number,
  })
  @ApiBody({ type: UpdateRoleDto })
  @Auth(AppPermissions.ROLES_EDIT)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({
    name: 'id',
    description: 'Role unique id',
    example: 1,
    type: Number,
  })
  @Auth(AppPermissions.ROLES_DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @ApiOperation({ summary: 'Assign permissions to a role' })
  @ApiParam({
    name: 'id',
    description: 'Role unique id',
    example: 1,
    type: Number,
  })
  @ApiBody({ type: AssignPermissionsDto })
  @Auth(AppPermissions.PERMISSIONS_ASSIGN)
  @Post(':id/permissions')
  async assignPermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(+id, assignPermissionsDto);
  }

  @ApiOperation({ summary: 'Update permissions of a role' })
  @ApiParam({
    name: 'id',
    description: 'Role unique id',
    example: 1,
    type: Number,
  })
  @ApiBody({ type: UpdateRolePermissionsDto })    
  @Auth(AppPermissions.PERMISSIONS_UNASSIGN)
  @Patch(':id/permissions')
  async removePermissions(
    @Param('id') id: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    return this.rolesService.updatePermissions(+id, updateRolePermissionsDto);
  }
}
