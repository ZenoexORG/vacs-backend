import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { DeletePermissionsDto } from './dto/delete-permissions.dto';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create a role' })
  @ApiBody({ type: CreateRoleDto })
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create:roles')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    default: 1,
  })
  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:roles')
  findAll(@Query() paginationDto) {
    return this.rolesService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get a role by id' })
  @ApiParam({
    name: 'id',
    description: 'Role unique id',
    example: 1,
    type: Number,
  })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:roles')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({
    name: 'id',
    description: 'Role unique id',
    example: 1,
    type: Number,
  })
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('update:roles')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({
    name: 'id',
    description: 'Role unique id',
    example: 1,
    type: Number,
  })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete:roles')
  remove(@Param('id') id: string) {
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
  @Post(':id/permissions')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('assign:permissions')
  assignPermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(+id, assignPermissionsDto);
  }

  @ApiOperation({ summary: 'Remove permissions from a role' })
  @ApiParam({
    name: 'id',
    description: 'Role unique id',
    example: 1,
    type: Number,
  })
  @ApiBody({ type: AssignPermissionsDto })
  @Delete(':id/permissions')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('unassign:permissions')
  removePermissions(
    @Param('id') id: string,
    @Body() deletePermissionsDto: DeletePermissionsDto,
  ) {
    return this.rolesService.removePermissions(+id, deletePermissionsDto);
  }
}
