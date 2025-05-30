import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { Employee } from './entities/employee.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { PaginationService } from 'src/shared/services/pagination.service';
import { NotificationsService } from '../notifications/notifications.service';
import { handleNotFoundError, handleDatabaseError, handleValidationError } from 'src/shared/utils/errors.utils';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private readonly paginationService: PaginationService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const existingEmployee = await this.employeesRepository.findOne({
        where: [
          { username: createEmployeeDto.username },
          { id: createEmployeeDto.id },
        ],
      });
      if (existingEmployee) {
        if (existingEmployee.username === createEmployeeDto.username) {
          handleValidationError('username', { dto: createEmployeeDto }, this.logger);
        }
        if (existingEmployee.id === createEmployeeDto.id) {
          handleValidationError('id', { dto: createEmployeeDto }, this.logger);
        }
      }
      const newEmployee = this.employeesRepository.create(createEmployeeDto);
      this.notificationsService.notifyEmployee(newEmployee);
      return this.employeesRepository.save(newEmployee);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error creating employee',
        { dto: createEmployeeDto },
        this.logger,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const result = await this.paginationService.paginate(
      this.employeesRepository,
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        relations: { role: { permissions: true } },
      },
    );
    return {
      data: this.formatEmployeesWithPermissions(result.data),
      meta: result.meta
    }
  }

  async findOne(id: string) {
    try {
      const employee = await this.employeesRepository.findOne({
        where: { id },
        relations: { role: { permissions: true } },
      });
      if (!employee) handleNotFoundError('Employee', id, this.logger);
      return employee;
    } catch (error) {
      handleDatabaseError(
        error,
        'Error finding employee',
        { id },
        this.logger,
      );
    }
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const existingEmployee = await this.employeesRepository.findOne({
        where: { id },
      });
      if (!existingEmployee) handleNotFoundError('Employee', id, this.logger);

      if (updateEmployeeDto.username) {
        const duplicateUsername = await this.employeesRepository.findOne({
          where: { username: updateEmployeeDto.username, id: Not(id) },
        });
        if (duplicateUsername) handleValidationError('username', { dto: updateEmployeeDto }, this.logger);
      }
      const updatedEmployee = this.employeesRepository.create({
        ...existingEmployee,
        ...updateEmployeeDto,
      });
      this.notificationsService.notifyEmployee(updatedEmployee);
      return this.employeesRepository.save(updatedEmployee);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error updating employee',
        { id, dto: updateEmployeeDto },
        this.logger,
      );
    }
  }

  async remove(id: string) {
    try {
      const employee = await this.employeesRepository.findOne({ where: { id } });
      if (!employee) handleNotFoundError('Employee', id, this.logger);
      this.notificationsService.notifyEmployee(employee);
      return this.employeesRepository.delete(id);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error deleting employee',
        { id },
        this.logger,
      );
    }
  }

  async findByUsername(username: string) {
    try {
      const employee = await this.employeesRepository.findOne({
        where: { username },
        relations: { role: { permissions: true } },
      });
      if (!employee) handleNotFoundError('Employee', username, this.logger);
      return employee;
    } catch (error) {
      handleDatabaseError(
        error,
        'Error finding employee by username',
        { username },
        this.logger,
      );
    }
  }

  private formatEmployeesWithPermissions(employees: Employee[]) {
    return employees.map(employee => ({
      ...employee,
      role: {
        ...employee.role,
        permissions: this.formatPermissions(employee.role.permissions ?? []),
      }
    }));
  }

  private formatPermissions(permissions: Permission[]): string[] {
    return permissions.map(permission => {
      const [category, action] = permission.name.split(':');
      return `${category}:${action}`;
    });
  }
}
