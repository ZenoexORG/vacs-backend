import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    const isRunning = process.uptime() > 0;
    return {
      name: 'Vehicle Access Control API',
      description: 'API for managing vehicle access control in UTB',
      version: '1.0.0',
      status: isRunning ? 'running' : 'stopped',
      uptime: process.uptime(),
      documentation: '/docs',
    };
  }
}
