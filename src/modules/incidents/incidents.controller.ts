import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentsService } from './incidents.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

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
    @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })
    @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })
    @Get()
    findAll(@Query() paginationDto) {
        return this.incidentsService.findAll(paginationDto);
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
