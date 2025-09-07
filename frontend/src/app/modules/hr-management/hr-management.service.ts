import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from '../../services/brand-config.service';

export interface Employee {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  status: string;
  organizationId: string;
  managerId?: string;
}

export interface Department {
  _id: string;
  name: string;
  description: string;
  managerId: string;
  employeeCount: number;
}

export interface HrStats {
  total: number;
  active: number;
  departments: number;
  averageSalary: number;
  newHires: number;
}

// Attendance & Leaves
export interface AttendanceRecord {
  _id?: string;
  employeeId: string;
  date: string | Date;
  checkIn?: string | Date;
  checkOut?: string | Date;
  totalHours?: number;
}

export interface LeaveRequestDto {
  _id?: string;
  employeeId: string;
  startDate: string | Date;
  endDate: string | Date;
  leaveType: string;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason?: string;
}

// Payroll
export interface SalaryComponent {
  name: string;
  code?: string;
  amount: number;
  taxable?: boolean;
}
export interface SalaryStructureDto {
  employeeId: string;
  earnings?: SalaryComponent[];
  deductions?: SalaryComponent[];
  reimbursements?: SalaryComponent[];
}
export interface PayrollItemDto {
  employeeId: string;
  gross: number;
  deductions: number;
  net: number;
  components: {
    name: string;
    amount: number;
    type: 'earning' | 'deduction' | 'reimbursement';
  }[];
}
export interface PayrollRunDto {
  _id: string;
  month: number;
  year: number;
  status: string;
  items: PayrollItemDto[];
}

// Performance
export interface GoalDto {
  _id?: string;
  employeeId: string;
  title: string;
  description?: string;
  progress?: number;
}
export interface FeedbackDto {
  _id?: string;
  reviewCycleId: string;
  employeeId: string;
  reviewerId: string;
  type: 'peer' | 'manager' | 'self';
  rating: number;
  comments?: string;
}

// Compliance
export interface ComplianceItemDto {
  _id?: string;
  name: string;
  description?: string;
  active?: boolean;
}
export interface ComplianceEventDto {
  _id?: string;
  itemId: string;
  dueDate: string | Date;
  completedAt?: string | Date;
  status?: string;
  notes?: string;
}

// Documents
export interface DocumentRecordDto {
  _id?: string;
  name: string;
  fileId: string;
  employeeId: string;
  type?: string;
}

// Assets
export interface AssetDto {
  _id?: string;
  name: string;
  serialNumber?: string;
  category?: string;
}
export interface AssetAssignmentDto {
  _id?: string;
  assetId: string;
  employeeId: string;
  assignedAt?: string | Date;
  returnedAt?: string | Date;
}

@Injectable({ providedIn: 'root' })
export class HrManagementService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);

  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  // Stats
  getStats(): Observable<HrStats> {
    return this.http
      .get<HrStats>(`${this.apiUrl}/hr-management/stats`)
      .pipe(
        catchError(() =>
          of({
            total: 0,
            active: 0,
            departments: 0,
            averageSalary: 0,
            newHires: 0,
          })
        )
      );
  }

  // Employees & Departments
  getEmployees(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(`${this.apiUrl}/hr-management/employees`)
      .pipe(catchError(() => of([])));
  }

  getDepartments(): Observable<Department[]> {
    return this.http
      .get<Department[]>(`${this.apiUrl}/hr-management/departments`)
      .pipe(catchError(() => of([])));
  }

  createEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(
      `${this.apiUrl}/hr-management/employees`,
      employee
    );
  }

  updateEmployee(
    id: string,
    employee: Partial<Employee>
  ): Observable<Employee> {
    return this.http.put<Employee>(
      `${this.apiUrl}/hr-management/employees/${id}`,
      employee
    );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/hr-management/employees/${id}`);
  }

  createDepartment(department: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(
      `${this.apiUrl}/hr-management/departments`,
      department
    );
  }

  // Attendance & Leaves
  attendanceCheckIn(employeeId: string): Observable<AttendanceRecord> {
    return this.http.post<AttendanceRecord>(
      `${this.apiUrl}/hr-management/attendance/check-in`,
      { employeeId }
    );
  }

  attendanceCheckOut(employeeId: string): Observable<AttendanceRecord | null> {
    return this.http.post<AttendanceRecord | null>(
      `${this.apiUrl}/hr-management/attendance/check-out`,
      { employeeId }
    );
  }

  getAttendance(
    params: { employeeId?: string; organizationId?: string; from?: string; to?: string } = {}
  ): Observable<AttendanceRecord[]> {
    const q = new URLSearchParams(params as any).toString();
    return this.http
      .get<AttendanceRecord[]>(
        `${this.apiUrl}/hr-management/attendance${q ? `?${q}` : ''}`
      )
      .pipe(catchError(() => of([])));
  }

  createLeave(payload: LeaveRequestDto): Observable<LeaveRequestDto> {
    return this.http.post<LeaveRequestDto>(
      `${this.apiUrl}/hr-management/leaves`,
      payload
    );
  }

  setLeaveStatus(
    id: string,
    status: 'approved' | 'rejected'
  ): Observable<LeaveRequestDto> {
    return this.http.patch<LeaveRequestDto>(
      `${this.apiUrl}/hr-management/leaves/${id}/status`,
      { status }
    );
  }

  listLeaves(
    params: { employeeId?: string; organizationId?: string; status?: string } = {}
  ): Observable<LeaveRequestDto[]> {
    const q = new URLSearchParams(params as any).toString();
    return this.http
      .get<LeaveRequestDto[]>(
        `${this.apiUrl}/hr-management/leaves${q ? `?${q}` : ''}`
      )
      .pipe(catchError(() => of([])));
  }

  createShift(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/hr-management/shifts`, payload);
  }
  listShifts(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/hr-management/shifts`)
      .pipe(catchError(() => of([])));
  }

  addHoliday(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/hr-management/holidays`, payload);
  }
  listHolidays(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/hr-management/holidays`)
      .pipe(catchError(() => of([])));
  }

  // Payroll
  upsertSalaryStructure(payload: SalaryStructureDto): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/hr-management/salary-structures`,
      payload
    );
  }

  runPayroll(
    organizationId: string,
    month: number,
    year: number
  ): Observable<PayrollRunDto> {
    return this.http.post<PayrollRunDto>(
      `${this.apiUrl}/hr-management/payroll/run`,
      { organizationId, month, year }
    );
  }

  listPayrollRuns(organizationId: string): Observable<PayrollRunDto[]> {
    const q = new URLSearchParams({ organizationId }).toString();
    return this.http
      .get<PayrollRunDto[]>(`${this.apiUrl}/hr-management/payroll/runs?${q}`)
      .pipe(catchError(() => of([])));
  }

  getPayrollRun(id: string): Observable<PayrollRunDto> {
    return this.http.get<PayrollRunDto>(
      `${this.apiUrl}/hr-management/payroll/runs/${id}`
    );
  }

  // Performance
  createGoal(payload: GoalDto): Observable<GoalDto> {
    return this.http.post<GoalDto>(
      `${this.apiUrl}/hr-management/goals`,
      payload
    );
  }
  updateGoal(id: string, payload: Partial<GoalDto>): Observable<GoalDto> {
    return this.http.patch<GoalDto>(
      `${this.apiUrl}/hr-management/goals/${id}`,
      payload
    );
  }
  listGoals(params: { employeeId?: string; organizationId?: string } = {}): Observable<GoalDto[]> {
    const q = new URLSearchParams(params as any).toString();
    return this.http
      .get<GoalDto[]>(`${this.apiUrl}/hr-management/goals${q ? `?${q}` : ''}`)
      .pipe(catchError(() => of([])));
  }
  createReviewCycle(payload: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/hr-management/review-cycles`,
      payload
    );
  }
  submitFeedback(payload: FeedbackDto): Observable<FeedbackDto> {
    return this.http.post<FeedbackDto>(
      `${this.apiUrl}/hr-management/feedback`,
      payload
    );
  }
  performanceAnalytics(
    organizationId: string
  ): Observable<{ totalFeedback: number; averageRating: number }> {
    const q = new URLSearchParams({ organizationId }).toString();
    return this.http.get<{ totalFeedback: number; averageRating: number }>(
      `${this.apiUrl}/hr-management/performance/analytics?${q}`
    );
  }

  // Compliance
  createComplianceItem(
    payload: ComplianceItemDto
  ): Observable<ComplianceItemDto> {
    return this.http.post<ComplianceItemDto>(
      `${this.apiUrl}/hr-management/compliance/items`,
      payload
    );
  }
  listComplianceItems(organizationId: string): Observable<ComplianceItemDto[]> {
    const q = new URLSearchParams({ organizationId }).toString();
    return this.http
      .get<ComplianceItemDto[]>(
        `${this.apiUrl}/hr-management/compliance/items?${q}`
      )
      .pipe(catchError(() => of([])));
  }
  scheduleComplianceEvent(
    payload: ComplianceEventDto
  ): Observable<ComplianceEventDto> {
    return this.http.post<ComplianceEventDto>(
      `${this.apiUrl}/hr-management/compliance/events`,
      payload
    );
  }
  markComplianceCompleted(id: string): Observable<ComplianceEventDto> {
    return this.http.patch<ComplianceEventDto>(
      `${this.apiUrl}/hr-management/compliance/events/${id}/complete`,
      {}
    );
  }
  complianceAlerts(
    organizationId: string
  ): Observable<{
    upcoming: ComplianceEventDto[];
    overdue: ComplianceEventDto[];
  }> {
    const q = new URLSearchParams({ organizationId }).toString();
    return this.http.get<{
      upcoming: ComplianceEventDto[];
      overdue: ComplianceEventDto[];
    }>(`${this.apiUrl}/hr-management/compliance/alerts?${q}`);
  }

  // Documents
  createDocumentRecord(
    payload: DocumentRecordDto
  ): Observable<DocumentRecordDto> {
    return this.http.post<DocumentRecordDto>(
      `${this.apiUrl}/hr-management/documents`,
      payload
    );
  }

  listDocumentRecords(
    params: { employeeId?: string; organizationId?: string } = {}
  ): Observable<DocumentRecordDto[]> {
    const q = new URLSearchParams(params as any).toString();
    return this.http
      .get<DocumentRecordDto[]>(
        `${this.apiUrl}/hr-management/documents${q ? `?${q}` : ''}`
      )
      .pipe(catchError(() => of([])));
  }

  // Assets
  createAsset(payload: AssetDto): Observable<AssetDto> {
    return this.http.post<AssetDto>(
      `${this.apiUrl}/hr-management/assets`,
      payload
    );
  }
  listAssets(organizationId: string): Observable<AssetDto[]> {
    const q = new URLSearchParams({ organizationId }).toString();
    return this.http
      .get<AssetDto[]>(`${this.apiUrl}/hr-management/assets?${q}`)
      .pipe(catchError(() => of([])));
  }
  assignAsset(
    assetId: string,
    employeeId: string
  ): Observable<AssetAssignmentDto> {
    return this.http.post<AssetAssignmentDto>(
      `${this.apiUrl}/hr-management/assets/assign`,
      { assetId, employeeId }
    );
  }
  returnAsset(assignmentId: string): Observable<AssetAssignmentDto> {
    return this.http.patch<AssetAssignmentDto>(
      `${this.apiUrl}/hr-management/assets/assignments/${assignmentId}/return`,
      {}
    );
  }
}
