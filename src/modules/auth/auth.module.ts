import { RolePermissionsService } from 'src/shared/services/role-permissions.service';
import { EmployeesModule } from '../employees/employees.module';
import { Role } from '../roles/entities/role.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    EmployeesModule,
    PassportModule,
    TypeOrmModule.forFeature([Role]),
    CacheModule.register({
      ttl: 60 * 5,
      max: 100,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super_safe_secret',
      signOptions: { expiresIn: '4h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolePermissionsService],
  exports: [AuthService],
})
export class AuthModule { }
