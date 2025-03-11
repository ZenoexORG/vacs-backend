import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @ApiOperation({ summary: 'Create an employee' })
    @ApiBody({ type: CreateEmployeeDto })
    @Post()
    create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeesService.create(createEmployeeDto);
    }

    @ApiOperation({ summary: 'Get all employees' })
    @Get()
    findAll() {
        return this.employeesService.findAll();
    }

    @ApiOperation({ summary: 'Get an employee by id' })
    @ApiParam({ name: 'id', description: 'Employee unique id', example: 1 })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.employeesService.findOne(+id);
    }

    @ApiOperation({ summary: 'Update an employee' })
    @ApiParam({ name: 'id', description: 'Employee unique id', example: 1 })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeesService.update(+id, updateEmployeeDto);
    }

    @ApiOperation({ summary: 'Delete an employee' })
    @ApiParam({ name: 'id', description: 'Employee unique id', example: 1 })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.employeesService.remove(+id);
    }
}
