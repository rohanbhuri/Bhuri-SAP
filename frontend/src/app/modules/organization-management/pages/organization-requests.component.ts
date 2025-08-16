import { Component, inject, signal, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { OrganizationManagementService, OrganizationRequest } from '../organization-management.service';

@Component({
  selector: 'app-organization-requests',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
    TitleCasePipe,
  ],
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="requests()" class="requests-table">
        <ng-container matColumnDef="user">
          <th mat-header-cell *matHeaderCellDef>User</th>
          <td mat-cell *matCellDef="let request">
            {{ request.user?.firstName }} {{ request.user?.lastName }}
            <br>
            <small>{{ request.user?.email }}</small>
          </td>
        </ng-container>

        <ng-container matColumnDef="organization">
          <th mat-header-cell *matHeaderCellDef>Organization</th>
          <td mat-cell *matCellDef="let request">{{ request.organization?.name }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let request">
            <mat-chip 
              [class]="'status-' + request.status"
              [disabled]="true">
              {{ request.status | titlecase }}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="requestedAt">
          <th mat-header-cell *matHeaderCellDef>Requested</th>
          <td mat-cell *matCellDef="let request">{{ request.requestedAt | date:'short' }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let request">
            @if (request.status === 'pending') {
              <button 
                mat-raised-button 
                color="primary" 
                (click)="approveRequest(request)"
                class="action-btn">
                <mat-icon>check</mat-icon>
                Approve
              </button>
              <button 
                mat-button 
                color="warn" 
                (click)="rejectRequest(request)"
                class="action-btn">
                <mat-icon>close</mat-icon>
                Reject
              </button>
            }
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      @if (requests().length === 0) {
        <div class="empty-state">
          <mat-icon>group_add</mat-icon>
          <h3>No membership requests</h3>
          <p>Organization membership requests will appear here</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .table-container {
        background: var(--theme-surface);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .requests-table {
        width: 100%;
      }

      .mat-mdc-header-cell {
        font-weight: 600;
        color: var(--theme-on-surface);
      }

      .action-btn {
        margin-right: 8px;
      }

      .status-pending {
        background-color: #ff9800;
        color: white;
      }

      .status-approved {
        background-color: #4caf50;
        color: white;
      }

      .status-rejected {
        background-color: #f44336;
        color: white;
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .empty-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }

      .empty-state h3 {
        margin: 0 0 8px 0;
        font-weight: 500;
      }

      .empty-state p {
        margin: 0;
      }
    `,
  ],
})
export class OrganizationRequestsComponent implements OnInit {
  private orgService = inject(OrganizationManagementService);
  private snackBar = inject(MatSnackBar);

  requests = signal<OrganizationRequest[]>([]);
  displayedColumns = ['user', 'organization', 'status', 'requestedAt', 'actions'];

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.orgService.getOrganizationRequests().subscribe({
      next: (requests) => this.requests.set(requests),
      error: (error) => {
        console.error('Failed to load requests:', error);
        this.snackBar.open('Failed to load requests', 'Close', { duration: 3000 });
      }
    });
  }

  approveRequest(request: OrganizationRequest) {
    this.orgService.approveRequest(request.id).subscribe({
      next: () => {
        this.snackBar.open('Request approved successfully', 'Close', { duration: 3000 });
        this.loadRequests();
      },
      error: (error) => {
        console.error('Failed to approve request:', error);
        this.snackBar.open('Failed to approve request', 'Close', { duration: 3000 });
      }
    });
  }

  rejectRequest(request: OrganizationRequest) {
    if (confirm('Are you sure you want to reject this request?')) {
      this.orgService.rejectRequest(request.id).subscribe({
        next: () => {
          this.snackBar.open('Request rejected', 'Close', { duration: 3000 });
          this.loadRequests();
        },
        error: (error) => {
          console.error('Failed to reject request:', error);
          this.snackBar.open('Failed to reject request', 'Close', { duration: 3000 });
        }
      });
    }
  }
}