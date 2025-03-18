import { Module } from '@nestjs/common';
import { EmployeesModule } from '../employees/employees.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; 
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        EmployeesModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'super_safe_secret',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}