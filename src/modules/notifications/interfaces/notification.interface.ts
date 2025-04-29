export interface Notification<T = any> {
    event: string;
    data: T;
    timestamp?: Date;
}

export type AccessLogEventType = 'entry' | 'exit';
export type VehicleEventType = 'created' | 'updated' | 'deleted';
export type IncidentEventType = 'reported' | 'resolved' | 'updated';
export type EmployeeEventType = 'created' | 'updated' | 'deleted';
export type UserEventType = 'created' | 'updated' | 'deleted';