import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,
    ) { }

    async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        const employee = this.employeesRepository.create(createEmployeeDto);
        return this.employeesRepository.save(employee);
    }

    async findAll(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        if (!page && !limit) {
            return this.employeesRepository.find({ relations: {role: {permissions: true}} });
        }
        return this.getPaginatedEmployees(page, limit);
    }

    private async getPaginatedEmployees(page, limit) {
        const skippedItems = (page - 1) * limit;
        const [employees, total] = await this.employeesRepository.findAndCount({ skip: skippedItems, take: limit, relations: {role: {permissions:true}} });
        return {
            data: employees,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
                per_page: limit,
            }
        }
    }

    async findOne(id: string) {
        return this.employeesRepository.findOne({ where: { id }, relations: {role:{permissions:true}} });
    }

    async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeesRepository.update(id, updateEmployeeDto);
    }

    async remove(id: string) {
        return this.employeesRepository.delete(id);
    }

    async findByUsername(username: string) {
        return this.employeesRepository.findOne({ where: { username } });
    }
}
