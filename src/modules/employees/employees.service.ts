import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,
    ){}

    async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        const employee = this.employeesRepository.create(createEmployeeDto);
        return this.employeesRepository.save(employee);
    }

    async findAll() {
        return this.employeesRepository.find({relations: ['role']});
    }

    async findOne(id: number) {
        return this.employeesRepository.findOne({where: {id}, relations: ['role']});
    }

    async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeesRepository.update(id, updateEmployeeDto);
    }

    async remove(id: number) {
        return this.employeesRepository.delete(id);
    }

    async findByUsername(username: string) {
        return this.employeesRepository.findOne({where: {username}});
    }
}