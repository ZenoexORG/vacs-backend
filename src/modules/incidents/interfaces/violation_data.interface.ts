import { AccessLog } from '../../access_logs/entities/access-log.entity';
export interface ViolationData {
    log: AccessLog;
    minutesElapsed: number;
    threshold: number;
    vehicleType: string;
}