import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @ApiOperation({ summary: 'Crear un empleado' })
    @ApiBody({ type: CreateEmployeeDto })
    @Post()
    create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeesService.create(createEmployeeDto);
    }

    @ApiOperation({ summary: 'Listar empleados' })
    @Get()
    findAll() {
        return this.employeesService.findAll();
    }

    @ApiOperation({ summary: 'Buscar un empleado por id' })
    @ApiParam({ name: 'id', description: 'Id único del empleado', example: 1})
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.employeesService.findOne(+id);
    }

    @ApiOperation({ summary: 'Actualizar un empleado' })
    @ApiParam({ name: 'id', description: 'Id único del empleado', example: 1})    
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeesService.update(+id, updateEmployeeDto);
    }

    @ApiOperation({ summary: 'Eliminar un empleado' })
    @ApiParam({ name: 'id', description: 'Id único del empleado', example: 1})
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.employeesService.remove(+id);
    }
}