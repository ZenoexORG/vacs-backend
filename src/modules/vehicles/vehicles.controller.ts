import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { VehiclesService } from './vehicles.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) { }

    @ApiOperation({ summary: 'Create a vehicle' })
    @ApiBody({ type: CreateVehicleDto })
    @Post()
    create(@Body() createVehicleDto: CreateVehicleDto) {
        return this.vehiclesService.create(createVehicleDto);
    }

    @ApiOperation({ summary: 'Get all vehicles' })
    @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })
    @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })    
    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.vehiclesService.findAll(paginationDto);
    }

    @ApiOperation({ summary: 'Get a vehicle by id' })
    @ApiParam({ name: 'id', description: 'Vehicle unique id', example: 1 })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vehiclesService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a vehicle' })
    @ApiParam({ name: 'id', description: 'Vehicle unique id', example: 1 })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
        return this.vehiclesService.update(id, updateVehicleDto);
    }

    @ApiOperation({ summary: 'Delete a vehicle' })
    @ApiParam({ name: 'id', description: 'Vehicle unique id', example: 1 })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.vehiclesService.remove(id);
    }
}
