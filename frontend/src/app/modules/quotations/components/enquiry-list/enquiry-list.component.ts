import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuotationsService } from '../../quotations.service';
import { ClientManagementService } from '../../../client-management/services/client-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnquiryDialogComponent } from '../../dialogs/enquiry-dialog.component';
import { QuotationDialogComponent } from '../../dialogs/quotation-dialog.component';
import { PresentationDialogComponent } from '../../dialogs/presentation-dialog.component';

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
    MatTooltipModule,
    MatDialogModule
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
            <div class="action-buttons">
              <!-- Client Button -->
              <button 
                *ngIf="!enquiry.clientId" 
                mat-raised-button 
                color="accent"
                (click)="createClient(enquiry._id, enquiry)"
                class="btn-create-client"
                matTooltip="Create client from enquiry">
                <mat-icon>person_add</mat-icon>
              </button>

              <!-- Presentation Buttons -->
              <button 
                *ngIf="!enquiry.presentationId" 
                mat-raised-button 
                color="primary"
                (click)="createPresentation(enquiry._id, enquiry)"
                class="btn-presentation"
                matTooltip="Create presentation from enquiry">
                <mat-icon>slideshow</mat-icon>
              </button>
              <button 
                *ngIf="enquiry.presentationId" 
                mat-raised-button 
                color="primary"
                (click)="viewPresentation(enquiry.presentationId)"
                class="btn-view"
                matTooltip="View presentation">
                <mat-icon>visibility</mat-icon>
              </button>

              <!-- Quotation Buttons -->
              <button 
                *ngIf="!enquiry.quotationId" 
                mat-raised-button 
                color="primary"
                (click)="createQuotation(enquiry._id, enquiry)"
                class="btn-quotation"
                matTooltip="Create quotation from enquiry">
                <mat-icon>description</mat-icon>
              </button>
              <button 
                *ngIf="enquiry.quotationId" 
                mat-raised-button 
                color="primary"
                (click)="viewQuotation(enquiry.quotationId)"
                class="btn-view"
                matTooltip="View quotation">
                <mat-icon>visibility</mat-icon>
              </button>

              <!-- More Options Menu -->
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="viewEnquiry(enquiry._id)">
                  <mat-icon>info</mat-icon>
                  View Details
                </button>
                <button mat-menu-item (click)="deleteEnquiry(enquiry._id)">
                  <mat-icon>delete</mat-icon>
                  Delete
                </button>
              </mat-menu>
            </div>
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

    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }

    button[mat-raised-button] {
      font-size: 12px;
      padding: 6px 12px;
      min-width: auto;
      height: 36px;
    }

    .btn-create-client {
      background-color: #ff9800 !important;
      color: white !important;
    }

    .btn-presentation {
      background-color: #2196f3 !important;
      color: white !important;
    }

    .btn-quotation {
      background-color: #4caf50 !important;
      color: white !important;
    }

    .btn-view {
      background-color: #9c27b0 !important;
      color: white !important;
    }

    button[mat-raised-button]:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class EnquiryListComponent implements OnInit {
  private quotationsService = inject(QuotationsService);
  private clientService = inject(ClientManagementService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  enquiries = signal<any[]>([]);
  displayedColumns = ['enquiryNumber', 'customer', 'items', 'status', 'createdAt', 'actions'];

  ngOnInit() {
    this.loadEnquiries();
    this.subscribeToQuotationDeletion();
    this.subscribeToPresentationDeletion();
  }

  loadEnquiries() {
    this.quotationsService.getEnquiries().subscribe(data => {
      this.enquiries.set(data);
    });
  }

  subscribeToQuotationDeletion() {
    this.quotationsService.quotationDeleted$.subscribe((quotationId: string) => {
      const enquiries = this.enquiries();
      const enquiry = enquiries.find(e => e.quotationId === quotationId);
      if (enquiry) {
        enquiry.quotationId = null;
        this.enquiries.set([...enquiries]);
      }
    });
  }

  subscribeToPresentationDeletion() {
    // You may need to add a presentationDeleted$ subject in the service
    // For now, we'll reload on manual deletion
  }

  /**
   * Create a presentation from the enquiry
   */
  createPresentation(enquiryId: string, enquiry: any) {
    // Fetch the full enquiry details first
    this.quotationsService.getEnquiry(enquiryId).subscribe({
      next: (fullEnquiry) => {
        // Create slides from enquiry items
        const slides = (fullEnquiry.items || []).map((item: any, index: number) => ({
          slideNumber: index + 1,
          productIds: [item.productId],
          layout: 'single' as const,
          slideTitle: item.productName
        }));

        const presentationData = {
          title: `Presentation for ${fullEnquiry.customerName}`,
          clientId: fullEnquiry.clientId,
          clientName: fullEnquiry.customerName,
          enquiryId: enquiryId,
          slides: slides,
          description: `Presentation created from enquiry ${fullEnquiry.enquiryNumber}`
        };

        this.quotationsService.createPresentation(presentationData).subscribe({
          next: (response) => {
            this.snackBar.open('Presentation created successfully with product slides', 'Close', { duration: 3000 });
            enquiry.presentationId = response._id;
            this.enquiries.set([...this.enquiries()]);
          },
          error: (err) => {
            this.snackBar.open('Failed to create presentation', 'Close', { duration: 3000 });
            console.error('Error creating presentation:', err);
          }
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to load enquiry data', 'Close', { duration: 3000 });
        console.error('Error loading enquiry:', err);
      }
    });
  }

  /**
   * Create a quotation from the enquiry
   */
  createQuotation(enquiryId: string, enquiry: any) {
    this.quotationsService.createFromEnquiry(enquiryId).subscribe({
      next: (response) => {
        this.snackBar.open('Quotation created successfully', 'Close', { duration: 3000 });
        enquiry.quotationId = response._id;
        this.enquiries.set([...this.enquiries()]);
      },
      error: (err) => {
        this.snackBar.open('Failed to create quotation', 'Close', { duration: 3000 });
        console.error('Error creating quotation:', err);
      }
    });
  }

  /**
   * Create a new client from the enquiry data
   */
  createClient(enquiryId: string, enquiry: any) {
    const clientData = {
      name: enquiry.customerName,
      email: enquiry.customerEmail,
      phone: enquiry.customerPhone,
      company: enquiry.company,
      enquiryId: enquiryId
    };

    this.clientService.convertToClient(enquiryId, clientData).subscribe({
      next: (response) => {
        this.snackBar.open('Client created successfully', 'Close', { duration: 3000 });
        enquiry.clientId = response.clientId;
        this.enquiries.set([...this.enquiries()]);
      },
      error: (err) => {
        this.snackBar.open('Failed to create client', 'Close', { duration: 3000 });
        console.error('Error creating client:', err);
      }
    });
  }

  /**
   * View presentation details (navigate or open modal)
   */
  viewPresentation(presentationId: string) {
    this.quotationsService.getPresentation(presentationId).subscribe({
      next: (presentation) => {
        const dialogRef = this.dialog.open(PresentationDialogComponent, {
          data: presentation,
          width: '800px'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadEnquiries();
          }
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to load presentation', 'Close', { duration: 3000 });
        console.error('Error loading presentation:', err);
      }
    });
  }

  /**
   * View quotation details (navigate or open modal)
   */
  viewQuotation(quotationId: string) {
    this.quotationsService.getQuotation(quotationId).subscribe({
      next: (quotation) => {
        const dialogRef = this.dialog.open(QuotationDialogComponent, {
          data: { quotation },
          width: '1000px'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadEnquiries();
          }
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to load quotation', 'Close', { duration: 3000 });
        console.error('Error loading quotation:', err);
      }
    });
  }

  /**
   * View enquiry details
   */
  viewEnquiry(enquiryId: string) {
    this.quotationsService.getEnquiry(enquiryId).subscribe({
      next: (enquiry) => {
        this.dialog.open(EnquiryDialogComponent, {
          data: { enquiry },
          width: '800px'
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to load enquiry details', 'Close', { duration: 3000 });
        console.error('Error loading enquiry:', err);
      }
    });
  }

  deleteEnquiry(id: string) {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      this.quotationsService.deleteEnquiry(id).subscribe({
        next: () => {
          this.snackBar.open('Enquiry deleted', 'Close', { duration: 3000 });
          this.loadEnquiries();
        },
        error: (err) => {
          this.snackBar.open('Failed to delete enquiry', 'Close', { duration: 3000 });
          console.error('Error deleting enquiry:', err);
        }
      });
    }
  }
}
