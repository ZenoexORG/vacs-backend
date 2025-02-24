import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { AccessLogsService } from './access-logs.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Access Logs')
@Controller('access-logs')
export class AccessLogsController {
    constructor(private readonly accessLogsService: AccessLogsService) {}

    @ApiOperation({ summary: 'Crear un acceso' })
    @ApiBody({ type: CreateAccessLogDto })
    @Post()
    create(@Body() createAccessLogDto: CreateAccessLogDto) {
        return this.accessLogsService.create(createAccessLogDto);
    }

    @ApiOperation({ summary: 'Listar accesos' })
    @Get()
    findAll() {
        return this.accessLogsService.findAll();
    }

    @ApiOperation({ summary: 'Buscar un acceso por id' })
    @ApiParam({ name: 'id', description: 'Id único del acceso', example: 1})
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.accessLogsService.findOne(+id);
    }

    @ApiOperation({ summary: 'Actualizar un acceso' })
    @ApiParam({ name: 'id', description: 'Id único del acceso', example: 1})    
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAccessLogDto: UpdateAccessLogDto) {
        return this.accessLogsService.update(+id, updateAccessLogDto);
    }

    @ApiOperation({ summary: 'Eliminar un acceso' })
    @ApiParam({ name: 'id', description: 'Id único del acceso', example: 1})
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.accessLogsService.remove(+id);
    }
}