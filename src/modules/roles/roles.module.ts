import { RolePermissionsService } from 'src/shared/services/role-permissions.service';
import { PaginationService } from 'src/shared/services/pagination.service';
import { Permission } from '../permissions/entities/permission.entity';
import { Employee } from '../employees/entities/employee.entity';
import { User } from '../users/entities/user.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Module } from '@nestjs/common';


@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User, Employee])],
  controllers: [RolesController],
  providers: [RolesService, PaginationService, RolePermissionsService],
  exports: [RolesService],
})
export class RolesModule { }
