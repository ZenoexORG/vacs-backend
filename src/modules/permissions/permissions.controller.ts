import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }

    @ApiOperation({ summary: 'Create a permission' })
    @ApiBody({ type: CreatePermissionDto })
    @Post()
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionsService.create(createPermissionDto);
    }

    @ApiOperation({ summary: 'Get all permissions' })
    @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })
    @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })
    @Get()
    findAll(@Query() paginationDto) {
        return this.permissionsService.findAll(paginationDto);
    }
    

    @ApiOperation({ summary: 'Get a permission by id' })
    @ApiParam({ name: 'id', description: 'Permission unique id', example: 1, type: Number })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permissionsService.findOne(+id);
    }

    @ApiOperation({ summary: 'Update a permission' })
    @ApiParam({ name: 'id', description: 'Permission unique id', example: 1, type: Number })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionsService.update(+id, updatePermissionDto);
    }

    @ApiOperation({ summary: 'Delete a permission' })
    @ApiParam({ name: 'id', description: 'Permission unique id', example: 1, type: Number })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.permissionsService.remove(+id);
    }
}
