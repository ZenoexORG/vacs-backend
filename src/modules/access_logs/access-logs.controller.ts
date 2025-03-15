import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { AccessLogsService } from './access-logs.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Access Logs')
@Controller('access-logs')
export class AccessLogsController {
    constructor(private readonly accessLogsService: AccessLogsService) { }

    @ApiOperation({ summary: 'Create an access' })
    @ApiBody({ type: CreateAccessLogDto })
    @Post()
    create(@Body() createAccessLogDto: CreateAccessLogDto) {
        return this.accessLogsService.create(createAccessLogDto);
    }

    @ApiOperation({ summary: 'Get all accesses' })
    @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })
    @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })
    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.accessLogsService.findAll(paginationDto);
    }

    @ApiOperation({ summary: 'Get an access by id' })
    @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.accessLogsService.findOne(+id);
    }

    @ApiOperation({ summary: 'Update an access' })
    @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAccessLogDto: UpdateAccessLogDto) {
        return this.accessLogsService.update(+id, updateAccessLogDto);
    }

    @ApiOperation({ summary: 'Delete an access' })
    @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.accessLogsService.remove(+id);
    }
}
