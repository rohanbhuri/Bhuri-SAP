import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  HrManagementService,
  AttendanceRecord,
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
    FormsModule,
    DatePipe,
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Attendance Management</h2>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="checkIn()">
            <mat-icon>login</mat-icon>
            Check In
          </button>
          <button mat-raised-button color="accent" (click)="checkOut()">
            <mat-icon>logout</mat-icon>
            Check Out
          </button>
        </div>
      </div>

      <div class="filters-section">
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>From Date</mat-label>
            <input matInput [(ngModel)]="from" placeholder="2025-08-01" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>To Date</mat-label>
            <input matInput [(ngModel)]="to" placeholder="2025-08-31" />
          </mat-form-field>
          <button mat-stroked-button (click)="setToday()">Today</button>
          <button mat-stroked-button (click)="clearRange()">Clear</button>
          <button mat-raised-button color="primary" (click)="load()">Load</button>
        </div>

        <div class="admin-filter" *ngIf="isAdmin">
          <mat-form-field appearance="outline">
            <mat-label>Employee ID (Admin)</mat-label>
            <input matInput [(ngModel)]="employeeIdFilter" placeholder="EMP001" />
          </mat-form-field>
          <button mat-stroked-button (click)="load()">Apply</button>
        </div>
      </div>

      <div class="cards-container">
        <div class="attendance-card" *ngFor="let record of displayedRecords()">
          <mat-card class="attendance-card-content">
            <div class="card-header">
              <div class="date-info">
                <mat-icon>calendar_today</mat-icon>
                <span class="date-text">{{ record.date | date : 'mediumDate' }}</span>
              </div>
              <div class="hours-badge" [class.full-day]="(record.totalHours || 0) >= 8">
                {{ record.totalHours || 0 }}h
              </div>
            </div>
            
            <div class="card-body">
              <div class="time-grid">
                <div class="time-item">
                  <mat-icon>login</mat-icon>
                  <div class="time-details">
                    <span class="time-label">Check In</span>
                    <span class="time-value">{{ record.checkIn ? (record.checkIn | date : 'shortTime') : 'Not checked in' }}</span>
                  </div>
                </div>
                <div class="time-item">
                  <mat-icon>logout</mat-icon>
                  <div class="time-details">
                    <span class="time-label">Check Out</span>
                    <span class="time-value">{{ record.checkOut ? (record.checkOut | date : 'shortTime') : 'Not checked out' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
      
      <div class="loading-container" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Loading more records...</span>
      </div>
      
      <div class="no-data" *ngIf="records().length === 0 && !loading()">
        <mat-icon>schedule</mat-icon>
        <h3>No attendance records found</h3>
        <p>Check in to start tracking your attendance</p>
      </div>
    </div>
  `,
  styles: [
    `
      .page-content { padding: 24px; min-height: 100vh; }
      .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
      .page-header h2 { margin: 0; color: var(--theme-on-surface); font-size: 24px; font-weight: 500; }
      .actions { display: flex; gap: 12px; }
      
      .filters-section {
        background: var(--theme-surface);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }
      
      .filters, .admin-filter { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
      .admin-filter { margin-top: 16px; padding-top: 16px; border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent); }
      
      .cards-container { 
        display: grid; 
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      }
      
      .attendance-card-content {
        transition: all 0.3s ease;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }
      
      .attendance-card-content:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
      }
      
      .card-header { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 16px; 
        padding: 16px 16px 0;
      }
      
      .date-info { display: flex; align-items: center; gap: 8px; font-weight: 500; }
      .date-info mat-icon { color: var(--theme-primary); }
      
      .hours-badge {
        background: color-mix(in srgb, var(--theme-accent) 20%, transparent);
        color: var(--theme-accent);
        padding: 4px 12px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
      }
      
      .hours-badge.full-day {
        background: color-mix(in srgb, var(--theme-primary) 20%, transparent);
        color: var(--theme-primary);
      }
      
      .card-body { padding: 0 16px 16px; }
      
      .time-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      
      .time-item { 
        display: flex; 
        align-items: center; 
        gap: 12px; 
        padding: 12px;
        background: color-mix(in srgb, var(--theme-primary) 5%, transparent);
        border-radius: 8px;
      }
      
      .time-item mat-icon { color: var(--theme-primary); flex-shrink: 0; }
      .time-details { display: flex; flex-direction: column; gap: 2px; }
      .time-label { font-size: 12px; opacity: 0.7; }
      .time-value { font-weight: 500; }
      
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
        .cards-container { grid-template-columns: 1fr; gap: 16px; }
        .page-header { flex-direction: column; gap: 16px; align-items: stretch; }
        .time-grid { grid-template-columns: 1fr; }
        .actions { justify-content: center; }
      }
    `,
  ],
})
export class AttendancePageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  records = signal<AttendanceRecord[]>([]);
  displayedRecords = signal<AttendanceRecord[]>([]);
  loading = signal(false);
  from = '';
  to = '';
  employeeIdFilter = '';
  
  private pageSize = 12;
  private currentPage = 0;
  private hasMoreData = true;

  get isAdmin(): boolean {
    return this.auth.hasRole('hr_admin') || this.auth.hasRole('super_admin');
  }

  ngOnInit(): void {
    this.setToday();
    this.load();
  }

  private get employeeId(): string {
    return this.auth.getCurrentUser()?.id || '';
  }
  private get organizationId(): string {
    return this.auth.getCurrentUser()?.organizationId || '';
  }

  load(): void {
    this.loading.set(true);
    this.currentPage = 0;
    this.hasMoreData = true;
    this.displayedRecords.set([]);
    
    const params: any = {};
    params.organizationId = this.organizationId;
    const id = this.isAdmin && this.employeeIdFilter ? this.employeeIdFilter : this.employeeId;
    if (id) params.employeeId = id;
    if (this.from) params.from = this.from;
    if (this.to) params.to = this.to;
    
    this.hr.getAttendance(params).subscribe({
      next: (list) => {
        this.records.set(list);
        this.loadMoreRecords();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  
  loadMoreRecords(): void {
    const allRecords = this.records();
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newRecords = allRecords.slice(startIndex, endIndex);
    
    if (newRecords.length > 0) {
      this.displayedRecords.set([...this.displayedRecords(), ...newRecords]);
      this.currentPage++;
      this.hasMoreData = endIndex < allRecords.length;
    } else {
      this.hasMoreData = false;
    }
  }
  
  @HostListener('window:scroll')
  onScroll(): void {
    if (this.hasMoreData && !this.loading()) {
      const threshold = 200;
      const position = window.pageYOffset + window.innerHeight;
      const height = document.documentElement.scrollHeight;
      
      if (position > height - threshold) {
        this.loadMoreRecords();
      }
    }
  }

  checkIn(): void {
    const id = this.employeeId;
    if (!id) return;
    this.hr.attendanceCheckIn(id).subscribe(() => this.load());
  }

  checkOut(): void {
    const id = this.employeeId;
    if (!id) return;
    this.hr.attendanceCheckOut(id).subscribe(() => this.load());
  }

  setToday(): void {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    this.from = iso;
    this.to = iso;
  }

  clearRange(): void {
    this.from = '';
    this.to = '';
  }
}
