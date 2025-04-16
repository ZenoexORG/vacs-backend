import { PaginationService } from 'src/shared/services/pagination.service';
import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Role])],
  controllers: [EmployeesController],
  providers: [EmployeesService, PaginationService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
