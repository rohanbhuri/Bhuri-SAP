import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { EnquiryService } from '../enquiry/enquiry.service';

@Component({
  selector: 'app-enquiry-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Enquiry Management</h1>
        <p class="subtitle">Manage website enquiries and convert to quotations</p>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="enquiries()" class="enquiry-table">
            
            <ng-container matColumnDef="enquiryNumber">
              <th mat-header-cell *matHeaderCellDef>Enquiry #</th>
              <td mat-cell *matCellDef="let enquiry">{{enquiry.enquiryNumber}}</td>
            </ng-container>

            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef>Customer</th>
              <td mat-cell *matCellDef="let enquiry">
                <div class="customer-info">
                  <strong>{{enquiry.customerName}}</strong>
                  <small>{{enquiry.customerEmail}}</small>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="items">
              <th mat-header-cell *matHeaderCellDef>Items</th>
              <td mat-cell *matCellDef="let enquiry">
                <div class="items-summary">
                  <span>{{enquiry.items?.length || 0}} items</span>
                  <small>Total: \${{calculateEnquiryTotal(enquiry.items)}}</small>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let enquiry">
                <mat-chip [color]="getStatusColor(enquiry.status)" selected>
                  {{enquiry.status | titlecase}}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="source">
              <th mat-header-cell *matHeaderCellDef>Source</th>
              <td mat-cell *matCellDef="let enquiry">
                <mat-chip>{{enquiry.source | titlecase}}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let enquiry">{{enquiry.createdAt | date:'short'}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let enquiry">
                <div class="actions">
                  <button mat-icon-button (click)="viewEnquiry(enquiry)" title="View Details">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button 
                          *ngIf="enquiry.status === 'new' || enquiry.status === 'processing'"
                          (click)="generateQuotation(enquiry)" 
                          title="Generate Quotation"
                          color="primary">
                    <mat-icon>request_quote</mat-icon>
                  </button>
                  <button mat-icon-button 
                          *ngIf="enquiry.quotationId"
                          (click)="viewQuotation(enquiry.quotationId)" 
                          title="View Quotation"
                          color="accent">
                    <mat-icon>description</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 1rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      margin-bottom: 2rem;
    }
    .subtitle {
      color: #666;
      margin-top: 0.5rem;
    }
    .enquiry-table {
      width: 100%;
    }
    .customer-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .customer-info small {
      color: #666;
    }
    .items-summary {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .items-summary small {
      color: #666;
      font-weight: bold;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
  `]
})
export class EnquiryManagementComponent implements OnInit {
  enquiries = signal<any[]>([]);
  displayedColumns = ['enquiryNumber', 'customer', 'items', 'status', 'source', 'date', 'actions'];

  constructor(
    private enquiryService: EnquiryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEnquiries();
  }

  loadEnquiries() {
    this.enquiryService.getEnquiries().subscribe({
      next: (enquiries) => {
        this.enquiries.set(enquiries);
      },
      error: () => {
        this.snackBar.open('Failed to load enquiries', 'Close', { duration: 3000 });
      }
    });
  }

  calculateEnquiryTotal(items: any[]): number {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'new': return 'primary';
      case 'processing': return 'accent';
      case 'quoted': return 'warn';
      case 'converted': return '';
      case 'closed': return '';
      default: return '';
    }
  }

  viewEnquiry(enquiry: any) {
    // Open enquiry details dialog
    console.log('View enquiry:', enquiry);
  }

  generateQuotation(enquiry: any) {
    this.enquiryService.generateQuotation(enquiry._id, 'current-user').subscribe({
      next: (quotation) => {
        this.snackBar.open('Quotation generated successfully!', 'Close', { duration: 3000 });
        this.loadEnquiries(); // Refresh the list
      },
      error: () => {
        this.snackBar.open('Failed to generate quotation', 'Close', { duration: 3000 });
      }
    });
  }

  viewQuotation(quotationId: string) {
    // Navigate to quotation view
    console.log('View quotation:', quotationId);
  }
}