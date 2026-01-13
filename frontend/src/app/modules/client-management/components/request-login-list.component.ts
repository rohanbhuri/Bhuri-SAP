import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClientManagementService } from '../services/client-management.service';
import { CreateClientLoginDialogComponent } from './create-client-login-dialog.component';

@Component({
  selector: 'app-request-login-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="requests-container">
      <div class="header-section">
        <h2 class="section-title">Request Login Credentials</h2>
      </div>

      <div class="filters-section">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Date Range</mat-label>
          <mat-date-range-input [rangePicker]="picker">
            <input matStartDate [formControl]="startDate" placeholder="Start date">
            <input matEndDate [formControl]="endDate" placeholder="End date">
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Search By Name / Email / Mobile</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Search here...">
        </mat-form-field>

        <button mat-raised-button color="primary" (click)="applyFilters()" class="search-btn">
          Search
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="filteredRequests" class="data-table">
          <ng-container matColumnDef="srNo">
            <th mat-header-cell *matHeaderCellDef>SR NO</th>
            <td mat-cell *matCellDef="let request; let i = index">{{ i + 1 }}</td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>DATE</th>
            <td mat-cell *matCellDef="let request">{{ request.createdAt | date:'dd MMM, yyyy' }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>NAME</th>
            <td mat-cell *matCellDef="let request">{{ request.contactPerson }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>EMAIL</th>
            <td mat-cell *matCellDef="let request">{{ request.email }}</td>
          </ng-container>

          <ng-container matColumnDef="mobile">
            <th mat-header-cell *matHeaderCellDef>MOBILE</th>
            <td mat-cell *matCellDef="let request">{{ request.phone }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>STATUS</th>
            <td mat-cell *matCellDef="let request">
              <mat-chip [class]="getStatusClass(request.status)">{{ request.status }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>ACTIONS</th>
            <td mat-cell *matCellDef="let request">
              <div class="action-buttons">
                <button 
                  *ngIf="request.status === 'PENDING'"
                  mat-stroked-button 
                  color="primary"
                  (click)="approveRequest(request)"
                  class="action-btn">
                  Approve
                </button>
                <button 
                  *ngIf="request.status === 'PENDING'"
                  mat-stroked-button 
                  color="warn"
                  (click)="rejectRequest(request)"
                  class="action-btn">
                  Reject
                </button>
                <button 
                  *ngIf="request.status === 'APPROVED'"
                  mat-stroked-button 
                  color="primary"
                  (click)="openCreateLoginDialog(request)"
                  class="action-btn">
                  Create Login
                </button>
                <span *ngIf="request.status === 'CONVERTED'" class="status-text">Login Created</span>
                <span *ngIf="request.status === 'REJECTED'" class="status-text">Rejected</span>
                <button 
                  mat-icon-button 
                  color="warn"
                  (click)="deleteRequest(request)"
                  class="delete-btn"
                  matTooltip="Delete Request">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .requests-container {
      padding: 0;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      align-items: flex-start;
    }

    .filter-field {
      flex: 1;
    }

    .search-btn {
      height: 56px;
      margin-top: 0;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .data-table {
      width: 100%;
    }

    ::ng-deep .mat-mdc-header-cell {
      background-color: #f3f4f6;
      color: #374151;
      font-weight: 600;
      font-size: 0.875rem;
      padding: 16px;
    }

    ::ng-deep .mat-mdc-cell {
      padding: 16px;
      color: #1f2937;
    }

    ::ng-deep .mat-mdc-row:hover {
      background-color: #f9fafb;
    }

    mat-chip {
      font-size: 0.75rem;
      min-height: 24px;
      padding: 4px 12px;
    }

    mat-chip.status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }

    mat-chip.status-converted {
      background-color: #d1fae5;
      color: #065f46;
    }

    mat-chip.status-approved {
      background-color: #dbeafe;
      color: #1e40af;
    }

    mat-chip.status-rejected {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .action-btn {
      min-width: 80px;
      font-size: 0.75rem;
    }

    .delete-btn {
      margin-left: auto;
    }

    .status-text {
      font-size: 0.75rem;
      color: #6b7280;
      font-style: italic;
    }
  `]
})
export class RequestLoginListComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  displayedColumns = ['srNo', 'date', 'name', 'email', 'mobile', 'status', 'actions'];
  
  startDate = new FormControl();
  endDate = new FormControl();
  searchControl = new FormControl('');

  constructor(
    private clientService: ClientManagementService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.clientService.getAllClientRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.filteredRequests = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load requests', err)
    });
  }

  applyFilters() {
    let filtered = [...this.requests];

    if (this.startDate.value && this.endDate.value) {
      filtered = filtered.filter(req => {
        const reqDate = new Date(req.createdAt);
        return reqDate >= this.startDate.value && reqDate <= this.endDate.value;
      });
    }

    const search = this.searchControl.value?.toLowerCase() || '';
    if (search) {
      filtered = filtered.filter(req =>
        req.contactPerson?.toLowerCase().includes(search) ||
        req.email?.toLowerCase().includes(search) ||
        req.phone?.includes(search)
      );
    }

    this.filteredRequests = filtered;
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'PENDING': 'status-pending',
      'APPROVED': 'status-approved',
      'REJECTED': 'status-rejected',
      'CONVERTED': 'status-converted'
    };
    return classes[status] || '';
  }

  openCreateLoginDialog(request: any) {
    const dialogRef = this.dialog.open(CreateClientLoginDialogComponent, {
      width: '800px',
      data: request,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRequests();
      }
    });
  }

  approveRequest(request: any) {
    if (confirm('Are you sure you want to approve this request?')) {
      this.clientService.updateClientRequest(request._id, { status: 'APPROVED' }).subscribe({
        next: () => {
          this.loadRequests();
        },
        error: (err) => console.error('Failed to approve request', err)
      });
    }
  }

  rejectRequest(request: any) {
    if (confirm('Are you sure you want to reject this request?')) {
      this.clientService.updateClientRequest(request._id, { status: 'REJECTED' }).subscribe({
        next: () => {
          this.loadRequests();
        },
        error: (err) => console.error('Failed to reject request', err)
      });
    }
  }

  deleteRequest(request: any) {
    if (confirm('Are you sure you want to permanently delete this request? This action cannot be undone.')) {
      this.clientService.deleteClientRequest(request._id).subscribe({
        next: () => {
          this.loadRequests();
        },
        error: (err) => console.error('Failed to delete request', err)
      });
    }
  }
}
