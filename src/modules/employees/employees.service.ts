import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { Employee } from './entities/employee.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { PaginationService } from 'src/shared/services/pagination.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private readonly paginationService: PaginationService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeesRepository.findOne({
      where: [
        { username: createEmployeeDto.username },
        { id: createEmployeeDto.id },
      ],
    });
    if (existingEmployee) {
      throw new BadRequestException(
        existingEmployee.username === createEmployeeDto.username
          ? 'Username already exists'
          : 'ID already exists',
      );
    }
    const newEmployee = this.employeesRepository.create(createEmployeeDto);
    this.notificationsService.notifyEmployeeCreated(newEmployee);
    return this.employeesRepository.save(newEmployee);
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
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: { role: { permissions: true } },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const existingEmployee = await this.employeesRepository.findOne({
      where: { id },
    });
    if (!existingEmployee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }

    if (updateEmployeeDto.username) {
      const duplicateUsername = await this.employeesRepository.findOne({
        where: { username: updateEmployeeDto.username, id: Not(id) },
      });
      if (duplicateUsername) {
        throw new BadRequestException('Username already exists');
      }
    }
    const updatedEmployee = this.employeesRepository.create({
      ...existingEmployee,
      ...updateEmployeeDto,
    });
    this.notificationsService.notifyEmployeeUpdated(updatedEmployee);
    return this.employeesRepository.save(updatedEmployee);
  }

  async remove(id: string) {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    this.notificationsService.notifyEmployeeDeleted(employee);
    return this.employeesRepository.delete(id);
  }

  async findByUsername(username: string) {
    const employee = await this.employeesRepository.findOne({
      where: { username },
      relations: { role: { permissions: true } },
    });
    if (!employee) {
      throw new NotFoundException(
        `Employee with username "${username}" not found`,
      );
    }
    return employee;
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
