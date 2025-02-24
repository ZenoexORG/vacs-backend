import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { DeletePermissionsDto } from './dto/delete-permissions.dto';
import { RolesService } from './roles.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @ApiOperation({ summary: 'Crear un rol' })
    @ApiBody({ type: CreateRoleDto })
    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @ApiOperation({ summary: 'Listar roles' })
    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @ApiOperation({ summary: 'Buscar un rol por id' })
    @ApiParam({ name: 'id', description: 'Id único del rol', example: 1 , type: Number})
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(+id);
    }

    @ApiOperation({ summary: 'Actualizar un rol' })
    @ApiParam({ name: 'id', description: 'Id único del rol', example: 1 , type: Number})
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(+id, updateRoleDto);
    }
    
    @ApiOperation({ summary: 'Eliminar un rol' })
    @ApiParam({ name: 'id', description: 'Id único del rol', example: 1 , type: Number})
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rolesService.remove(+id);
    }

    @ApiOperation({ summary: 'Asignar permisos a un rol' })
    @ApiParam({ name: 'id', description: 'Id único del rol', example: 1 , type: Number})
    @ApiBody({ type: AssignPermissionsDto })
    @Post(':id/permissions')
    assignPermissions(@Param('id') id: string, @Body() assignPermissionsDto: AssignPermissionsDto) {
        return this.rolesService.assignPermissions(+id, assignPermissionsDto);
    }

    @ApiOperation({ summary: 'Eliminar permisos de un rol' })
    @ApiParam({ name: 'id', description: 'Id único del rol', example: 1 , type: Number})
    @ApiBody({ type: AssignPermissionsDto })
    @Delete(':id/permissions')
    removePermissions(@Param('id') id: string, @Body() deletePermissionsDto: DeletePermissionsDto) {
        return this.rolesService.removePermissions(+id, deletePermissionsDto);
    }
}
