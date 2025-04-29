import { Module, forwardRef } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'super_safe_secret',
        signOptions: { expiresIn: '12h' },
      }),
    }),
    forwardRef(() => EmployeesModule),
  ],
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}