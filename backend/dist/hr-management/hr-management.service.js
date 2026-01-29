"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrManagementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const employee_entity_1 = require("../entities/employee.entity");
const department_entity_1 = require("../entities/department.entity");
const user_entity_1 = require("../entities/user.entity");
const organization_entity_1 = require("../entities/organization.entity");
const attendance_entity_1 = require("../entities/attendance.entity");
const leave_entity_1 = require("../entities/leave.entity");
const shift_entity_1 = require("../entities/shift.entity");
const holiday_entity_1 = require("../entities/holiday.entity");
const payroll_entity_1 = require("../entities/payroll.entity");
const performance_entity_1 = require("../entities/performance.entity");
const compliance_entity_1 = require("../entities/compliance.entity");
const document_entity_1 = require("../entities/document.entity");
const asset_entity_1 = require("../entities/asset.entity");
const messages_gateway_1 = require("../messages/messages.gateway");
let HrManagementService = class HrManagementService {
    constructor(employeeRepository, departmentRepository, userRepository, organizationRepository, attendanceRepository, leaveRepository, shiftRepository, holidayRepository, salaryStructureRepository, payrollRunRepository, goalRepository, reviewCycleRepository, feedbackRepository, complianceItemRepository, complianceEventRepository, auditLogRepository, documentRecordRepository, assetRepository, assetAssignmentRepository, gateway) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.shiftRepository = shiftRepository;
        this.holidayRepository = holidayRepository;
        this.salaryStructureRepository = salaryStructureRepository;
        this.payrollRunRepository = payrollRunRepository;
        this.goalRepository = goalRepository;
        this.reviewCycleRepository = reviewCycleRepository;
        this.feedbackRepository = feedbackRepository;
        this.complianceItemRepository = complianceItemRepository;
        this.complianceEventRepository = complianceEventRepository;
        this.auditLogRepository = auditLogRepository;
        this.documentRecordRepository = documentRecordRepository;
        this.assetRepository = assetRepository;
        this.assetAssignmentRepository = assetAssignmentRepository;
        this.gateway = gateway;
    }
    async getEmployees(organizationId) {
        if (organizationId) {
            return this.employeeRepository.find({
                where: { organizationId: new mongodb_1.ObjectId(organizationId) }
            });
        }
        return this.employeeRepository.find();
    }
    async getDepartments(organizationId) {
        if (organizationId) {
            return this.departmentRepository.find({
                where: { organizationId: new mongodb_1.ObjectId(organizationId) }
            });
        }
        return this.departmentRepository.find();
    }
    async getStats(organizationId) {
        let query = {};
        if (organizationId) {
            query = { organizationId: new mongodb_1.ObjectId(organizationId) };
        }
        const total = await this.employeeRepository.count({ where: query });
        const active = await this.employeeRepository.count({
            where: { ...query, status: 'active' }
        });
        const departments = await this.departmentRepository.count({
            where: organizationId ? { organizationId: new mongodb_1.ObjectId(organizationId) } : {}
        });
        const employees = await this.employeeRepository.find({ where: query });
        const totalSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
        const averageSalary = employees.length > 0 ? Math.round(totalSalary / employees.length) : 0;
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
    async createEmployee(employeeData, organizationId) {
        if (organizationId) {
            employeeData.organizationId = new mongodb_1.ObjectId(organizationId);
        }
        const employee = this.employeeRepository.create({
            ...employeeData,
            createdAt: new Date()
        });
        return this.employeeRepository.save(employee);
    }
    async updateEmployee(id, employeeData) {
        await this.employeeRepository.update(id, {
            ...employeeData,
            updatedAt: new Date()
        });
        return this.employeeRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async deleteEmployee(id) {
        return this.employeeRepository.delete(id);
    }
    async createDepartment(departmentData, organizationId) {
        if (organizationId) {
            departmentData.organizationId = new mongodb_1.ObjectId(organizationId);
        }
        const department = this.departmentRepository.create({
            ...departmentData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return this.departmentRepository.save(department);
    }
    async updateDepartment(id, departmentData) {
        await this.departmentRepository.update(id, {
            ...departmentData,
            updatedAt: new Date()
        });
        return this.departmentRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async deleteDepartment(id) {
        return this.departmentRepository.delete(id);
    }
    async getDepartmentEmployeeCount(departmentId) {
        return this.employeeRepository.count({
            where: { department: departmentId }
        });
    }
    async attendanceCheckIn(employeeId, organizationId, date, location) {
        const workDate = date ? new Date(date) : new Date();
        const day = new Date(workDate.getFullYear(), workDate.getMonth(), workDate.getDate());
        const record = await this.attendanceRepository.findOne({
            where: {
                employeeId: new mongodb_1.ObjectId(employeeId),
                date: day,
            },
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
        const newRecord = this.attendanceRepository.create({
            employeeId: new mongodb_1.ObjectId(employeeId),
            date: day,
            checkIn: new Date(),
            checkInLocation: location,
            organizationId: organizationId ? new mongodb_1.ObjectId(organizationId) : undefined,
            createdAt: new Date(),
        });
        return this.attendanceRepository.save(newRecord);
    }
    async attendanceCheckOut(employeeId, date, location) {
        const workDate = date ? new Date(date) : new Date();
        const day = new Date(workDate.getFullYear(), workDate.getMonth(), workDate.getDate());
        const record = await this.attendanceRepository.findOne({
            where: {
                employeeId: new mongodb_1.ObjectId(employeeId),
                date: day,
            },
        });
        if (!record)
            return null;
        record.checkOut = new Date();
        record.checkOutLocation = location;
        if (record.checkIn && record.checkOut) {
            record.totalHours = Math.round(((record.checkOut.getTime() - record.checkIn.getTime()) / (1000 * 60 * 60)) * 100) / 100;
        }
        record.updatedAt = new Date();
        return this.attendanceRepository.save(record);
    }
    async getAttendance(params) {
        const where = {};
        if (params.employeeId)
            where.employeeId = new mongodb_1.ObjectId(params.employeeId);
        if (params.organizationId)
            where.organizationId = new mongodb_1.ObjectId(params.organizationId);
        if (params.from || params.to) {
            where.date = {};
            if (params.from)
                where.date.$gte = new Date(params.from);
            if (params.to)
                where.date.$lte = new Date(params.to);
        }
        return this.attendanceRepository.find({ where });
    }
    async createLeave(data, organizationId) {
        const leave = this.leaveRepository.create({
            ...data,
            employeeId: new mongodb_1.ObjectId(data.employeeId),
            organizationId: organizationId ? new mongodb_1.ObjectId(organizationId) : undefined,
            createdAt: new Date(),
            status: 'pending',
        });
        const saved = await this.leaveRepository.save(leave);
        this.gateway.emitRequest({ orgId: String(saved.organizationId) }, {
            type: 'leave',
            action: 'created',
            data: saved,
        });
        return saved;
    }
    async setLeaveStatus(id, status) {
        await this.leaveRepository.update(id, { status, updatedAt: new Date() });
        const updated = await this.leaveRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
        if (updated) {
            this.gateway.emitNotification({ orgId: String(updated.organizationId) }, {
                type: 'leave',
                action: status,
                data: updated,
            });
        }
        return updated;
    }
    async listLeaves(params) {
        const where = {};
        if (params.employeeId)
            where.employeeId = new mongodb_1.ObjectId(params.employeeId);
        if (params.organizationId)
            where.organizationId = new mongodb_1.ObjectId(params.organizationId);
        if (params.status)
            where.status = params.status;
        return this.leaveRepository.find({ where });
    }
    async createShift(data, organizationId) {
        const shift = this.shiftRepository.create({ ...data, organizationId: new mongodb_1.ObjectId(organizationId), createdAt: new Date() });
        return this.shiftRepository.save(shift);
    }
    async listShifts(organizationId) {
        const where = organizationId ? { organizationId: new mongodb_1.ObjectId(organizationId) } : {};
        return this.shiftRepository.find({ where });
    }
    async addHoliday(data, organizationId) {
        const holiday = this.holidayRepository.create({ ...data, organizationId: new mongodb_1.ObjectId(organizationId), createdAt: new Date() });
        return this.holidayRepository.save(holiday);
    }
    async listHolidays(organizationId) {
        const where = organizationId ? { organizationId: new mongodb_1.ObjectId(organizationId) } : {};
        return this.holidayRepository.find({ where });
    }
    computeIndianPayroll(components) {
        const earnings = components.filter(c => c.type !== 'deduction');
        const gross = earnings.reduce((s, c) => s + (c.amount || 0), 0);
        const basic = components.find(c => (c.code || '').toUpperCase() === 'BASIC');
        const pfBase = Math.min(basic ? basic.amount : 0, 15000);
        const pf = Math.round(pfBase * 0.12);
        const pt = 200;
        const tds = 0;
        const statutoryDeductions = pf + pt + tds;
        return { gross, statutoryDeductions, breakdown: { pf, pt, tds } };
    }
    async upsertSalaryStructure(data, organizationId) {
        const existing = await this.salaryStructureRepository.findOne({ where: { employeeId: new mongodb_1.ObjectId(data.employeeId) } });
        const payload = {
            employeeId: new mongodb_1.ObjectId(data.employeeId),
            earnings: data.earnings || [],
            deductions: data.deductions || [],
            reimbursements: data.reimbursements || [],
            organizationId: new mongodb_1.ObjectId(organizationId),
            updatedAt: new Date(),
        };
        if (existing) {
            await this.salaryStructureRepository.update(existing._id, payload);
            return this.salaryStructureRepository.findOne({ where: { _id: existing._id } });
        }
        const created = this.salaryStructureRepository.create({ ...payload, createdAt: new Date() });
        return this.salaryStructureRepository.save(created);
    }
    async runPayroll(organizationId, month, year) {
        const employees = await this.employeeRepository.find({ where: { organizationId: new mongodb_1.ObjectId(organizationId) } });
        const run = this.payrollRunRepository.create({ organizationId: new mongodb_1.ObjectId(organizationId), month, year, status: 'processed', createdAt: new Date(), processedAt: new Date(), items: [] });
        for (const emp of employees) {
            const structure = await this.salaryStructureRepository.findOne({ where: { employeeId: emp._id } });
            const earnings = structure?.earnings || [{ name: 'BASIC', code: 'BASIC', amount: emp.salary || 0 }];
            const { gross, statutoryDeductions, breakdown } = this.computeIndianPayroll(earnings);
            const otherDeductions = (structure?.deductions || []).reduce((s, d) => s + (d.amount || 0), 0);
            const reimbursements = (structure?.reimbursements || []).reduce((s, r) => s + (r.amount || 0), 0);
            const deductions = statutoryDeductions + otherDeductions;
            const net = Math.round(gross - deductions + reimbursements);
            run.items.push({
                employeeId: emp._id,
                gross: Math.round(gross),
                deductions: Math.round(deductions),
                net,
                components: [
                    ...earnings.map((e) => ({ name: e.name, amount: e.amount, type: 'earning' })),
                    { name: 'PF', amount: breakdown.pf, type: 'deduction' },
                    { name: 'PT', amount: breakdown.pt, type: 'deduction' },
                    { name: 'TDS', amount: breakdown.tds, type: 'deduction' },
                    ...((structure?.deductions || []).map(d => ({ name: d.name, amount: d.amount, type: 'deduction' }))),
                    ...((structure?.reimbursements || []).map(r => ({ name: r.name, amount: r.amount, type: 'reimbursement' }))),
                ],
            });
        }
        return this.payrollRunRepository.save(run);
    }
    async listPayrollRuns(organizationId) {
        return this.payrollRunRepository.find({ where: { organizationId: new mongodb_1.ObjectId(organizationId) } });
    }
    async getPayrollRun(id) {
        return this.payrollRunRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async createGoal(data, organizationId) {
        const goal = this.goalRepository.create({
            ...data,
            employeeId: new mongodb_1.ObjectId(data.employeeId),
            organizationId: new mongodb_1.ObjectId(organizationId),
            createdAt: new Date(),
            progress: data.progress ?? 0,
        });
        return this.goalRepository.save(goal);
    }
    async updateGoal(id, data) {
        await this.goalRepository.update(id, { ...data, updatedAt: new Date() });
        return this.goalRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async listGoals(params) {
        const where = {};
        if (params.employeeId)
            where.employeeId = new mongodb_1.ObjectId(params.employeeId);
        if (params.organizationId)
            where.organizationId = new mongodb_1.ObjectId(params.organizationId);
        return this.goalRepository.find({ where });
    }
    async createReviewCycle(data, organizationId) {
        const cycle = this.reviewCycleRepository.create({ ...data, organizationId: new mongodb_1.ObjectId(organizationId), createdAt: new Date(), status: data.status || 'draft' });
        return this.reviewCycleRepository.save(cycle);
    }
    async submitFeedback(data, organizationId) {
        const feedback = this.feedbackRepository.create({
            ...data,
            reviewCycleId: new mongodb_1.ObjectId(data.reviewCycleId),
            employeeId: new mongodb_1.ObjectId(data.employeeId),
            reviewerId: new mongodb_1.ObjectId(data.reviewerId),
            organizationId: new mongodb_1.ObjectId(organizationId),
            createdAt: new Date(),
        });
        return this.feedbackRepository.save(feedback);
    }
    async performanceAnalytics(organizationId) {
        const feedback = await this.feedbackRepository.find({ where: { organizationId: new mongodb_1.ObjectId(organizationId) } });
        const avgRating = feedback.length ? Math.round((feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.length) * 100) / 100 : 0;
        return { totalFeedback: feedback.length, averageRating: avgRating };
    }
    async createComplianceItem(data, organizationId) {
        const item = this.complianceItemRepository.create({ ...data, organizationId: new mongodb_1.ObjectId(organizationId), createdAt: new Date(), active: true });
        return this.complianceItemRepository.save(item);
    }
    async listComplianceItems(organizationId) {
        return this.complianceItemRepository.find({ where: { organizationId: new mongodb_1.ObjectId(organizationId) } });
    }
    async scheduleComplianceEvent(data, organizationId) {
        const event = this.complianceEventRepository.create({ ...data, itemId: new mongodb_1.ObjectId(data.itemId), organizationId: new mongodb_1.ObjectId(organizationId), createdAt: new Date(), status: 'pending' });
        return this.complianceEventRepository.save(event);
    }
    async markComplianceCompleted(id) {
        await this.complianceEventRepository.update(id, { status: 'completed', completedAt: new Date() });
        return this.complianceEventRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async complianceAlerts(organizationId) {
        const now = new Date();
        const events = await this.complianceEventRepository.find({ where: { organizationId: new mongodb_1.ObjectId(organizationId) } });
        const upcoming = events.filter(e => (e.status === 'pending') && e.dueDate > now && (e.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7);
        const overdue = events.filter(e => e.status === 'pending' && e.dueDate <= now);
        return { upcoming, overdue };
    }
    async logAudit(userId, action, organizationId, entity, entityId) {
        const log = this.auditLogRepository.create({ userId: new mongodb_1.ObjectId(userId), action, organizationId: new mongodb_1.ObjectId(organizationId), entity, entityId, timestamp: new Date() });
        return this.auditLogRepository.save(log);
    }
    async createDocumentRecord(data, organizationId) {
        const rec = this.documentRecordRepository.create({ ...data, employeeId: new mongodb_1.ObjectId(data.employeeId), organizationId: new mongodb_1.ObjectId(organizationId), createdAt: new Date() });
        return this.documentRecordRepository.save(rec);
    }
    async listDocumentRecords(params) {
        const where = {};
        if (params.employeeId)
            where.employeeId = new mongodb_1.ObjectId(params.employeeId);
        if (params.organizationId)
            where.organizationId = new mongodb_1.ObjectId(params.organizationId);
        return this.documentRecordRepository.find({ where });
    }
    async createAsset(data, organizationId) {
        const asset = this.assetRepository.create({ ...data, organizationId: new mongodb_1.ObjectId(organizationId), createdAt: new Date() });
        return this.assetRepository.save(asset);
    }
    async listAssets(organizationId) {
        return this.assetRepository.find({ where: { organizationId: new mongodb_1.ObjectId(organizationId) } });
    }
    async assignAsset(assetId, employeeId, organizationId) {
        const assignment = this.assetAssignmentRepository.create({ assetId: new mongodb_1.ObjectId(assetId), employeeId: new mongodb_1.ObjectId(employeeId), organizationId: new mongodb_1.ObjectId(organizationId), assignedAt: new Date() });
        return this.assetAssignmentRepository.save(assignment);
    }
    async returnAsset(assignmentId) {
        await this.assetAssignmentRepository.update(assignmentId, { returnedAt: new Date() });
        return this.assetAssignmentRepository.findOne({ where: { _id: new mongodb_1.ObjectId(assignmentId) } });
    }
};
exports.HrManagementService = HrManagementService;
exports.HrManagementService = HrManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(4, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(5, (0, typeorm_1.InjectRepository)(leave_entity_1.LeaveRequest)),
    __param(6, (0, typeorm_1.InjectRepository)(shift_entity_1.Shift)),
    __param(7, (0, typeorm_1.InjectRepository)(holiday_entity_1.Holiday)),
    __param(8, (0, typeorm_1.InjectRepository)(payroll_entity_1.SalaryStructure)),
    __param(9, (0, typeorm_1.InjectRepository)(payroll_entity_1.PayrollRun)),
    __param(10, (0, typeorm_1.InjectRepository)(performance_entity_1.Goal)),
    __param(11, (0, typeorm_1.InjectRepository)(performance_entity_1.ReviewCycle)),
    __param(12, (0, typeorm_1.InjectRepository)(performance_entity_1.Feedback)),
    __param(13, (0, typeorm_1.InjectRepository)(compliance_entity_1.ComplianceItem)),
    __param(14, (0, typeorm_1.InjectRepository)(compliance_entity_1.ComplianceEvent)),
    __param(15, (0, typeorm_1.InjectRepository)(compliance_entity_1.AuditLog)),
    __param(16, (0, typeorm_1.InjectRepository)(document_entity_1.DocumentRecord)),
    __param(17, (0, typeorm_1.InjectRepository)(asset_entity_1.Asset)),
    __param(18, (0, typeorm_1.InjectRepository)(asset_entity_1.AssetAssignment)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        messages_gateway_1.MessagesGateway])
], HrManagementService);
//# sourceMappingURL=hr-management.service.js.map