import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,  
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,  
} from '@nestjs/swagger';
import { VehicleTypesService } from './vehicle-types.service';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { Auth } from 'src/shared/decorators/permissions.decorator';
import { AppPermissions } from 'src/shared/enums/permissions.enum';

@ApiTags('Vehicle Types')
@Controller('vehicle-types')
export class VehicleTypesController {
  constructor(private readonly VehicleTypesService: VehicleTypesService) {}

  @ApiOperation({ summary: 'Create a vehicle type' })
  @ApiBody({ type: CreateVehicleTypeDto })    
  @Auth(AppPermissions.VEHICLE_TYPES_CREATE)
  @Post()
  async create(@Body() CreateVehicleTypeDto: CreateVehicleTypeDto) {
    return this.VehicleTypesService.create(CreateVehicleTypeDto);
  }

  @ApiOperation({ summary: 'Get all vehicle types' })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    default: 10,
  })    
  @Auth(AppPermissions.VEHICLE_TYPES_READ)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.VehicleTypesService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get a vehicle type by id' })
  @ApiParam({ name: 'id', description: 'Vehicle type unique id', example: 1 })  
  @Auth(AppPermissions.VEHICLE_TYPES_READ)
  @Get(':id')  
  async findOne(@Param('id') id: string) {
    return this.VehicleTypesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a vehicle type' })
  @ApiParam({ name: 'id', description: 'Vehicle type unique id', example: 1 })    
  @Auth(AppPermissions.VEHICLE_TYPES_UPDATE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleTypeDto: UpdateVehicleTypeDto,
  ) {
    return this.VehicleTypesService.update(+id, updateVehicleTypeDto);
  }

  @ApiOperation({ summary: 'Delete a vehicle type' })
  @ApiParam({ name: 'id', description: 'Vehicle type unique id', example: 1 })    
  @Auth(AppPermissions.VEHICLE_TYPES_DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.VehicleTypesService.remove(+id);
  }
}
