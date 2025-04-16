import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,  
} from '@nestjs/swagger';
import { AccessLogsService } from './access-logs.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { RegisterEntryExitDto } from './dto/register-entry-exit.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { AppPermissions } from 'src/shared/enums/permissions.enum';
import { Auth } from 'src/shared/decorators/permissions.decorator';

@ApiTags('Access Logs')
@Controller('access-logs')
export class AccessLogsController {
  constructor(private readonly accessLogsService: AccessLogsService) {}

  @ApiOperation({ summary: 'Create an access' })
  @ApiBody({ type: CreateAccessLogDto })    
  @Auth(AppPermissions.ACCESS_LOG_CREATE)
  @Post()
  async create(@Body() createAccessLogDto: CreateAccessLogDto) {
    return this.accessLogsService.create(createAccessLogDto);
  }

  @ApiOperation({ summary: 'Get all accesses' })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })  
  @Auth(AppPermissions.ACCESS_LOG_READ)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.accessLogsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get an access by id' })
  @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
  @Get(':id')  
  @Auth(AppPermissions.ACCESS_LOG_READ)
  async findOne(@Param('id') id: string) {
    return this.accessLogsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update an access' })
  @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
  @Patch(':id')  
  @Auth(AppPermissions.ACCESS_LOG_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateAccessLogDto: UpdateAccessLogDto,
  ) {
    return this.accessLogsService.update(+id, updateAccessLogDto);
  }

  @ApiOperation({ summary: 'Delete an access' })
  @ApiParam({ name: 'id', description: 'Access unique id', example: 1 })
  @Delete(':id')  
  @Auth(AppPermissions.ACCESS_LOG_DELETE)
  async remove(@Param('id') id: string) {
    return this.accessLogsService.remove(+id);
  }

  @ApiOperation({ summary: 'Register entry or exit of a vehicle' })    
  @ApiBody({ type: RegisterEntryExitDto })
  @Auth(AppPermissions.ACCESS_LOG_CREATE)
  @Post('register-entry-exit')  
  async registerEntryOrExit(
    @Body() registerEntryExitDto: RegisterEntryExitDto,
  ) {
    return this.accessLogsService.registerEntryOrExit(
      registerEntryExitDto.vehicle_id,
      registerEntryExitDto.timestamp,
    );
  }
}
