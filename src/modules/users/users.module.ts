import { PaginationService } from 'src/shared/services/pagination.service';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Vehicle, Role]),
    NotificationsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, PaginationService],
  exports: [UsersService],
})
export class UsersModule {}
