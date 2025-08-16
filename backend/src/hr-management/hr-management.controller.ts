import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { HrManagementService } from './hr-management.service';

@Controller('hr-management')
@UseGuards(JwtAuthGuard)
export class HrManagementController {
  constructor(private readonly hrService: HrManagementService) {}

  @Get('employees')
  getEmployees() {
    return this.hrService.getEmployees();
  }

  @Get('stats')
  getStats() {
    return this.hrService.getStats();
  }

  @Post('employees')
  createEmployee(@Body() employeeData: any) {
    return this.hrService.createEmployee(employeeData);
  }

  @Put('employees/:id')
  updateEmployee(@Param('id') id: string, @Body() employeeData: any) {
    return this.hrService.updateEmployee(id, employeeData);
  }

  @Delete('employees/:id')
  deleteEmployee(@Param('id') id: string) {
    return this.hrService.deleteEmployee(id);
  }
}