import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AccessLogsService } from './access-logs.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { AuthGuard } from '@nestjs/passport';


@ApiTags('Access Logs')
@Controller('access-logs')
export class AccessLogsController {
    constructor(private readonly accessLogsService: AccessLogsService) { }

    @ApiOperation({ summary: 'Create an access' })
    @ApiBody({ type: CreateAccessLogDto })
    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @Permissions('create:access-logs')
    create(@Body() createAccessLogDto: CreateAccessLogDto) {
        return this.accessLogsService.create(createAccessLogDto);
    }

    @ApiOperation({ summary: 'Get all accesses' })
    @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })
    @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })
    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @Permissions('read:access-logs')
    findAll(@Query() paginationDto: PaginationDto) {
        return this.accessLogsService.findAll(paginationDto);
    }

    @ApiOperation({ summary: 'Get an access by id' })
    @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @Permissions('read:access-logs')
    findOne(@Param('id') id: string) {
        return this.accessLogsService.findOne(+id);
    }

    @ApiOperation({ summary: 'Update an access' })
    @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @Permissions('update:access-logs')
    update(@Param('id') id: string, @Body() updateAccessLogDto: UpdateAccessLogDto) {
        return this.accessLogsService.update(+id, updateAccessLogDto);
    }

    @ApiOperation({ summary: 'Delete an access' })
    @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @Permissions('delete:access-logs')
    remove(@Param('id') id: string) {
        return this.accessLogsService.remove(+id);
    }

    @ApiOperation({ summary: 'Register entry or exit of a vehicle' })
    @ApiParam({ name: 'vehicle_id', description: 'Vehicle unique id', example: '1' })
    @ApiParam({ name: 'timestamp', description: 'Timestamp of entry or exit', example: '2021-09-01T12:00:00Z' })
    @Post('register-entry-exit/:vehicle_id/:timestamp')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @Permissions('create:access-logs')
    registerEntryOrExit(@Param('vehicle_id') vehicle_id: string, @Param('timestamp') timestamp: string) {
        return this.accessLogsService.registerEntryOrExit(vehicle_id, timestamp);
    }
}
