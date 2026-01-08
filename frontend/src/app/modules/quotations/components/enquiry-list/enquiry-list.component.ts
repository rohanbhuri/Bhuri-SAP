import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuotationsService } from '../../quotations.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-enquiry-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <div class="enquiry-list">
      <div class="list-header">
        <h2>Enquiries</h2>
      </div>

      <table mat-table [dataSource]="enquiries()" class="enquiry-table">
        <ng-container matColumnDef="enquiryNumber">
          <th mat-header-cell *matHeaderCellDef>Enquiry #</th>
          <td mat-cell *matCellDef="let enquiry">{{ enquiry.enquiryNumber }}</td>
        </ng-container>

        <ng-container matColumnDef="customer">
          <th mat-header-cell *matHeaderCellDef>Customer</th>
          <td mat-cell *matCellDef="let enquiry">
            <div class="customer-info">
              <strong>{{ enquiry.customerName }}</strong>
              <small>{{ enquiry.customerEmail }}</small>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="items">
          <th mat-header-cell *matHeaderCellDef>Items</th>
          <td mat-cell *matCellDef="let enquiry">{{ enquiry.items?.length || 0 }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let enquiry">
            <mat-chip [class]="'status-' + enquiry.status">{{ enquiry.status }}</mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="createdAt">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let enquiry">{{ enquiry.createdAt | date:'short' }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let enquiry">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="generateQuotation(enquiry._id)" 
                      [disabled]="enquiry.status === 'quoted'">
                <mat-icon>description</mat-icon>
                Generate Quotation
              </button>
              <button mat-menu-item (click)="deleteEnquiry(enquiry._id)">
                <mat-icon>delete</mat-icon>
                Delete
              </button>
            </mat-menu>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .enquiry-list {
      padding: 24px;
    }
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .enquiry-table {
      width: 100%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }
    .customer-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .customer-info small {
      color: #666;
      font-size: 12px;
    }
    mat-chip {
      font-size: 11px;
      min-height: 24px;
    }
    .status-new { background: #e3f2fd; color: #1976d2; }
    .status-processing { background: #fff3e0; color: #f57c00; }
    .status-quoted { background: #e8f5e9; color: #388e3c; }
    .status-converted { background: #f3e5f5; color: #7b1fa2; }
    .status-closed { background: #fafafa; color: #616161; }
  `]
})
export class EnquiryListComponent implements OnInit {
  private quotationsService = inject(QuotationsService);
  private snackBar = inject(MatSnackBar);

  enquiries = signal<any[]>([]);
  displayedColumns = ['enquiryNumber', 'customer', 'items', 'status', 'createdAt', 'actions'];

  ngOnInit() {
    this.loadEnquiries();
  }

  loadEnquiries() {
    this.quotationsService.getEnquiries().subscribe(data => {
      this.enquiries.set(data);
    });
  }

  generateQuotation(enquiryId: string) {
    this.quotationsService.createFromEnquiry(enquiryId).subscribe({
      next: () => {
        this.snackBar.open('Quotation generated successfully', 'Close', { duration: 3000 });
        this.loadEnquiries();
      },
      error: () => {
        this.snackBar.open('Failed to generate quotation', 'Close', { duration: 3000 });
      }
    });
  }

  deleteEnquiry(id: string) {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      this.quotationsService.deleteEnquiry(id).subscribe({
        next: () => {
          this.snackBar.open('Enquiry deleted', 'Close', { duration: 3000 });
          this.loadEnquiries();
        }
      });
    }
  }
}
