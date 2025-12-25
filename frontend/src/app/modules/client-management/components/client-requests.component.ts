import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientManagementService } from '../services/client-management.service';
import { ConvertClientDialogComponent } from './convert-client-dialog.component';

@Component({
  selector: 'app-client-requests',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatDialogModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Client Requests</h1>
      </div>

      <div class="bg-white rounded-lg shadow">
        <table mat-table [dataSource]="requests" class="w-full">
          <ng-container matColumnDef="companyName">
            <th mat-header-cell *matHeaderCellDef>Company</th>
            <td mat-cell *matCellDef="let request">{{ request.companyName }}</td>
          </ng-container>

          <ng-container matColumnDef="contactPerson">
            <th mat-header-cell *matHeaderCellDef>Contact Person</th>
            <td mat-cell *matCellDef="let request">{{ request.contactPerson }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let request">{{ request.email }}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Phone</th>
            <td mat-cell *matCellDef="let request">{{ request.phone }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let request">
              <mat-chip [class]="getStatusClass(request.status)">
                {{ request.status }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let request">{{ request.createdAt | date:'short' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let request">
              <button mat-icon-button [routerLink]="['/client-management/requests', request._id]">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button *ngIf="request.status === 'PENDING'" (click)="convertToClient(request)">
                <mat-icon>person_add</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `
})
export class ClientRequestsComponent implements OnInit {
  requests: any[] = [];
  displayedColumns = ['companyName', 'contactPerson', 'email', 'phone', 'status', 'createdAt', 'actions'];

  constructor(
    private clientManagementService: ClientManagementService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.clientManagementService.getAllClientRequests().subscribe({
      next: (data) => this.requests = data,
      error: (err) => console.error('Failed to load requests', err)
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'CONVERTED': 'bg-blue-100 text-blue-800'
    };
    return classes[status] || '';
  }

  convertToClient(request: any) {
    const dialogRef = this.dialog.open(ConvertClientDialogComponent, {
      width: '500px',
      data: request
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRequests();
      }
    });
  }
}
