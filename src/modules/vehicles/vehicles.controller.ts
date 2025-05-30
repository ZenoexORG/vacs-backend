import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { VehiclesService } from './vehicles.service';
import { Auth } from 'src/shared/decorators/permissions.decorator';
import { AppPermissions } from 'src/shared/enums/permissions.enum';
import { ConvertDates } from 'src/shared/decorators/date-conversion.decorator';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) { }

  @ApiOperation({ summary: 'Create a vehicle' })
  @ApiBody({ type: CreateVehicleDto })
  @Auth(AppPermissions.VEHICLES_CREATE)
  @Post()
  @ConvertDates(['created_at'])
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })
  @Auth(AppPermissions.VEHICLES_VIEW)
  @Get()
  @ConvertDates(['created_at'])
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.vehiclesService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get a vehicle by id' })
  @ApiParam({ name: 'id', description: 'Vehicle unique id', example: 1 })
  @Auth(AppPermissions.VEHICLES_VIEW)
  @Get(':id')
  @ConvertDates(['created_at'])
  async findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle unique id', example: 1 })
  @Auth(AppPermissions.VEHICLES_EDIT)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle unique id', example: 1 })
  @Auth(AppPermissions.VEHICLES_DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
