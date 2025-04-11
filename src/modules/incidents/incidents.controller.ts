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
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentsService } from './incidents.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { AppPermissions } from 'src/shared/enums/permissions.enum';

@ApiTags('Incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @ApiOperation({ summary: 'Create an incident' })
  @ApiBody({ type: CreateIncidentDto })
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions(AppPermissions.INCIDENTS_CREATE)
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @ApiOperation({ summary: 'Get all incidents' })
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
  @Permissions(AppPermissions.INCIDENTS_READ)
  findAll(@Query() paginationDto) {
    return this.incidentsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get an incident by id' })
  @ApiParam({ name: 'id', description: 'Incident unique id', example: 1 })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions(AppPermissions.INCIDENTS_READ)
  findOne(@Param('id') id: number) {
    return this.incidentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an incident' })
  @ApiParam({ name: 'id', description: 'Incident unique id', example: 1 })
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions(AppPermissions.INCIDENTS_UPDATE)
  @ApiBody({ type: UpdateIncidentDto })
  update(
    @Param('id') id: number,
    @Body() updateIncidentDto: UpdateIncidentDto,
  ) {
    return this.incidentsService.update(id, updateIncidentDto);
  }

  @ApiOperation({ summary: 'Delete an incident' })
  @ApiParam({ name: 'id', description: 'Incident unique id', example: 1 })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions(AppPermissions.INCIDENTS_DELETE)
  remove(@Param('id') id: number) {
    return this.incidentsService.remove(id);
  }
}
