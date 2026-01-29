import { MongoRepository } from 'typeorm';
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
export declare class HrManagementService {
    private employeeRepository;
    private departmentRepository;
    private userRepository;
    private organizationRepository;
    private attendanceRepository;
    private leaveRepository;
    private shiftRepository;
    private holidayRepository;
    private salaryStructureRepository;
    private payrollRunRepository;
    private goalRepository;
    private reviewCycleRepository;
    private feedbackRepository;
    private complianceItemRepository;
    private complianceEventRepository;
    private auditLogRepository;
    private documentRecordRepository;
    private assetRepository;
    private assetAssignmentRepository;
    private gateway;
    constructor(employeeRepository: MongoRepository<Employee>, departmentRepository: MongoRepository<Department>, userRepository: MongoRepository<User>, organizationRepository: MongoRepository<Organization>, attendanceRepository: MongoRepository<Attendance>, leaveRepository: MongoRepository<LeaveRequest>, shiftRepository: MongoRepository<Shift>, holidayRepository: MongoRepository<Holiday>, salaryStructureRepository: MongoRepository<SalaryStructure>, payrollRunRepository: MongoRepository<PayrollRun>, goalRepository: MongoRepository<Goal>, reviewCycleRepository: MongoRepository<ReviewCycle>, feedbackRepository: MongoRepository<Feedback>, complianceItemRepository: MongoRepository<ComplianceItem>, complianceEventRepository: MongoRepository<ComplianceEvent>, auditLogRepository: MongoRepository<AuditLog>, documentRecordRepository: MongoRepository<DocumentRecord>, assetRepository: MongoRepository<Asset>, assetAssignmentRepository: MongoRepository<AssetAssignment>, gateway: MessagesGateway);
    getEmployees(organizationId?: string): Promise<Employee[]>;
    getDepartments(organizationId?: string): Promise<Department[]>;
    getStats(organizationId?: string): Promise<{
        total: number;
        active: number;
        departments: number;
        averageSalary: number;
        newHires: number;
    }>;
    createEmployee(employeeData: any, organizationId?: string): Promise<Employee[]>;
    updateEmployee(id: string, employeeData: any): Promise<Employee>;
    deleteEmployee(id: string): Promise<import("typeorm").DeleteResult>;
    createDepartment(departmentData: any, organizationId?: string): Promise<Department[]>;
    updateDepartment(id: string, departmentData: any): Promise<Department>;
    deleteDepartment(id: string): Promise<import("typeorm").DeleteResult>;
    getDepartmentEmployeeCount(departmentId: string): Promise<number>;
    attendanceCheckIn(employeeId: string, organizationId?: string, date?: Date, location?: {
        latitude: number;
        longitude: number;
        address?: string;
    }): Promise<any>;
    attendanceCheckOut(employeeId: string, date?: Date, location?: {
        latitude: number;
        longitude: number;
        address?: string;
    }): Promise<Attendance>;
    getAttendance(params: {
        employeeId?: string;
        organizationId?: string;
        from?: string;
        to?: string;
    }): Promise<Attendance[]>;
    createLeave(data: any, organizationId?: string): Promise<LeaveRequest[]>;
    setLeaveStatus(id: string, status: 'approved' | 'rejected'): Promise<LeaveRequest>;
    listLeaves(params: {
        employeeId?: string;
        organizationId?: string;
        status?: string;
    }): Promise<LeaveRequest[]>;
    createShift(data: any, organizationId?: string): Promise<Shift[]>;
    listShifts(organizationId?: string): Promise<Shift[]>;
    addHoliday(data: any, organizationId?: string): Promise<Holiday[]>;
    listHolidays(organizationId?: string): Promise<Holiday[]>;
    private computeIndianPayroll;
    upsertSalaryStructure(data: any, organizationId?: string): Promise<SalaryStructure | SalaryStructure[]>;
    runPayroll(organizationId: string, month: number, year: number): Promise<PayrollRun>;
    listPayrollRuns(organizationId: string): Promise<PayrollRun[]>;
    getPayrollRun(id: string): Promise<PayrollRun>;
    createGoal(data: any, organizationId?: string): Promise<Goal[]>;
    updateGoal(id: string, data: any): Promise<Goal>;
    listGoals(params: {
        employeeId?: string;
        organizationId?: string;
    }): Promise<Goal[]>;
    createReviewCycle(data: any, organizationId?: string): Promise<ReviewCycle[]>;
    submitFeedback(data: any, organizationId?: string): Promise<Feedback[]>;
    performanceAnalytics(organizationId: string): Promise<{
        totalFeedback: number;
        averageRating: number;
    }>;
    createComplianceItem(data: any, organizationId?: string): Promise<ComplianceItem[]>;
    listComplianceItems(organizationId: string): Promise<ComplianceItem[]>;
    scheduleComplianceEvent(data: any, organizationId?: string): Promise<ComplianceEvent[]>;
    markComplianceCompleted(id: string): Promise<ComplianceEvent>;
    complianceAlerts(organizationId: string): Promise<{
        upcoming: ComplianceEvent[];
        overdue: ComplianceEvent[];
    }>;
    logAudit(userId: string, action: string, organizationId: string, entity?: string, entityId?: string): Promise<AuditLog>;
    createDocumentRecord(data: any, organizationId?: string): Promise<DocumentRecord[]>;
    listDocumentRecords(params: {
        employeeId?: string;
        organizationId?: string;
    }): Promise<DocumentRecord[]>;
    createAsset(data: any, organizationId?: string): Promise<Asset[]>;
    listAssets(organizationId: string): Promise<Asset[]>;
    assignAsset(assetId: string, employeeId: string, organizationId?: string): Promise<AssetAssignment>;
    returnAsset(assignmentId: string): Promise<AssetAssignment>;
}
