import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { VehicleClassesService } from './vehicle-classes.service';
import { CreateVehicleClassDto } from './dto/create-vehicle-class.dto';
import { UpdateVehicleClassDto } from './dto/update-vehicle-class.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

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
    @Get()
    findAll() {
        return this.vehicleClassesService.findAll();
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
