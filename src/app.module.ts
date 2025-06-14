import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { ValidationFilter } from './filters/validation.filter';
import { ErrorFilter } from './filters/error.filter';
import { DateRequestInterceptor } from './shared/interceptors/date-request.interceptor';
import { DateConversionInterceptor } from './shared/interceptors/date-conversion.interceptor';
import { BullModule } from '@nestjs/bull';

import {
  UsersModule,
  EmployeesModule,
  RolesModule,
  PermissionsModule,
  VehiclesModule,
  VehicleTypesModule,
  IncidentsModule,
  IncidentMessagesModule,
  AccessLogsModule,
  AuthModule,
  DashboardModule,
  ReportModule,
  NotificationsModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 5,
      max: 200,
    }),
    DatabaseModule,
    SharedModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
    RolesModule,
    PermissionsModule,
    VehiclesModule,
    VehicleTypesModule,
    IncidentsModule,
    IncidentMessagesModule,
    AccessLogsModule,
    DashboardModule,
    ReportModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DateRequestInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DateConversionInterceptor
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    }
  ],
})
export class AppModule { }
