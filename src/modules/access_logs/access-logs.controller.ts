import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ConvertDates } from 'src/shared/decorators/date-conversion.decorator';
import { AccessLogsService } from './access-logs.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { AppPermissions } from 'src/shared/enums/permissions.enum';
import { Auth } from 'src/shared/decorators/permissions.decorator';
import { DeviceAuth } from 'src/shared/decorators/device-auth.decorator';

@ApiTags('Access Logs')
@Controller('access-logs')
export class AccessLogsController {
  constructor(private readonly accessLogsService: AccessLogsService) { }

  @ApiOperation({ summary: 'Create an access' })
  @ApiBody({ type: CreateAccessLogDto })
  @DeviceAuth()
  @Post()
  @ConvertDates(['entry_date', 'exit_date'])
  async create(@Body() createAccessLogDto: CreateAccessLogDto) {
    return this.accessLogsService.create(createAccessLogDto);
  }

  @ApiOperation({ summary: 'Get all accesses' })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })
  @Auth(AppPermissions.ACCESS_LOGS_VIEW)
  @Get()
  @ConvertDates(['entry_date', 'exit_date'])
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.accessLogsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get an access by id' })
  @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
  @Get(':id')
  @Auth(AppPermissions.ACCESS_LOGS_VIEW)
  @ConvertDates(['entry_date', 'exit_date'])
  async findOne(@Param('id') id: string) {
    return this.accessLogsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update an access' })
  @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
  @Patch(':id')
  @Auth(AppPermissions.ACCESS_LOGS_EDIT)
  async update(
    @Param('id') id: string,
    @Body() updateAccessLogDto: UpdateAccessLogDto,
  ) {
    return this.accessLogsService.update(+id, updateAccessLogDto);
  }

  @ApiOperation({ summary: 'Delete an access' })
  @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
  @Delete(':id')
  @Auth(AppPermissions.ACCESS_LOGS_DELETE)
  async remove(@Param('id') id: string) {
    return this.accessLogsService.remove(+id);
  }
}
