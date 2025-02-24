import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) {}

    @ApiOperation({ summary: 'Crear un vehículo' })
    @ApiBody({ type: CreateVehicleDto })
    @Post()
    create(@Body() createVehicleDto: CreateVehicleDto) {
        return this.vehiclesService.create(createVehicleDto);
    }

    @ApiOperation({ summary: 'Listar vehículos' })
    @Get()
    findAll() {
        return this.vehiclesService.findAll();
    }

    @ApiOperation({ summary: 'Buscar un vehículo por id' })
    @ApiParam({ name: 'id', description: 'Id único del vehículo', example: 1})
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vehiclesService.findOne(id);
    }

    @ApiOperation({ summary: 'Actualizar un vehículo' })
    @ApiParam({ name: 'id', description: 'Id único del vehículo', example: 1})
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
        return this.vehiclesService.update(id, updateVehicleDto);
    }

    @ApiOperation({ summary: 'Eliminar un vehículo' })
    @ApiParam({ name: 'id', description: 'Id único del vehículo', example: 1})
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.vehiclesService.remove(id);
    }
}
