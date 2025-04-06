import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { Employee } from './entities/employee.entity';
import { Permission } from '../permissions/entities/permission.entity';


@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    
  ) {}

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
    return this.employeesRepository.save(createEmployeeDto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    if (!page && !limit) {
      const employeess = await this.employeesRepository.find({
        relations: { role: { permissions: true } },
      });
      const formattedEmployeess = employeess.map((employee) => ({
        ...employee,
        role: {
          ...employee.role,
          permissions: this.formatPermissions(employee.role.permissions ?? []),
        },
      }));

      return {
        data: formattedEmployeess,
        meta: {
          page: 1,
          total_pages: 1,
        },
      };
    }
    return this.getPaginatedEmployees(page, limit);
  }

  private async getPaginatedEmployees(page, limit) {
    const skippedItems = (page - 1) * limit;
    const [employees, total] = await this.employeesRepository.findAndCount({
      skip: skippedItems,
      take: limit,
      relations: { role: { permissions: true } },
    });
    return {
      data: employees,
      meta: {
        page: +page,
        total_pages: Math.ceil(total / limit),
      },
    };
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
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return this.employeesRepository.update(id, updateEmployeeDto);
  }

  async remove(id: string) {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
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

  private formatPermissions(permissions: Permission[]) {
    const groupedPermissions = permissions.reduce((acc, permission) => {
      const [action, category] = permission.name.split(':');
      const formattedPermission = category
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (!acc[formattedPermission]) {
        acc[formattedPermission] = new Set();
      }

      acc[formattedPermission].add(
        action.charAt(0).toUpperCase() + action.slice(1),
      );
      return acc;
    }, {});

    return Object.entries(groupedPermissions).map(([category, actions]) => ({
      category,
      actions: Array.from(actions as Set<string>),
    }));
  }  
}
