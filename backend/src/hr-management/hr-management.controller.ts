import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { HrManagementService } from './hr-management.service';

@Controller('hr-management')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class HrManagementController {
  constructor(private readonly hrService: HrManagementService) {}

  // ===== Core Lists =====
  @Get('employees')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  getEmployees(@Query('organizationId') organizationId?: string) {
    return this.hrService.getEmployees(organizationId);
  }

  @Get('departments')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  getDepartments(@Query('organizationId') organizationId?: string) {
    return this.hrService.getDepartments(organizationId);
  }

  @Get('stats')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  getStats(@Query('organizationId') organizationId?: string) {
    return this.hrService.getStats(organizationId);
  }

  @Post('employees')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  createEmployee(@Body() employeeData: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.createEmployee(employeeData, organizationId);
  }

  @Put('employees/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  updateEmployee(@Param('id') id: string, @Body() employeeData: any) {
    return this.hrService.updateEmployee(id, employeeData);
  }

  @Delete('employees/:id')
  @RequireRoles(RoleType.SUPER_ADMIN)
  deleteEmployee(@Param('id') id: string) {
    return this.hrService.deleteEmployee(id);
  }

  @Post('departments')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  createDepartment(@Body() departmentData: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.createDepartment(departmentData, organizationId);
  }

  @Put('departments/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  updateDepartment(@Param('id') id: string, @Body() departmentData: any) {
    return this.hrService.updateDepartment(id, departmentData);
  }

  @Delete('departments/:id')
  @RequireRoles(RoleType.SUPER_ADMIN)
  deleteDepartment(@Param('id') id: string) {
    return this.hrService.deleteDepartment(id);
  }

  @Get('departments/:id/employee-count')
  getDepartmentEmployeeCount(@Param('id') id: string) {
    return this.hrService.getDepartmentEmployeeCount(id);
  }

  // ===== Attendance & Leave Management =====
  @Post('attendance/check-in')
  checkIn(@Body() body: { employeeId: string }, @Query('organizationId') organizationId?: string) {
    return this.hrService.attendanceCheckIn(body.employeeId, organizationId);
  }

  @Post('attendance/check-out')
  checkOut(@Body() body: { employeeId: string }) {
    return this.hrService.attendanceCheckOut(body.employeeId);
  }

  @Get('attendance')
  getAttendance(
    @Query('employeeId') employeeId?: string,
    @Query('organizationId') organizationId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.hrService.getAttendance({ employeeId, organizationId, from, to });
  }

  @Post('leaves')
  createLeave(@Body() body: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.createLeave(body, organizationId);
  }

  @Patch('leaves/:id/status')
  setLeaveStatus(@Param('id') id: string, @Body() body: { status: 'approved' | 'rejected' }) {
    return this.hrService.setLeaveStatus(id, body.status);
  }

  @Get('leaves')
  listLeaves(
    @Query('employeeId') employeeId?: string,
    @Query('organizationId') organizationId?: string,
    @Query('status') status?: string,
  ) {
    return this.hrService.listLeaves({ employeeId, organizationId, status });
  }

  @Post('shifts')
  createShift(@Body() body: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.createShift(body, organizationId);
  }

  @Get('shifts')
  listShifts(@Query('organizationId') organizationId?: string) {
    return this.hrService.listShifts(organizationId);
  }

  @Post('holidays')
  addHoliday(@Body() body: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.addHoliday(body, organizationId);
  }

  @Get('holidays')
  listHolidays(@Query('organizationId') organizationId?: string) {
    return this.hrService.listHolidays(organizationId);
  }

  // ===== Payroll Management =====
  @Post('salary-structures')
  upsertSalaryStructure(@Body() body: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.upsertSalaryStructure(body, organizationId);
  }

  @Post('payroll/run')
  runPayroll(@Body() body: { organizationId: string; month: number; year: number }) {
    return this.hrService.runPayroll(body.organizationId, body.month, body.year);
  }

  @Get('payroll/runs')
  listPayrollRuns(@Query('organizationId') organizationId: string) {
    return this.hrService.listPayrollRuns(organizationId);
  }

  @Get('payroll/runs/:id')
  getPayrollRun(@Param('id') id: string) {
    return this.hrService.getPayrollRun(id);
  }

  // ===== Performance Management =====
  @Post('goals')
  createGoal(@Body() body: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.createGoal(body, organizationId);
  }

  @Patch('goals/:id')
  updateGoal(@Param('id') id: string, @Body() body: any) {
    return this.hrService.updateGoal(id, body);
  }

  @Get('goals')
  listGoals(@Query('employeeId') employeeId?: string, @Query('organizationId') organizationId?: string) {
    return this.hrService.listGoals({ employeeId, organizationId });
  }

  @Post('review-cycles')
  createReviewCycle(@Body() body: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.createReviewCycle(body, organizationId);
  }

  @Post('feedback')
  submitFeedback(@Body() body: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.submitFeedback(body, organizationId);
  }

  @Get('performance/analytics')
  performanceAnalytics(@Query('organizationId') organizationId: string) {
    return this.hrService.performanceAnalytics(organizationId);
  }

  // ===== Compliance Management =====
  @Post('compliance/items')
  createComplianceItem(@Body() body: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.createComplianceItem(body, organizationId);
  }

  @Get('compliance/items')
  listComplianceItems(@Query('organizationId') organizationId: string) {
    return this.hrService.listComplianceItems(organizationId);
  }

  @Post('compliance/events')
  scheduleComplianceEvent(@Body() body: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.scheduleComplianceEvent(body, organizationId);
  }

  @Patch('compliance/events/:id/complete')
  markComplianceCompleted(@Param('id') id: string) {
    return this.hrService.markComplianceCompleted(id);
  }

  @Get('compliance/alerts')
  complianceAlerts(@Query('organizationId') organizationId: string) {
    return this.hrService.complianceAlerts(organizationId);
  }

  // ===== Document Management (metadata for GridFS integration) =====
  @Post('documents')
  createDocumentRecord(@Body() body: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.createDocumentRecord(body, organizationId);
  }

  @Get('documents')
  listDocumentRecords(@Query('employeeId') employeeId?: string, @Query('organizationId') organizationId?: string) {
    return this.hrService.listDocumentRecords({ employeeId, organizationId });
  }

  // ===== Asset Management =====
  @Post('assets')
  createAsset(@Body() body: any, @Query('organizationId') organizationId?: string) {
    return this.hrService.createAsset(body, organizationId);
  }

  @Get('assets')
  listAssets(@Query('organizationId') organizationId: string) {
    return this.hrService.listAssets(organizationId);
  }

  @Post('assets/assign')
  assignAsset(@Body() body: { assetId: string; employeeId: string }, @Query('organizationId') organizationId?: string) {
    return this.hrService.assignAsset(body.assetId, body.employeeId, organizationId);
  }

  @Patch('assets/assignments/:id/return')
  returnAsset(@Param('id') id: string) {
    return this.hrService.returnAsset(id);
  }
}