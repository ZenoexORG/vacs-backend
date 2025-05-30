import { PaginationService } from 'src/shared/services/pagination.service';
import { forwardRef, Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Role } from '../roles/entities/role.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Role]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, PaginationService],
  exports: [EmployeesService],
})
export class EmployeesModule {}