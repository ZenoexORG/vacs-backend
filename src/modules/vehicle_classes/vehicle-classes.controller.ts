import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { VehicleClassesService } from './vehicle-classes.service';
import { CreateVehicleClassDto } from './dto/create-vehicle-class.dto';
import { UpdateVehicleClassDto } from './dto/update-vehicle-class.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Vehicle Classes')
@Controller('vehicle-classes')
export class VehicleClassesController {
    constructor(private readonly vehicleClassesService: VehicleClassesService) { }

    @ApiOperation({ summary: 'Create a vehicle class' })
    @ApiBody({ type: CreateVehicleClassDto })
    @Post()
    create(@Body() createVehicleClassDto: CreateVehicleClassDto) {
        return this.vehicleClassesService.create(createVehicleClassDto);
    }

    @ApiOperation({ summary: 'Get all vehicle classes' })
    @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1 })
    @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })    
    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.vehicleClassesService.findAll(paginationDto);
    }

    @ApiOperation({ summary: 'Get a vehicle class by id' })
    @ApiParam({ name: 'id', description: 'Vehicle class unique id', example: 1 })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vehicleClassesService.findOne(+id);
    }

    @ApiOperation({ summary: 'Update a vehicle class' })
    @ApiParam({ name: 'id', description: 'Vehicle class unique id', example: 1 })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVehicleClassDto: UpdateVehicleClassDto) {
        return this.vehicleClassesService.update(+id, updateVehicleClassDto);
    }

    @ApiOperation({ summary: 'Delete a vehicle class' })
    @ApiParam({ name: 'id', description: 'Vehicle class unique id', example: 1 })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.vehicleClassesService.remove(+id);
    }
}
