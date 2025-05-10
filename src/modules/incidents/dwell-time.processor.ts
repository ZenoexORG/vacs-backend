import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { DwellTimeMonitorService } from './dwell-time-monitor.service';

@Processor('dwell-time')
@Injectable()
export class DwellTimeProcessor {
    constructor(private readonly dwellTimeMonitorService: DwellTimeMonitorService) { }

    @Process('check')
    async handleDwellTimeCheck(job: Job<{ accessLogId: number }>) {
        await this.dwellTimeMonitorService.handleDwellTimeJob(job.data.accessLogId);
    }
}