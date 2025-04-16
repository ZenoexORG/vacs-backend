import { 
  Controller, 
  Get, 
  Query,   
  ParseIntPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,  
  ApiOperation,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Auth } from '../../shared/decorators/permissions.decorator';
import { AppPermissions } from '../../shared/enums/permissions.enum';

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
  @Auth(AppPermissions.DASHBOARD_READ)
  @Get('stats')
  async getStats(@Query('month', ParseIntPipe) month: number) {
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
  @Auth(AppPermissions.DASHBOARD_READ)
  @Get('vehicle-entries')
  async getAccessLogsByMonth(
    @Query('month', ParseIntPipe) month: number,
    @Query('year') year?: number,
  ) {
    return this.dashboardService.getAccessLogsByMonth(month, year);
  }
}