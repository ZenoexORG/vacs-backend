import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../../shared/decorators/permissions.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get dashboard stats' })
  @ApiQuery({
    name: 'month',
    description: 'Month number',
    required: true,
    default: 1,
  })
  @Get('stats')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:dashboard')
  async getStats(@Query('month') month: number) {
    return this.dashboardService.getStats(month);
  }

  @ApiOperation({ summary: 'Get access logs by month' })
  @ApiQuery({
    name: 'month',
    description: 'Month number',
    required: true,
    default: 1,
  })
  @ApiQuery({ name: 'year', description: 'Year number', required: false })
  @Get('vehicle-entries')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:dashboard')
  async getAccessLogsByMonth(
    @Query('month') month: number,
    @Query('year') year?: number,
  ) {
    return this.dashboardService.getAccessLogsByMonth(month, year);
  }
}
