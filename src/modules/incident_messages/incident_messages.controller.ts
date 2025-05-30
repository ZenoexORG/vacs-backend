import { Controller, Get, Post, Body, Param, Delete, Patch, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { IncidentMessagesService } from './incident_messages.service';
import { CreateIncidentMessageDto } from './dto/create_incident_message.dto';
import { UpdateIncidentMessageDto } from './dto/update_incident_message.dto';
import { Auth } from 'src/shared/decorators/permissions.decorator';
import { AppPermissions } from 'src/shared/enums/permissions.enum';
import { ConvertDates } from 'src/shared/decorators/date-conversion.decorator';

@ApiTags('Incident Messages')
@Controller('incident-messages')
export class IncidentMessagesController {
    constructor(private readonly incidentMessagesService: IncidentMessagesService) { }

    @ApiOperation({ summary: 'Create an incident message' })
    @ApiBody({ type: CreateIncidentMessageDto })
    @Auth(AppPermissions.INCIDENTS_EDIT)
    @Post()
    @ConvertDates(['created_at'])
    async create(
        @Body() createIncidentMessageDto: CreateIncidentMessageDto,
        @Req() req: any
    ) {
        return this.incidentMessagesService.create(createIncidentMessageDto, req.user.id);
    }

    @ApiOperation({ summary: 'Get all incident messages' })
    @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })
    @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })
    @Auth(AppPermissions.INCIDENTS_VIEW)
    @Get()
    @ConvertDates(['created_at'])
    async findAll(
        @Query() paginationDto,
    ) {
        return this.incidentMessagesService.findAll(paginationDto);
    }

    @ApiOperation({ summary: 'Get an incident message by id' })
    @ApiParam({ name: 'id', description: 'Incident message unique id', example: 1 })
    @Auth(AppPermissions.INCIDENTS_VIEW)
    @Get(':id')
    @ConvertDates(['created_at'])
    async findOne(@Param('id') id: string) {
        return this.incidentMessagesService.findOne(+id);
    }

    @ApiOperation({ summary: 'Update an incident message' })
    @ApiParam({ name: 'id', description: 'Incident message unique id', example: 1 })
    @Auth(AppPermissions.INCIDENTS_EDIT)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateIncidentMessageDto: UpdateIncidentMessageDto
    ) {
        return this.incidentMessagesService.update(+id, updateIncidentMessageDto);
    }

    @ApiOperation({ summary: 'Delete an incident message' })
    @ApiParam({ name: 'id', description: 'Incident message unique id', example: 1 })
    @Auth(AppPermissions.INCIDENTS_DELETE)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.incidentMessagesService.remove(+id);
    }
}