import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLog } from '../access_logs/entities/access-log.entity';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { PriorityLevel } from 'src/shared/enums/priorityLevel.enum';
import { ConfigService } from '@nestjs/config';
import { VehicleType } from '../vehicle_types/entities/vehicle-type.entity';
import { TimezoneService } from 'src/shared/services/timezone.service';
import * as moment from 'moment';
import { ViolationData } from './interfaces/violation_data.interface';
import { IncidentStatus } from 'src/shared/enums/incidentStatus.enum';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IncidentMessage } from '../incident_messages/entities/incident_messages.entity';

@Injectable()
export class DwellTimeMonitorService implements OnModuleInit {
    private readonly logger = new Logger(DwellTimeMonitorService.name);
    private vehicleTypeAllowedTimes: Map<string, number> = new Map();
    private defaultThreshold = 15;
    private lastCacheUpdate: Date;
    private cacheTimeoutMinutes = 120;
    private shortestThreshold = 15;

    constructor(
        @InjectRepository(AccessLog)
        private readonly accessLogRepository: Repository<AccessLog>,
        @InjectRepository(VehicleType)
        private readonly vehicleTypeRepository: Repository<VehicleType>,
        private readonly incidentsService: IncidentsService,
        private readonly configService: ConfigService,
        private readonly timezoneService: TimezoneService,
        @InjectQueue('dwell-time') private readonly dwellTimeQueue: Queue,
        @InjectRepository(IncidentMessage)
        private readonly incidentMessageRepository: Repository<IncidentMessage>,
    ) {
        this.defaultThreshold = this.configService.get<number>('DWELL_TIME_DEFAULT_THRESHOLD', 240);
        this.cacheTimeoutMinutes = this.configService.get<number>('DWELL_TIME_CACHE_TIMEOUT_MINUTES', 120);
    }

    async onModuleInit() {
        await this.loadAllowedTimesFromDb();
        this.lastCacheUpdate = this.timezoneService.getCurrentDate();
        this.updateShortestThreshold();
    }

    async loadAllowedTimesFromDb(): Promise<void> {
        try {
            const now = this.timezoneService.getCurrentDate();
            if (this.lastCacheUpdate && moment(now).diff(moment(this.lastCacheUpdate), 'minutes') < this.cacheTimeoutMinutes &&
                this.vehicleTypeAllowedTimes.size > 0) {
                return;
            }

            const vehicleTypes = await this.vehicleTypeRepository.find();
            this.vehicleTypeAllowedTimes.clear();

            for (const vehicleType of vehicleTypes) {
                this.vehicleTypeAllowedTimes.set(
                    vehicleType.name,
                    vehicleType.allowed_time
                );
            }

            this.lastCacheUpdate = now;
            this.updateShortestThreshold();

        } catch (error) {
            this.logger.error(`Failed to load vehicle type allowed times: ${error.message}`);
        }
    }

    private updateShortestThreshold(): void {
        if (this.vehicleTypeAllowedTimes.size === 0) {
            this.shortestThreshold = this.defaultThreshold;
            return;
        }

        this.shortestThreshold = Math.min(
            ...Array.from(this.vehicleTypeAllowedTimes.values()),
            this.defaultThreshold
        );

        this.logger.log(`Shortest threshold updated to ${this.shortestThreshold} minutes`);
    }

    async scheduleDwellTimeCheck(accessLog: AccessLog) {
        await this.loadAllowedTimesFromDb();

        const vehicleType = accessLog.vehicle?.type?.name || 'unregistered';
        const threshold = this.vehicleTypeAllowedTimes.get(vehicleType) || this.defaultThreshold;
        const entryDate = moment(accessLog.entry_date);
        const now = this.timezoneService.getCurrentDate();
        const msToWait = threshold * 60 * 1000 - moment(now).diff(entryDate);
        const minutesElapsed = moment(now).diff(entryDate, 'minutes');

        if (msToWait > 0) {
            await this.dwellTimeQueue.add(
                'check',
                { accessLogId: accessLog.id },
                { delay: msToWait, removeOnComplete: true, removeOnFail: true }
            );
            this.logger.log(`Scheduled dwell time check for AccessLog ${accessLog.id} in ${Math.round(msToWait / 60000)} minutes`);
        } else {
            this.logger.log(`AccessLog ${accessLog.id} has exceeded its maximum allowed time by ${minutesElapsed} minutes`);
            await this.handleDwellTimeJob(accessLog.id);
        }
    }

    async handleDwellTimeJob(accessLogId: number) {
        await this.loadAllowedTimesFromDb();

        const log = await this.accessLogRepository.findOne({
            where: { id: accessLogId },
            relations: ['incidents', 'vehicle', 'vehicle.type'],
        });
        if (!log || log.exit_date) return;
        if (log.incidents && log.incidents.some(incident => incident.status === IncidentStatus.OPEN)) {
            return 0;
        }

        const vehicleType = log.vehicle?.type?.name || 'unregistered';
        const threshold = this.vehicleTypeAllowedTimes.get(vehicleType) || this.defaultThreshold;
        const minutesElapsed = moment(this.timezoneService.getCurrentDate()).diff(moment(log.entry_date), 'minutes');

        await this.createIncidentsForViolations([
            { log, minutesElapsed, threshold, vehicleType }
        ]);
    }

    private async createIncidentsForViolations(violations: ViolationData[]): Promise<number> {
        if (violations.length === 0) return 0;

        const incidentsDtos = violations.map((violation) => {
            const dto = new CreateIncidentDto();
            dto.access_log_id = violation.log.id;
            dto.date = this.timezoneService.toTimezone(new Date())!;
            dto.priority = this.determinePriorityLevel(violation.minutesElapsed, violation.threshold);
            dto.status = IncidentStatus.OPEN;
            return dto;
        });

        try {
            const createdIncidents = await Promise.all(
                incidentsDtos.map(dto => this.incidentsService.create(dto))
            );
            await Promise.all(
                createdIncidents.map((incident) => {
                    return this.incidentMessageRepository.save({
                        incident: { id: incident.id },
                        message: 'created',
                        author: { id: '123456789' }
                    });
                })
            );

            return incidentsDtos.length;
        } catch (error) {
            this.logger.error(`Failed to create incidents: ${error.message}`);
            return 0;
        }
    }

    private determinePriorityLevel(minutesElapsed: number, threshold: number): string {
        const severityFactor = minutesElapsed / threshold;
        if (severityFactor <= 1) return PriorityLevel.LOW;
        if (severityFactor <= 2) return PriorityLevel.MEDIUM;
        return PriorityLevel.HIGH;
    }
}