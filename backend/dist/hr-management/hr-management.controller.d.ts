import { HrManagementService } from './hr-management.service';
export declare class HrManagementController {
    private readonly hrService;
    constructor(hrService: HrManagementService);
    getEmployees(organizationId?: string): Promise<import("../entities/employee.entity").Employee[]>;
    getDepartments(organizationId?: string): Promise<import("../entities/department.entity").Department[]>;
    getStats(organizationId?: string): Promise<{
        total: number;
        active: number;
        departments: number;
        averageSalary: number;
        newHires: number;
    }>;
    createEmployee(employeeData: any, organizationId?: string): Promise<import("../entities/employee.entity").Employee[]>;
    updateEmployee(id: string, employeeData: any): Promise<import("../entities/employee.entity").Employee>;
    deleteEmployee(id: string): Promise<import("typeorm").DeleteResult>;
    createDepartment(departmentData: any, organizationId?: string): Promise<import("../entities/department.entity").Department[]>;
    updateDepartment(id: string, departmentData: any): Promise<import("../entities/department.entity").Department>;
    deleteDepartment(id: string): Promise<import("typeorm").DeleteResult>;
    getDepartmentEmployeeCount(id: string): Promise<number>;
    checkIn(body: {
        employeeId: string;
        location?: {
            latitude: number;
            longitude: number;
            address?: string;
        };
    }, organizationId?: string): Promise<any>;
    checkOut(body: {
        employeeId: string;
        location?: {
            latitude: number;
            longitude: number;
            address?: string;
        };
    }, organizationId?: string): Promise<import("../entities/attendance.entity").Attendance>;
    getAttendance(employeeId?: string, organizationId?: string, from?: string, to?: string): Promise<import("../entities/attendance.entity").Attendance[]>;
    createLeave(body: any, organizationId?: string): Promise<import("../entities/leave.entity").LeaveRequest[]>;
    setLeaveStatus(id: string, body: {
        status: 'approved' | 'rejected';
    }): Promise<import("../entities/leave.entity").LeaveRequest>;
    listLeaves(employeeId?: string, organizationId?: string, status?: string): Promise<import("../entities/leave.entity").LeaveRequest[]>;
    createShift(body: any, organizationId?: string): Promise<import("../entities/shift.entity").Shift[]>;
    listShifts(organizationId?: string): Promise<import("../entities/shift.entity").Shift[]>;
    addHoliday(body: any, organizationId?: string): Promise<import("../entities/holiday.entity").Holiday[]>;
    listHolidays(organizationId?: string): Promise<import("../entities/holiday.entity").Holiday[]>;
    upsertSalaryStructure(body: any, organizationId?: string): Promise<import("../entities/payroll.entity").SalaryStructure | import("../entities/payroll.entity").SalaryStructure[]>;
    runPayroll(body: {
        organizationId: string;
        month: number;
        year: number;
    }): Promise<import("../entities/payroll.entity").PayrollRun>;
    listPayrollRuns(organizationId: string): Promise<import("../entities/payroll.entity").PayrollRun[]>;
    getPayrollRun(id: string): Promise<import("../entities/payroll.entity").PayrollRun>;
    createGoal(body: any, organizationId?: string): Promise<import("../entities/performance.entity").Goal[]>;
    updateGoal(id: string, body: any): Promise<import("../entities/performance.entity").Goal>;
    listGoals(employeeId?: string, organizationId?: string): Promise<import("../entities/performance.entity").Goal[]>;
    createReviewCycle(body: any, organizationId?: string): Promise<import("../entities/performance.entity").ReviewCycle[]>;
    submitFeedback(body: any, organizationId?: string): Promise<import("../entities/performance.entity").Feedback[]>;
    performanceAnalytics(organizationId: string): Promise<{
        totalFeedback: number;
        averageRating: number;
    }>;
    createComplianceItem(body: any, organizationId?: string): Promise<import("../entities/compliance.entity").ComplianceItem[]>;
    listComplianceItems(organizationId: string): Promise<import("../entities/compliance.entity").ComplianceItem[]>;
    scheduleComplianceEvent(body: any, organizationId?: string): Promise<import("../entities/compliance.entity").ComplianceEvent[]>;
    markComplianceCompleted(id: string): Promise<import("../entities/compliance.entity").ComplianceEvent>;
    complianceAlerts(organizationId: string): Promise<{
        upcoming: import("../entities/compliance.entity").ComplianceEvent[];
        overdue: import("../entities/compliance.entity").ComplianceEvent[];
    }>;
    createDocumentRecord(body: any, organizationId?: string): Promise<import("../entities/document.entity").DocumentRecord[]>;
    listDocumentRecords(employeeId?: string, organizationId?: string): Promise<import("../entities/document.entity").DocumentRecord[]>;
    createAsset(body: any, organizationId?: string): Promise<import("../entities/asset.entity").Asset[]>;
    listAssets(organizationId: string): Promise<import("../entities/asset.entity").Asset[]>;
    assignAsset(body: {
        assetId: string;
        employeeId: string;
    }, organizationId?: string): Promise<import("../entities/asset.entity").AssetAssignment>;
    returnAsset(id: string): Promise<import("../entities/asset.entity").AssetAssignment>;
}
