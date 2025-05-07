import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Auth } from 'src/shared/decorators/permissions.decorator';
import { AppPermissions } from 'src/shared/enums/permissions.enum';
import { ConvertDates } from 'src/shared/decorators/date-conversion.decorator';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @ApiOperation({ summary: 'Create an employee' })
  @ApiBody({ type: CreateEmployeeDto })
  @Auth(AppPermissions.EMPLOYEES_CREATE)
  @Post()
  @ConvertDates(['created_at'])
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @ApiOperation({ summary: 'Get all employees' })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10, })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1, })
  @Get()
  @ConvertDates(['created_at'])
  @Auth(AppPermissions.EMPLOYEES_VIEW)
  async findAll(@Query() paginationDto) {
    return this.employeesService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get an employee by id' })
  @ApiParam({ name: 'id', description: 'Employee unique id', example: 1 })
  @Auth(AppPermissions.EMPLOYEES_VIEW)
  @Get(':id')
  @ConvertDates(['created_at'])
  async findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an employee' })
  @ApiParam({ name: 'id', description: 'Employee unique id', example: 1 })
  @Auth(AppPermissions.EMPLOYEES_EDIT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @ApiOperation({ summary: 'Delete an employee' })
  @ApiParam({ name: 'id', description: 'Employee unique id', example: 1 })
  @Auth(AppPermissions.EMPLOYEES_DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
