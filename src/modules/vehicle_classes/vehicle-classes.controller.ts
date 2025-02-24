import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { VehicleClassesService } from './vehicle-classes.service';
import { CreateVehicleClassDto } from './dto/create-vehicle-class.dto';
import { UpdateVehicleClassDto } from './dto/update-vehicle-class.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Vehicle Classes')
@Controller('vehicle-classes')
export class VehicleClassesController {
    constructor(private readonly vehicleClassesService: VehicleClassesService) {}

    @ApiOperation({ summary: 'Crear una clase de vehículo' })
    @ApiBody({ type: CreateVehicleClassDto })
    @Post()
    create(@Body() createVehicleClassDto: CreateVehicleClassDto) {
        return this.vehicleClassesService.create(createVehicleClassDto);
    }

    @ApiOperation({ summary: 'Listar clases de vehículos' })
    @Get()
    findAll() {
        return this.vehicleClassesService.findAll();
    }

    @ApiOperation({ summary: 'Buscar una clase de vehículo por id' })
    @ApiParam({ name: 'id', description: 'Id único de la clase de vehículo', example: 1})
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vehicleClassesService.findOne(+id);
    }

    @ApiOperation({ summary: 'Actualizar una clase de vehículo' })
    @ApiParam({ name: 'id', description: 'Id único de la clase de vehículo', example: 1})    
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVehicleClassDto: UpdateVehicleClassDto) {
        return this.vehicleClassesService.update(+id, updateVehicleClassDto);
    }

    @ApiOperation({ summary: 'Eliminar una clase de vehículo' })
    @ApiParam({ name: 'id', description: 'Id único de la clase de vehículo', example: 1})
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.vehicleClassesService.remove(+id);
    }
}