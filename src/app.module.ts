import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ConfigModule } from '@nestjs/config';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { VehicleTypesModule } from './modules/vehicle_types/vehicle-types.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { AccessLogsModule } from './modules/access_logs/access-logs.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportModule } from './modules/daily_reports/daily_reports.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    EmployeesModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    VehiclesModule,
    VehicleTypesModule,
    IncidentsModule,
    AccessLogsModule,
    DashboardModule,
    ReportModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
