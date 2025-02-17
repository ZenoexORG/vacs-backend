import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @ApiOperation({ summary: 'Crear un permiso' })
    @ApiBody({ type: CreatePermissionDto })
    @Post()
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionsService.create(createPermissionDto);
    }

    @ApiOperation({ summary: 'Listar permisos' })
    @Get()
    findAll() {
        return this.permissionsService.findAll();
    }

    @ApiOperation({ summary: 'Buscar un permiso por id' })
    @ApiParam({ name: 'id', description: 'Id único del permiso', example: 1 , type: Number})
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permissionsService.findOne(+id);
    }

    @ApiOperation({ summary: 'Actualizar un permiso' })
    @ApiParam({ name: 'id', description: 'Id único del permiso', example: 1 , type: Number})
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionsService.update(+id, updatePermissionDto);
    }

    @ApiOperation({ summary: 'Eliminar un permiso' })
    @ApiParam({ name: 'id', description: 'Id único del permiso', example: 1 , type: Number})
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.permissionsService.remove(+id);
    }
}