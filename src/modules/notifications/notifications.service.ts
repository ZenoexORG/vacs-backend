import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger('NotificationsService');

  constructor(private notificationsGateway: NotificationsGateway) { }

  sendToEmployee<T>(employeeId: string | number, event: string, data: T): void {
    this.logger.debug(`Sending ${event} to employee ${employeeId}`);
    this.notificationsGateway.server.to(`employee_${employeeId}`).emit(event, {
      event,
      data,
      timestamp: new Date()
    });
  }

  sendToRole<T>(roleId: string | number, event: string, data: T): void {
    this.logger.debug(`Sending ${event} to role ${roleId}`);
    this.notificationsGateway.server.to(`role_${roleId}`).emit(event, {
      event,
      data,
      timestamp: new Date()
    });
  }

  sendToRoom<T>(room: string, event: string, data: T): void {
    this.logger.debug(`Sending ${event} to room ${room}`);
    this.notificationsGateway.server.to(room).emit(event, {
      event,
      data,
      timestamp: new Date()
    });
  }

  sendToAll<T>(event: string, data: T): void {
    this.logger.debug(`Broadcasting ${event} to all connected clients`);
    this.notificationsGateway.server.emit(event, {
      event,
      data,
      timestamp: new Date()
    });
  }

  notifyAccessLog(data: any): void {
    this.sendToAll('access_logs', data);
  }

  notifyIncident(data: any): void {
    this.sendToAll('incidents', data);
  }

  notifyEmployee(data: any): void {
    this.sendToAll('employees', data);
  }

  notifyVehicle(data: any): void {
    this.sendToAll('vehicles', data);
  }

  notifyUser(data: any): void {
    this.sendToAll('users', data);
  }

  notifyIncidentCount(total: number): void {
    this.sendToAll('incidents_count', { total });
  }
}