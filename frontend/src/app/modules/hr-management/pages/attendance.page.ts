import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DatePipe,
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
        <button mat-stroked-button (click)="load()">Load</button>
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
      .filters {
        display: flex;
        gap: 12px;
        align-items: center;
        margin: 16px 0;
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

  ngOnInit(): void {
    this.load();
  }

  private get employeeId(): string {
    return this.auth.getCurrentUser()?.id || '';
  }

  load(): void {
    const params: any = { employeeId: this.employeeId };
    if (this.from) params.from = this.from;
    if (this.to) params.to = this.to;
    this.hr.getAttendance(params).subscribe((list) => this.records.set(list));
  }

  checkIn(): void {
    if (!this.employeeId) return;
    this.hr.attendanceCheckIn(this.employeeId).subscribe(() => this.load());
  }

  checkOut(): void {
    if (!this.employeeId) return;
    this.hr.attendanceCheckOut(this.employeeId).subscribe(() => this.load());
  }
}
