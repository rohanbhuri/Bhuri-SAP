import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import {
  HrManagementService,
  AttendanceRecord,
} from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hr-attendance-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DatePipe,
    NgIf,
  ],
  template: `
    <mat-card>
      <h2>Attendance</h2>

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

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>From (YYYY-MM-DD)</mat-label>
          <input matInput [(ngModel)]="from" placeholder="2025-08-01" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>To (YYYY-MM-DD)</mat-label>
          <input matInput [(ngModel)]="to" placeholder="2025-08-31" />
        </mat-form-field>
        <button mat-stroked-button (click)="setToday()">Today</button>
        <button mat-stroked-button (click)="clearRange()">Clear</button>
        <button mat-raised-button color="primary" (click)="load()">Load</button>
      </div>

      <div class="admin-filter" *ngIf="isAdmin">
        <mat-form-field appearance="outline">
          <mat-label>Employee ID (admin)</mat-label>
          <input matInput [(ngModel)]="employeeIdFilter" placeholder="EMP001" />
        </mat-form-field>
        <button mat-stroked-button (click)="load()">Apply</button>
      </div>

      <table mat-table [dataSource]="records()" class="full-width">
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let r">
            {{ r.date | date : 'mediumDate' }}
          </td>
        </ng-container>
        <ng-container matColumnDef="checkIn">
          <th mat-header-cell *matHeaderCellDef>Check In</th>
          <td mat-cell *matCellDef="let r">
            {{ r.checkIn ? (r.checkIn | date : 'shortTime') : '-' }}
          </td>
        </ng-container>
        <ng-container matColumnDef="checkOut">
          <th mat-header-cell *matHeaderCellDef>Check Out</th>
          <td mat-cell *matCellDef="let r">
            {{ r.checkOut ? (r.checkOut | date : 'shortTime') : '-' }}
          </td>
        </ng-container>
        <ng-container matColumnDef="totalHours">
          <th mat-header-cell *matHeaderCellDef>Total Hours</th>
          <td mat-cell *matCellDef="let r">{{ r.totalHours ?? '-' }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols"></tr>
      </table>
    </mat-card>
  `,
  styles: [
    `
      .actions {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
      }
      .filters,
      .admin-filter {
        display: flex;
        gap: 12px;
        align-items: center;
        margin: 16px 0;
        flex-wrap: wrap;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class AttendancePageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  records = signal<AttendanceRecord[]>([]);
  cols = ['date', 'checkIn', 'checkOut', 'totalHours'];
  from = '';
  to = '';
  employeeIdFilter = '';

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

  load(): void {
    const params: any = {};
    const id =
      this.isAdmin && this.employeeIdFilter
        ? this.employeeIdFilter
        : this.employeeId;
    if (id) params.employeeId = id;
    if (this.from) params.from = this.from;
    if (this.to) params.to = this.to;
    this.hr.getAttendance(params).subscribe((list) => this.records.set(list));
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
