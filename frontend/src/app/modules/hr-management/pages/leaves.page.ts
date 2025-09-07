import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HrManagementService, LeaveRequestDto } from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';
import { LeaveDialogComponent } from '../dialogs/leave-dialog.component';

@Component({
  selector: 'app-hr-leaves-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    FormsModule,
    DatePipe,
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Leave Management</h2>
        <button mat-raised-button color="primary" (click)="openLeaveDialog()">
          <mat-icon>send</mat-icon>
          Submit Leave Request
        </button>
      </div>



      <div class="filters-section">
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Filter by Status</mat-label>
            <select matNativeControl [(ngModel)]="statusFilter">
              <option value="">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </mat-form-field>
          <button mat-stroked-button (click)="load()">Apply Filter</button>
        </div>
      </div>

      <div class="cards-container">
        <div class="leave-card" *ngFor="let leave of displayedLeaves()">
          <mat-card class="leave-card-content">
            <div class="card-header">
              <div class="leave-info">
                <mat-icon>event</mat-icon>
                <div class="leave-details">
                  <span class="leave-period">{{ leave.startDate | date }} - {{ leave.endDate | date }}</span>
                  <span class="leave-duration">{{ getDuration(leave.startDate, leave.endDate) }} days</span>
                </div>
              </div>
              <mat-chip [color]="getStatusColor(leave.status || 'pending')" class="status-chip">
                {{ leave.status || 'pending' }}
              </mat-chip>
            </div>
            
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>category</mat-icon>
                  <div class="info-details">
                    <span class="info-label">Leave Type</span>
                    <span class="info-value">{{ leave.leaveType | titlecase }}</span>
                  </div>
                </div>
                <div class="info-item" *ngIf="leave.reason">
                  <mat-icon>notes</mat-icon>
                  <div class="info-details">
                    <span class="info-label">Reason</span>
                    <span class="info-value">{{ leave.reason }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card-actions" *ngIf="isManager && leave.status === 'pending'">
              <button mat-button color="primary" (click)="approve(leave)">
                <mat-icon>check</mat-icon>
                Approve
              </button>
              <button mat-button color="warn" (click)="reject(leave)">
                <mat-icon>close</mat-icon>
                Reject
              </button>
            </div>
          </mat-card>
        </div>
      </div>
      
      <div class="loading-container" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Loading more leave requests...</span>
      </div>
      
      <div class="no-data" *ngIf="leaves().length === 0 && !loading()">
        <mat-icon>beach_access</mat-icon>
        <h3>No leave requests found</h3>
        <p>Submit your first leave request above</p>
      </div>
    </div>
  `,
  styles: [
    `
      .page-content { padding: 24px; min-height: 100vh; }
      .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
      .page-header h2 { margin: 0; color: var(--theme-on-surface); font-size: 24px; font-weight: 500; }
      
      .leave-form-section {
        background: var(--theme-surface);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }
      
      .leave-form-section h3 { margin: 0 0 16px 0; color: var(--theme-on-surface); font-size: 18px; font-weight: 500; }
      .new-leave { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; align-items: end; }
      .reason { grid-column: span 2; }
      
      .filters-section {
        background: var(--theme-surface);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }
      
      .filters { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
      
      .cards-container { 
        display: grid; 
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      }
      
      .leave-card-content {
        transition: all 0.3s ease;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }
      
      .leave-card-content:hover {
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
      
      .leave-info { display: flex; align-items: center; gap: 12px; }
      .leave-info mat-icon { color: var(--theme-primary); }
      .leave-details { display: flex; flex-direction: column; gap: 2px; }
      .leave-period { font-weight: 500; }
      .leave-duration { font-size: 12px; opacity: 0.7; }
      
      .status-chip { font-size: 11px; height: 22px; }
      
      .card-body { padding: 0 16px 16px; }
      
      .info-grid { display: grid; gap: 12px; }
      
      .info-item { 
        display: flex; 
        align-items: center; 
        gap: 12px; 
        padding: 12px;
        background: color-mix(in srgb, var(--theme-primary) 5%, transparent);
        border-radius: 8px;
      }
      
      .info-item mat-icon { color: var(--theme-primary); flex-shrink: 0; }
      .info-details { display: flex; flex-direction: column; gap: 2px; }
      .info-label { font-size: 12px; opacity: 0.7; }
      .info-value { font-weight: 500; }
      
      .card-actions { 
        display: flex; 
        justify-content: flex-end; 
        gap: 8px; 
        padding: 0 16px 16px;
        border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
        margin-top: 16px;
        padding-top: 16px;
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
        .cards-container { grid-template-columns: 1fr; gap: 16px; }
        .page-header { flex-direction: column; gap: 16px; align-items: stretch; }
        .new-leave { grid-template-columns: 1fr; }
        .reason { grid-column: span 1; }
      }
    `,
  ],
})
export class LeavesPageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  leaves = signal<LeaveRequestDto[]>([]);
  displayedLeaves = signal<LeaveRequestDto[]>([]);
  loading = signal(false);
  statusFilter = '';
  
  private pageSize = 12;
  private currentPage = 0;
  private hasMoreData = true;

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
  private get organizationId(): string {
    return this.auth.getCurrentUser()?.organizationId || '';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.currentPage = 0;
    this.hasMoreData = true;
    this.displayedLeaves.set([]);
    
    this.hr.listLeaves({
      organizationId: this.organizationId,
      status: this.statusFilter || undefined,
    }).subscribe({
      next: (list) => {
        this.leaves.set(list);
        this.loadMoreLeaves();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  
  loadMoreLeaves(): void {
    const allLeaves = this.leaves();
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newLeaves = allLeaves.slice(startIndex, endIndex);
    
    if (newLeaves.length > 0) {
      this.displayedLeaves.set([...this.displayedLeaves(), ...newLeaves]);
      this.currentPage++;
      this.hasMoreData = endIndex < allLeaves.length;
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
        this.loadMoreLeaves();
      }
    }
  }

  openLeaveDialog(leave?: LeaveRequestDto): void {
    const dialogRef = this.dialog.open(LeaveDialogComponent, {
      width: '500px',
      data: leave || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const leaveData = {
        ...result,
        employeeId: this.employeeId
      };

      this.hr.createLeave(leaveData).subscribe({
        next: (created) => {
          if (created && created._id) {
            this.leaves.set([created, ...this.leaves()]);
            this.displayedLeaves.set([created, ...this.displayedLeaves()]);
          } else {
            this.load();
          }
          this.snackBar.open('Leave request submitted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error submitting leave request', 'Close', { duration: 3000 })
      });
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved': return 'primary';
      case 'rejected': return 'warn';
      case 'pending': return 'accent';
      default: return '';
    }
  }
  
  getDuration(startDate: string | Date, endDate: string | Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
}
