import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Employee } from '../entities/employee.entity';
import { Department } from '../entities/department.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Attendance } from '../entities/attendance.entity';
import { LeaveRequest } from '../entities/leave.entity';
import { Shift } from '../entities/shift.entity';
import { Holiday } from '../entities/holiday.entity';
import { SalaryStructure, PayrollRun } from '../entities/payroll.entity';
import { Goal, ReviewCycle, Feedback } from '../entities/performance.entity';
import { ComplianceItem, ComplianceEvent, AuditLog } from '../entities/compliance.entity';
import { DocumentRecord } from '../entities/document.entity';
import { Asset, AssetAssignment } from '../entities/asset.entity';
import { MessagesGateway } from '../messages/messages.gateway';

@Injectable()
export class HrManagementService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: MongoRepository<Employee>,
    @InjectRepository(Department)
    private departmentRepository: MongoRepository<Department>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    @InjectRepository(Organization)
    private organizationRepository: MongoRepository<Organization>,
    @InjectRepository(Attendance)
    private attendanceRepository: MongoRepository<Attendance>,
    @InjectRepository(LeaveRequest)
    private leaveRepository: MongoRepository<LeaveRequest>,
    @InjectRepository(Shift)
    private shiftRepository: MongoRepository<Shift>,
    @InjectRepository(Holiday)
    private holidayRepository: MongoRepository<Holiday>,
    @InjectRepository(SalaryStructure)
    private salaryStructureRepository: MongoRepository<SalaryStructure>,
    @InjectRepository(PayrollRun)
    private payrollRunRepository: MongoRepository<PayrollRun>,
    @InjectRepository(Goal)
    private goalRepository: MongoRepository<Goal>,
    @InjectRepository(ReviewCycle)
    private reviewCycleRepository: MongoRepository<ReviewCycle>,
    @InjectRepository(Feedback)
    private feedbackRepository: MongoRepository<Feedback>,
    @InjectRepository(ComplianceItem)
    private complianceItemRepository: MongoRepository<ComplianceItem>,
    @InjectRepository(ComplianceEvent)
    private complianceEventRepository: MongoRepository<ComplianceEvent>,
    @InjectRepository(AuditLog)
    private auditLogRepository: MongoRepository<AuditLog>,
    @InjectRepository(DocumentRecord)
    private documentRecordRepository: MongoRepository<DocumentRecord>,
    @InjectRepository(Asset)
    private assetRepository: MongoRepository<Asset>,
    @InjectRepository(AssetAssignment)
    private assetAssignmentRepository: MongoRepository<AssetAssignment>,
    private gateway: MessagesGateway,
  ) {}

  async getEmployees(organizationId?: string) {
    if (organizationId) {
      return this.employeeRepository.find({
        where: { organizationId: new ObjectId(organizationId) }
      });
    }
    return this.employeeRepository.find();
  }

  async getDepartments(organizationId?: string) {
    if (organizationId) {
      return this.departmentRepository.find({
        where: { organizationId: new ObjectId(organizationId) }
      });
    }
    return this.departmentRepository.find();
  }

  async getStats(organizationId?: string) {
    let query = {};
    if (organizationId) {
      query = { organizationId: new ObjectId(organizationId) };
    }

    const total = await this.employeeRepository.count({ where: query });
    const active = await this.employeeRepository.count({ 
      where: { ...query, status: 'active' } 
    });
    
    const departments = await this.departmentRepository.count({ 
      where: organizationId ? { organizationId: new ObjectId(organizationId) } : {} 
    });

    // Calculate average salary
    const employees = await this.employeeRepository.find({ where: query });
    const totalSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
    const averageSalary = employees.length > 0 ? Math.round(totalSalary / employees.length) : 0;

    // Calculate new hires in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newHires = await this.employeeRepository.count({
      where: {
        ...query,
        hireDate: { $gte: thirtyDaysAgo }
      }
    });

    return { 
      total, 
      active, 
      departments, 
      averageSalary,
      newHires
    };
  }

  async createEmployee(employeeData: any, organizationId?: string) {
    if (organizationId) {
      employeeData.organizationId = new ObjectId(organizationId);
    }
    
    const employee = this.employeeRepository.create({
      ...employeeData,
      createdAt: new Date()
    });
    return this.employeeRepository.save(employee);
  }

  async updateEmployee(id: string, employeeData: any) {
    await this.employeeRepository.update(id, {
      ...employeeData,
      updatedAt: new Date()
    });
    return this.employeeRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async deleteEmployee(id: string) {
    return this.employeeRepository.delete(id);
  }

  async createDepartment(departmentData: any, organizationId?: string) {
    if (organizationId) {
      departmentData.organizationId = new ObjectId(organizationId);
    }
    
    const department = this.departmentRepository.create({
      ...departmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return this.departmentRepository.save(department);
  }

  async updateDepartment(id: string, departmentData: any) {
    await this.departmentRepository.update(id, {
      ...departmentData,
      updatedAt: new Date()
    });
    return this.departmentRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async deleteDepartment(id: string) {
    return this.departmentRepository.delete(id);
  }

  async getDepartmentEmployeeCount(departmentId: string) {
    return this.employeeRepository.count({
      where: { department: departmentId }
    });
  }

  // ===== Attendance & Leave Management =====
  async attendanceCheckIn(employeeId: string, organizationId?: string, date?: Date, location?: { latitude: number; longitude: number; address?: string }) {
    const workDate = date ? new Date(date) : new Date();
    const day = new Date(workDate.getFullYear(), workDate.getMonth(), workDate.getDate());
    const record = await this.attendanceRepository.findOne({
      where: {
        employeeId: new ObjectId(employeeId),
        date: day,
      } as any,
    });

    if (record) {
      if (!record.checkIn) {
        record.checkIn = new Date();
        record.checkInLocation = location;
        record.updatedAt = new Date();
        await this.attendanceRepository.save(record);
      }
      return record;
    }

    const newRecord: any = this.attendanceRepository.create({
      employeeId: new ObjectId(employeeId),
      date: day,
      checkIn: new Date(),
      checkInLocation: location,
      organizationId: organizationId ? new ObjectId(organizationId) : undefined,
      createdAt: new Date(),
    });
    return this.attendanceRepository.save(newRecord);
  }

  async attendanceCheckOut(employeeId: string, date?: Date, location?: { latitude: number; longitude: number; address?: string }) {
    const workDate = date ? new Date(date) : new Date();
    const day = new Date(workDate.getFullYear(), workDate.getMonth(), workDate.getDate());
    const record = await this.attendanceRepository.findOne({
      where: {
        employeeId: new ObjectId(employeeId),
        date: day,
      } as any,
    });
    if (!record) return null;
    record.checkOut = new Date();
    record.checkOutLocation = location;
    if (record.checkIn && record.checkOut) {
      record.totalHours = Math.round(((record.checkOut.getTime() - record.checkIn.getTime()) / (1000 * 60 * 60)) * 100) / 100;
    }
    record.updatedAt = new Date();
    return this.attendanceRepository.save(record);
  }

  async getAttendance(params: { employeeId?: string; organizationId?: string; from?: string; to?: string }) {
    const where: any = {};
    if (params.employeeId) where.employeeId = new ObjectId(params.employeeId);
    if (params.organizationId) where.organizationId = new ObjectId(params.organizationId);
    if (params.from || params.to) {
      where.date = {} as any;
      if (params.from) (where.date as any).$gte = new Date(params.from);
      if (params.to) (where.date as any).$lte = new Date(params.to);
    }
    return this.attendanceRepository.find({ where });
  }

  async createLeave(data: any, organizationId?: string) {
    const leave = this.leaveRepository.create({
      ...data,
      employeeId: new ObjectId(data.employeeId),
      organizationId: organizationId ? new ObjectId(organizationId) : undefined,
      createdAt: new Date(),
      status: 'pending',
    });
    const saved = await this.leaveRepository.save(leave);

    // Emit request notification to org room
    this.gateway.emitRequest({ orgId: String((saved as any).organizationId) }, {
      type: 'leave',
      action: 'created',
      data: saved,
    });

    return saved;
  }

  async setLeaveStatus(id: string, status: 'approved' | 'rejected') {
    await this.leaveRepository.update(id, { status, updatedAt: new Date() } as any);
    const updated = await this.leaveRepository.findOne({ where: { _id: new ObjectId(id) } as any });

    // Emit request status change
    if (updated) {
      this.gateway.emitNotification({ orgId: String((updated as any).organizationId) }, {
        type: 'leave',
        action: status,
        data: updated,
      });
    }

    return updated;
  }

  async listLeaves(params: { employeeId?: string; organizationId?: string; status?: string }) {
    const where: any = {};
    if (params.employeeId) where.employeeId = new ObjectId(params.employeeId);
    if (params.organizationId) where.organizationId = new ObjectId(params.organizationId);
    if (params.status) where.status = params.status;
    return this.leaveRepository.find({ where });
  }

  async createShift(data: any, organizationId?: string) {
    const shift = this.shiftRepository.create({ ...data, organizationId: new ObjectId(organizationId!), createdAt: new Date() });
    return this.shiftRepository.save(shift);
  }

  async listShifts(organizationId?: string) {
    const where: any = organizationId ? { organizationId: new ObjectId(organizationId) } : {};
    return this.shiftRepository.find({ where });
  }

  async addHoliday(data: any, organizationId?: string) {
    const holiday = this.holidayRepository.create({ ...data, organizationId: new ObjectId(organizationId!), createdAt: new Date() });
    return this.holidayRepository.save(holiday);
  }

  async listHolidays(organizationId?: string) {
    const where: any = organizationId ? { organizationId: new ObjectId(organizationId) } : {};
    return this.holidayRepository.find({ where });
  }

  // ===== Payroll Management (India - simplified) =====
  private computeIndianPayroll(components: { name: string; code?: string; amount: number; taxable?: boolean }[]) {
    const earnings = components.filter(c => (c as any).type !== 'deduction');
    const gross = earnings.reduce((s, c) => s + (c.amount || 0), 0);
    const basic = components.find(c => (c.code || '').toUpperCase() === 'BASIC');

    // PF (employee) 12% of Basic, capped Basic=15000 for conservative calc
    const pfBase = Math.min(basic ? basic.amount : 0, 15000);
    const pf = Math.round(pfBase * 0.12);

    // Professional Tax (flat placeholder)
    const pt = 200; // TODO: state-wise slabs

    // TDS placeholder (0 for MVP)
    const tds = 0;

    const statutoryDeductions = pf + pt + tds;
    return { gross, statutoryDeductions, breakdown: { pf, pt, tds } };
  }

  async upsertSalaryStructure(data: any, organizationId?: string) {
    const existing = await this.salaryStructureRepository.findOne({ where: { employeeId: new ObjectId(data.employeeId) } as any });
    const payload: any = {
      employeeId: new ObjectId(data.employeeId),
      earnings: data.earnings || [],
      deductions: data.deductions || [],
      reimbursements: data.reimbursements || [],
      organizationId: new ObjectId(organizationId!),
      updatedAt: new Date(),
    };
    if (existing) {
      await this.salaryStructureRepository.update(existing._id as any, payload);
      return this.salaryStructureRepository.findOne({ where: { _id: existing._id } as any });
    }
    const created = this.salaryStructureRepository.create({ ...payload, createdAt: new Date() });
    return this.salaryStructureRepository.save(created);
  }

  async runPayroll(organizationId: string, month: number, year: number) {
    const employees = await this.employeeRepository.find({ where: { organizationId: new ObjectId(organizationId) } as any });
    const run = this.payrollRunRepository.create({ organizationId: new ObjectId(organizationId), month, year, status: 'processed', createdAt: new Date(), processedAt: new Date(), items: [] });

    for (const emp of employees) {
      const structure = await this.salaryStructureRepository.findOne({ where: { employeeId: emp._id } as any });
      const earnings = structure?.earnings || [{ name: 'BASIC', code: 'BASIC', amount: emp.salary || 0 }];
      const { gross, statutoryDeductions, breakdown } = this.computeIndianPayroll(earnings as any);
      const otherDeductions = (structure?.deductions || []).reduce((s, d) => s + (d.amount || 0), 0);
      const reimbursements = (structure?.reimbursements || []).reduce((s, r) => s + (r.amount || 0), 0);
      const deductions = statutoryDeductions + otherDeductions;
      const net = Math.round(gross - deductions + reimbursements);

      run.items.push({
        employeeId: emp._id as any,
        gross: Math.round(gross),
        deductions: Math.round(deductions),
        net,
        components: [
          ...(earnings as any).map((e: any) => ({ name: e.name, amount: e.amount, type: 'earning' })),
          { name: 'PF', amount: breakdown.pf, type: 'deduction' },
          { name: 'PT', amount: breakdown.pt, type: 'deduction' },
          { name: 'TDS', amount: breakdown.tds, type: 'deduction' },
          ...((structure?.deductions || []).map(d => ({ name: d.name, amount: d.amount, type: 'deduction' as const }))),
          ...((structure?.reimbursements || []).map(r => ({ name: r.name, amount: r.amount, type: 'reimbursement' as const }))),
        ],
      } as any);
    }

    return this.payrollRunRepository.save(run);
  }

  async listPayrollRuns(organizationId: string) {
    return this.payrollRunRepository.find({ where: { organizationId: new ObjectId(organizationId) } as any });
  }

  async getPayrollRun(id: string) {
    return this.payrollRunRepository.findOne({ where: { _id: new ObjectId(id) } as any });
  }

  // ===== Performance Management =====
  async createGoal(data: any, organizationId?: string) {
    const goal = this.goalRepository.create({
      ...data,
      employeeId: new ObjectId(data.employeeId),
      organizationId: new ObjectId(organizationId!),
      createdAt: new Date(),
      progress: data.progress ?? 0,
    });
    return this.goalRepository.save(goal);
  }

  async updateGoal(id: string, data: any) {
    await this.goalRepository.update(id, { ...data, updatedAt: new Date() } as any);
    return this.goalRepository.findOne({ where: { _id: new ObjectId(id) } as any });
  }

  async listGoals(params: { employeeId?: string; organizationId?: string }) {
    const where: any = {};
    if (params.employeeId) where.employeeId = new ObjectId(params.employeeId);
    if (params.organizationId) where.organizationId = new ObjectId(params.organizationId);
    return this.goalRepository.find({ where });
  }

  async createReviewCycle(data: any, organizationId?: string) {
    const cycle = this.reviewCycleRepository.create({ ...data, organizationId: new ObjectId(organizationId!), createdAt: new Date(), status: data.status || 'draft' });
    return this.reviewCycleRepository.save(cycle);
  }

  async submitFeedback(data: any, organizationId?: string) {
    const feedback = this.feedbackRepository.create({
      ...data,
      reviewCycleId: new ObjectId(data.reviewCycleId),
      employeeId: new ObjectId(data.employeeId),
      reviewerId: new ObjectId(data.reviewerId),
      organizationId: new ObjectId(organizationId!),
      createdAt: new Date(),
    });
    return this.feedbackRepository.save(feedback);
  }

  async performanceAnalytics(organizationId: string) {
    const feedback = await this.feedbackRepository.find({ where: { organizationId: new ObjectId(organizationId) } as any });
    const avgRating = feedback.length ? Math.round((feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.length) * 100) / 100 : 0;
    return { totalFeedback: feedback.length, averageRating: avgRating };
  }

  // ===== Compliance Management =====
  async createComplianceItem(data: any, organizationId?: string) {
    const item = this.complianceItemRepository.create({ ...data, organizationId: new ObjectId(organizationId!), createdAt: new Date(), active: true });
    return this.complianceItemRepository.save(item);
  }

  async listComplianceItems(organizationId: string) {
    return this.complianceItemRepository.find({ where: { organizationId: new ObjectId(organizationId) } as any });
  }

  async scheduleComplianceEvent(data: any, organizationId?: string) {
    const event = this.complianceEventRepository.create({ ...data, itemId: new ObjectId(data.itemId), organizationId: new ObjectId(organizationId!), createdAt: new Date(), status: 'pending' });
    return this.complianceEventRepository.save(event);
  }

  async markComplianceCompleted(id: string) {
    await this.complianceEventRepository.update(id, { status: 'completed', completedAt: new Date() } as any);
    return this.complianceEventRepository.findOne({ where: { _id: new ObjectId(id) } as any });
  }

  async complianceAlerts(organizationId: string) {
    const now = new Date();
    const events = await this.complianceEventRepository.find({ where: { organizationId: new ObjectId(organizationId) } as any });
    const upcoming = events.filter(e => (e.status === 'pending') && e.dueDate > now && (e.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7);
    const overdue = events.filter(e => e.status === 'pending' && e.dueDate <= now);
    return { upcoming, overdue };
  }

  async logAudit(userId: string, action: string, organizationId: string, entity?: string, entityId?: string) {
    const log = this.auditLogRepository.create({ userId: new ObjectId(userId), action, organizationId: new ObjectId(organizationId), entity, entityId, timestamp: new Date() });
    return this.auditLogRepository.save(log);
  }

  // ===== Document Management =====
  async createDocumentRecord(data: any, organizationId?: string) {
    const rec = this.documentRecordRepository.create({ ...data, employeeId: new ObjectId(data.employeeId), organizationId: new ObjectId(organizationId!), createdAt: new Date() });
    return this.documentRecordRepository.save(rec);
  }

  async listDocumentRecords(params: { employeeId?: string; organizationId?: string }) {
    const where: any = {};
    if (params.employeeId) where.employeeId = new ObjectId(params.employeeId);
    if (params.organizationId) where.organizationId = new ObjectId(params.organizationId);
    return this.documentRecordRepository.find({ where });
  }

  // ===== Asset Management =====
  async createAsset(data: any, organizationId?: string) {
    const asset = this.assetRepository.create({ ...data, organizationId: new ObjectId(organizationId!), createdAt: new Date() });
    return this.assetRepository.save(asset);
  }

  async listAssets(organizationId: string) {
    return this.assetRepository.find({ where: { organizationId: new ObjectId(organizationId) } as any });
  }

  async assignAsset(assetId: string, employeeId: string, organizationId?: string) {
    const assignment = this.assetAssignmentRepository.create({ assetId: new ObjectId(assetId), employeeId: new ObjectId(employeeId), organizationId: new ObjectId(organizationId!), assignedAt: new Date() });
    return this.assetAssignmentRepository.save(assignment);
  }

  async returnAsset(assignmentId: string) {
    await this.assetAssignmentRepository.update(assignmentId, { returnedAt: new Date() } as any);
    return this.assetAssignmentRepository.findOne({ where: { _id: new ObjectId(assignmentId) } as any });
  }
}