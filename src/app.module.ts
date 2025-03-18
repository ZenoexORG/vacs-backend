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
import { VehicleClassesModule } from './modules/vehicle_classes/vehicle-classes.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { AccessLogsModule } from './modules/access_logs/access-logs.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    EmployeesModule,
    RolesModule,
    PermissionsModule,
    VehiclesModule,
    VehicleClassesModule,
    IncidentsModule,
    AccessLogsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
