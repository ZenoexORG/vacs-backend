import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { AccessLogEventType, VehicleEventType, IncidentEventType, EmployeeEventType, UserEventType } from './interfaces/notification.interface';
import { NotificationEvents } from './constants/events.constants';

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

  notifyAccessLog(type: AccessLogEventType, data: any): void {
    this.sendToAll(`${NotificationEvents.ACCESS_LOGS}:${type}`, data);
  }

  notifyVehicleEvent(type: VehicleEventType, data: any): void {
    this.sendToAll(`${NotificationEvents.VEHICLES}:${type}`, data);
  }

  notifyIncidentEvent(type: IncidentEventType, data: any): void {
    this.sendToAll(`${NotificationEvents.INCIDENTS}:${type}`, data);
  }

  notifyEmployeeEvent(type: EmployeeEventType, data: any): void {
    this.sendToAll(`${NotificationEvents.EMPLOYEES}:${type}`, data);
  }

  notifyUserEvent(type: UserEventType, data: any): void {
    this.sendToAll(`user:${type}`, data);
  }

  notifyVehicleEntry(data: any): void {
    this.notifyAccessLog('entry', data);
  }

  notifyVehicleExit(data: any): void {
    this.notifyAccessLog('exit', data);
  }

  notifyIncidentReported(data: any): void {
    this.notifyIncidentEvent('reported', data);
  }

  notifyIncidentResolved(data: any): void {
    this.notifyIncidentEvent('resolved', data);
  }

  notifyEmployeeCreated(data: any): void {
    this.notifyEmployeeEvent('created', data);
  }
  notifyEmployeeUpdated(data: any): void {
    this.notifyEmployeeEvent('updated', data);
  }
  notifyEmployeeDeleted(data: any): void {
    this.notifyEmployeeEvent('deleted', data);
  }
  notifyUserCreated(data: any): void {
    this.notifyUserEvent('created', data);
  }
  notifyUserUpdated(data: any): void {
    this.notifyUserEvent('updated', data);
  }
  notifyUserDeleted(data: any): void {
    this.notifyUserEvent('deleted', data);
  }
  notifyVehicleCreated(data: any): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.notifyVehicleEvent('created', data);
        resolve();
      }
      catch (error) {
        this.logger.error('Error notifying vehicle created:', error);
        resolve();
      }
    });
  }

  notifyVehicleUpdated(data: any): void {
    this.notifyVehicleEvent('updated', data);
  }
  notifyVehicleDeleted(data: any): void {
    this.notifyVehicleEvent('deleted', data);
  }
}