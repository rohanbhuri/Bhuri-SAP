import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from '../../services/brand-config.service';

export interface TimesheetEntry {
  _id: string;
  employeeId: string;
  projectId: string;
  taskId?: string;
  date: Date;
  startTime: string;
  endTime: string;
  totalHours: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  billable: boolean;
  hourlyRate?: number;
}

export interface TimesheetSummary {
  employeeId: string;
  weekStartDate: Date;
  totalHours: number;
  billableHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  entries: TimesheetEntry[];
}

export interface ProjectTimeReport {
  projectId: string;
  projectName: string;
  totalHours: number;
  billableHours: number;
  totalCost: number;
  employeeHours: {
    employeeId: string;
    employeeName: string;
    hours: number;
    cost: number;
  }[];
}

export interface TimesheetStats {
  totalHours: number;
  billableHours: number;
  totalProjects: number;
  pendingApprovals: number;
  thisWeekHours: number;
  totalRevenue: number;
}

@Injectable({ providedIn: 'root' })
export class ProjectTimesheetService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);

  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getStats(): Observable<TimesheetStats> {
    return this.http
      .get<TimesheetStats>(`${this.apiUrl}/project-timesheet/stats`)
      .pipe(
        catchError(() =>
          of({
            totalHours: 0,
            billableHours: 0,
            totalProjects: 0,
            pendingApprovals: 0,
            thisWeekHours: 0,
            totalRevenue: 0,
          })
        )
      );
  }

  getTimesheetEntries(params?: { employeeId?: string; projectId?: string; startDate?: string; endDate?: string }): Observable<TimesheetEntry[]> {
    let url = `${this.apiUrl}/project-timesheet/entries`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
      if (searchParams.toString()) url += `?${searchParams.toString()}`;
    }
    
    return this.http
      .get<TimesheetEntry[]>(url)
      .pipe(catchError(() => of([])));
  }

  getTimesheetSummaries(params?: { employeeId?: string; weekStartDate?: string }): Observable<TimesheetSummary[]> {
    let url = `${this.apiUrl}/project-timesheet/summaries`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
      if (searchParams.toString()) url += `?${searchParams.toString()}`;
    }
    
    return this.http
      .get<TimesheetSummary[]>(url)
      .pipe(catchError(() => of([])));
  }

  getProjectTimeReports(params?: { projectId?: string; startDate?: string; endDate?: string }): Observable<ProjectTimeReport[]> {
    let url = `${this.apiUrl}/project-timesheet/reports`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
      if (searchParams.toString()) url += `?${searchParams.toString()}`;
    }
    
    return this.http
      .get<ProjectTimeReport[]>(url)
      .pipe(catchError(() => of([])));
  }

  createTimesheetEntry(entry: Partial<TimesheetEntry>): Observable<TimesheetEntry> {
    return this.http.post<TimesheetEntry>(`${this.apiUrl}/project-timesheet/entries`, entry);
  }

  updateTimesheetEntry(id: string, entry: Partial<TimesheetEntry>): Observable<TimesheetEntry> {
    return this.http.put<TimesheetEntry>(`${this.apiUrl}/project-timesheet/entries/${id}`, entry);
  }

  deleteTimesheetEntry(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/project-timesheet/entries/${id}`);
  }

  submitTimesheet(summaryId: string): Observable<TimesheetSummary> {
    return this.http.patch<TimesheetSummary>(`${this.apiUrl}/project-timesheet/summaries/${summaryId}/submit`, {});
  }

  approveTimesheet(summaryId: string): Observable<TimesheetSummary> {
    return this.http.patch<TimesheetSummary>(`${this.apiUrl}/project-timesheet/summaries/${summaryId}/approve`, {});
  }

  rejectTimesheet(summaryId: string, reason: string): Observable<TimesheetSummary> {
    return this.http.patch<TimesheetSummary>(`${this.apiUrl}/project-timesheet/summaries/${summaryId}/reject`, { reason });
  }

  getMockData(): TimesheetEntry[] {
    const today = new Date();
    const mockData: TimesheetEntry[] = [];
    
    const tasks = [
      'Frontend Development',
      'Backend API Work', 
      'Database Design',
      'Testing & QA',
      'Code Review',
      'Client Meeting',
      'Documentation',
      'Bug Fixes',
      'UI/UX Design',
      'Performance Optimization'
    ];
    
    const statuses: ('draft' | 'submitted' | 'approved' | 'rejected')[] = ['draft', 'submitted', 'approved', 'rejected'];
    
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      mockData.push({
        _id: `mock-${i}`,
        employeeId: 'emp-1',
        projectId: 'proj-1',
        taskId: `task-${i}`,
        date,
        startTime: '09:00',
        endTime: `${9 + Math.floor(Math.random() * 8)}:00`,
        totalHours: Math.floor(Math.random() * 8) + 1,
        description: tasks[Math.floor(Math.random() * tasks.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        billable: Math.random() > 0.3,
        hourlyRate: 50 + Math.floor(Math.random() * 50)
      });
    }
    
    return mockData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}