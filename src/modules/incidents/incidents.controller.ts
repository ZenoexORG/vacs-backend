import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentsService } from './incidents.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Incidents')
@Controller('incidents')
export class IncidentsController {
    constructor(private readonly incidentsService: IncidentsService) { }

    @ApiOperation({ summary: 'Create an incident' })
    @ApiBody({ type: CreateIncidentDto })
    @Post()
    create(@Body() createIncidentDto: CreateIncidentDto) {
        return this.incidentsService.create(createIncidentDto);
    }

    @ApiOperation({ summary: 'Get all incidents' })
    @Get()
    findAll() {
        return this.incidentsService.findAll();
    }

    @ApiOperation({ summary: 'Get an incident by id' })
    @ApiParam({ name: 'id', description: 'Incident unique id', example: 1 })
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.incidentsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update an incident' })
    @ApiParam({ name: 'id', description: 'Incident unique id', example: 1 })
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateIncidentDto: UpdateIncidentDto) {
        return this.incidentsService.update(id, updateIncidentDto);
    }

    @ApiOperation({ summary: 'Delete an incident' })
    @ApiParam({ name: 'id', description: 'Incident unique id', example: 1 })
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.incidentsService.remove(id);
    }
}
