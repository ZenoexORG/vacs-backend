import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentsService } from './incidents.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Incidents')
@Controller('incidents')
export class IncidentsController {
    constructor(private readonly incidentsService: IncidentsService) {}

    @ApiOperation({ summary: 'Crear un incidente' })
    @ApiBody({ type: CreateIncidentDto })
    @Post()
    create(@Body() createIncidentDto: CreateIncidentDto) {
        return this.incidentsService.create(createIncidentDto);
    }

    @ApiOperation({ summary: 'Listar incidentes' })
    @Get()
    findAll() {
        return this.incidentsService.findAll();
    }

    @ApiOperation({ summary: 'Buscar un incidente por id' })
    @ApiParam({ name: 'id', description: 'Id único del incidente', example: 1})
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.incidentsService.findOne(id);
    }

    @ApiOperation({ summary: 'Actualizar un incidente' })
    @ApiParam({ name: 'id', description: 'Id único del incidente', example: 1})
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateIncidentDto: UpdateIncidentDto) {
        return this.incidentsService.update(id, updateIncidentDto);
    }

    @ApiOperation({ summary: 'Eliminar un incidente' })
    @ApiParam({ name: 'id', description: 'Id único del incidente', example: 1})
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.incidentsService.remove(id);
    }
}