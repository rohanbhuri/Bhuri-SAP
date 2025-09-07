import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  HrManagementService,
  AttendanceRecord,
  Employee,
} from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hr-attendance-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    FormsModule,
    DatePipe,
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Employee Attendance Records</h2>
      </div>

      <div class="filters-section">
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Search Employee</mat-label>
            <input matInput [(ngModel)]="searchTerm" placeholder="Name or ID" (input)="filterRecords()" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Select Employee</mat-label>
            <mat-select [(ngModel)]="employeeIdFilter" (selectionChange)="load()">
              <mat-option value="">All Employees</mat-option>
              <mat-option *ngFor="let emp of employees()" [value]="emp._id">
                {{emp.firstName}} {{emp.lastName}} ({{emp.employeeId}})
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>From Date</mat-label>
            <input matInput type="date" [(ngModel)]="from" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>To Date</mat-label>
            <input matInput type="date" [(ngModel)]="to" />
          </mat-form-field>
          <button mat-stroked-button (click)="setToday()">Today</button>
          <button mat-stroked-button (click)="clearFilters()">Clear</button>
          <button mat-raised-button color="primary" (click)="load()">Load</button>
        </div>
      </div>

      <div class="table-container" *ngIf="!loading()">
        <table mat-table [dataSource]="filteredRecords()" class="attendance-table">
          <ng-container matColumnDef="employee">
            <th mat-header-cell *matHeaderCellDef>Employee</th>
            <td mat-cell *matCellDef="let record">
              <div class="employee-cell">
                <strong>{{ getEmployeeName(record.employeeId) }}</strong>
                <span class="employee-id">{{ getEmployeeId(record.employeeId) }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let record">{{ record.date | date : 'mediumDate' }}</td>
          </ng-container>

          <ng-container matColumnDef="checkIn">
            <th mat-header-cell *matHeaderCellDef>Check In</th>
            <td mat-cell *matCellDef="let record">
              <div class="time-cell">
                <span class="time">{{ record.checkIn ? (record.checkIn | date : 'shortTime') : '-' }}</span>
                <span class="location" *ngIf="record.checkInLocation?.address">
                  <mat-icon>location_on</mat-icon>
                  {{ record.checkInLocation.address }}
                </span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="checkOut">
            <th mat-header-cell *matHeaderCellDef>Check Out</th>
            <td mat-cell *matCellDef="let record">
              <div class="time-cell">
                <span class="time">{{ record.checkOut ? (record.checkOut | date : 'shortTime') : '-' }}</span>
                <span class="location" *ngIf="record.checkOutLocation?.address">
                  <mat-icon>location_on</mat-icon>
                  {{ record.checkOutLocation.address }}
                </span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="hours">
            <th mat-header-cell *matHeaderCellDef>Hours</th>
            <td mat-cell *matCellDef="let record">
              <span class="hours-badge" [class.full-day]="(record.totalHours || 0) >= 8">
                {{ record.totalHours || 0 }}h
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
      
      <div class="loading-container" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Loading attendance records...</span>
      </div>
      
      <div class="no-data" *ngIf="records().length === 0 && !loading()">
        <mat-icon>schedule</mat-icon>
        <h3>No attendance records found</h3>
        <p>Try adjusting your filters</p>
      </div>
    </div>
  `,
  styles: [
    `
      .page-content { padding: 24px; min-height: 100vh; }
      .page-header { margin-bottom: 24px; }
      .page-header h2 { margin: 0; color: var(--theme-on-surface); font-size: 24px; font-weight: 500; }
      
      .filters-section {
        background: var(--theme-surface);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }
      
      .filters { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
      
      .table-container {
        background: var(--theme-surface);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }
      
      .attendance-table {
        width: 100%;
      }
      
      .employee-cell {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      
      .employee-id {
        font-size: 12px;
        opacity: 0.7;
      }
      
      .time-cell {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      
      .time {
        font-weight: 500;
      }
      
      .location {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        opacity: 0.6;
      }
      
      .location mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
      
      .hours-badge {
        background: color-mix(in srgb, var(--theme-accent) 20%, transparent);
        color: var(--theme-accent);
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 12px;
      }
      
      .hours-badge.full-day {
        background: color-mix(in srgb, var(--theme-primary) 20%, transparent);
        color: var(--theme-primary);
      }
      
      .loading-container { 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        gap: 16px; 
        padding: 40px; 
        color: var(--theme-on-surface);
        opacity: 0.7;
      }
      
      .no-data { 
        text-align: center; 
        padding: 60px 20px; 
        color: var(--theme-on-surface); 
        opacity: 0.6; 
      }
      
      .no-data mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; }
      .no-data h3 { margin: 16px 0 8px; }
      .no-data p { margin: 0; }
      
      @media (max-width: 768px) {
        .page-content { padding: 16px; }
        .filters { flex-direction: column; align-items: stretch; }
        .table-container { overflow-x: auto; }
      }
    `,
  ],
})
export class AttendancePageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  records = signal<AttendanceRecord[]>([]);
  filteredRecords = signal<AttendanceRecord[]>([]);
  employees = signal<Employee[]>([]);
  loading = signal(false);
  from = '';
  to = '';
  employeeIdFilter = '';
  searchTerm = '';
  
  displayedColumns = ['employee', 'date', 'checkIn', 'checkOut', 'hours'];

  ngOnInit(): void {
    this.setToday();
    this.loadEmployees();
    this.load();
  }
  
  loadEmployees(): void {
    const params: any = {};
    if (this.organizationId) {
      params.organizationId = this.organizationId;
    }
    this.hr.getEmployees(params).subscribe({
      next: (employees) => this.employees.set(employees),
      error: () => this.employees.set([])
    });
  }
  
  getEmployeeName(employeeId: string): string {
    const emp = this.employees().find(e => e._id === employeeId);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
  }
  
  getEmployeeId(employeeId: string): string {
    const emp = this.employees().find(e => e._id === employeeId);
    return emp ? emp.employeeId : '';
  }

  private get employeeId(): string {
    return this.auth.getCurrentUser()?.id || '';
  }
  private get organizationId(): string {
    return this.auth.getCurrentUser()?.organizationId || '';
  }

  load(): void {
    this.loading.set(true);
    
    const params: any = {};
    params.organizationId = this.organizationId;
    if (this.employeeIdFilter) params.employeeId = this.employeeIdFilter;
    if (this.from) params.from = this.from;
    if (this.to) params.to = this.to;
    
    this.hr.getAttendance(params).subscribe({
      next: (list) => {
        this.records.set(list);
        this.filterRecords();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  
  filterRecords(): void {
    let filtered = this.records();
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(record => {
        const emp = this.employees().find(e => e._id === record.employeeId);
        if (!emp) return false;
        return emp.firstName.toLowerCase().includes(term) ||
               emp.lastName.toLowerCase().includes(term) ||
               emp.employeeId.toLowerCase().includes(term);
      });
    }
    
    this.filteredRecords.set(filtered);
  }



  setToday(): void {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    this.from = iso;
    this.to = iso;
  }

  clearFilters(): void {
    this.from = '';
    this.to = '';
    this.employeeIdFilter = '';
    this.searchTerm = '';
    this.load();
  }
}
