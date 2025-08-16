import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { HrManagementService, LeaveRequestDto } from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hr-leaves-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    DatePipe,
    NgIf,
  ],
  template: `
    <mat-card>
      <h2>Leaves</h2>

      <div class="new-leave">
        <mat-form-field appearance="outline">
          <mat-label>Start Date (YYYY-MM-DD)</mat-label>
          <input matInput [(ngModel)]="startDate" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>End Date (YYYY-MM-DD)</mat-label>
          <input matInput [(ngModel)]="endDate" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <select matNativeControl [(ngModel)]="leaveType">
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
            <option value="earned">Earned</option>
          </select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="reason">
          <mat-label>Reason</mat-label>
          <input matInput [(ngModel)]="reason" />
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="create()">
          <mat-icon>send</mat-icon>
          Submit
        </button>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <select matNativeControl [(ngModel)]="statusFilter">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </mat-form-field>
        <button mat-stroked-button (click)="load()">Apply</button>
      </div>

      <table mat-table [dataSource]="leaves()" class="full-width">
        <ng-container matColumnDef="period">
          <th mat-header-cell *matHeaderCellDef>Period</th>
          <td mat-cell *matCellDef="let l">
            {{ l.startDate | date }} - {{ l.endDate | date }}
          </td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let l">{{ l.leaveType }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let l">{{ l.status }}</td>
        </ng-container>
        <ng-container matColumnDef="actions" *ngIf="isManager">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let l">
            <button
              mat-button
              color="primary"
              (click)="approve(l)"
              [disabled]="l.status === 'approved'"
            >
              Approve
            </button>
            <button
              mat-button
              color="warn"
              (click)="reject(l)"
              [disabled]="l.status === 'rejected'"
            >
              Reject
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols"></tr>
      </table>
    </mat-card>
  `,
  styles: [
    `
      .new-leave {
        display: flex;
        gap: 12px;
        align-items: center;
        margin: 16px 0;
        flex-wrap: wrap;
      }
      .reason {
        min-width: 240px;
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
export class LeavesPageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  leaves = signal<LeaveRequestDto[]>([]);
  cols = this.auth.hasRole('hr_manager')
    ? ['period', 'type', 'status', 'actions']
    : ['period', 'type', 'status'];

  startDate = '';
  endDate = '';
  leaveType = 'casual';
  reason = '';
  statusFilter = '';

  get isManager(): boolean {
    return (
      this.auth.hasRole('hr_manager') ||
      this.auth.hasRole('hr_admin') ||
      this.auth.hasRole('super_admin')
    );
  }

  private get employeeId(): string {
    return this.auth.getCurrentUser()?.id || '';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.hr
      .listLeaves({
        employeeId: this.employeeId,
        status: this.statusFilter || undefined,
      })
      .subscribe((list) => this.leaves.set(list));
  }

  create(): void {
    if (!this.employeeId || !this.startDate || !this.endDate) return;
    this.hr
      .createLeave({
        employeeId: this.employeeId,
        startDate: this.startDate,
        endDate: this.endDate,
        leaveType: this.leaveType,
        reason: this.reason || undefined,
      })
      .subscribe(() => {
        this.startDate = '';
        this.endDate = '';
        this.reason = '';
        this.load();
      });
  }

  approve(l: LeaveRequestDto): void {
    if (!l._id) return;
    this.hr.setLeaveStatus(l._id, 'approved').subscribe(() => this.load());
  }

  reject(l: LeaveRequestDto): void {
    if (!l._id) return;
    this.hr.setLeaveStatus(l._id, 'rejected').subscribe(() => this.load());
  }
}
