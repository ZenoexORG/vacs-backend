import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ConvertDates } from 'src/shared/decorators/date-conversion.decorator';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentsService } from './incidents.service';
import { Auth } from 'src/shared/decorators/permissions.decorator';
import { AppPermissions } from 'src/shared/enums/permissions.enum';
import { IncidentsPaginationDto } from './dto/incidents_pagination.dto';

@ApiTags('Incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) { }

  @ApiOperation({ summary: 'Create an incident' })
  @ApiBody({ type: CreateIncidentDto })
  @Auth(AppPermissions.INCIDENTS_CREATE)
  @Post()
  @ConvertDates(['incident_date', 'solution_date'])
  async create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @ApiOperation({ summary: 'Get all incidents' })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })
  @ApiQuery({ name: 'status', description: 'Incident status', required: false })
  @ApiQuery({ name: 'priority', description: 'Incident priority', required: false })
  @Auth(AppPermissions.INCIDENTS_VIEW)
  @Get()
  @ConvertDates(['incident_date', 'solution_date'])
  async findAll(@Query() paginationDto: IncidentsPaginationDto) {
    return this.incidentsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get an incident by id' })
  @ApiParam({ name: 'id', description: 'Incident unique id', example: 1 })
  @Auth(AppPermissions.INCIDENTS_VIEW)
  @Get(':id')
  @ConvertDates(['incident_date', 'solution_date'])
  async findOne(@Param('id') id: number) {
    return this.incidentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an incident' })
  @ApiParam({ name: 'id', description: 'Incident unique id', example: 1 })
  @ApiBody({ type: UpdateIncidentDto })
  @Auth(AppPermissions.INCIDENTS_EDIT)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateIncidentDto: UpdateIncidentDto,
  ) {
    return this.incidentsService.update(id, updateIncidentDto);
  }

  @ApiOperation({ summary: 'Delete an incident' })
  @ApiParam({ name: 'id', description: 'Incident unique id', example: 1 })
  @Auth(AppPermissions.INCIDENTS_DELETE)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.incidentsService.remove(id);
  }
}
