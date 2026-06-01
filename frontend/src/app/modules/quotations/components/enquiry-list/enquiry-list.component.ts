import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { QuotationsService } from '../../quotations.service';

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
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule
  ],
  template: `
    <div class="enquiry-list">
      <div class="list-header">
        <h2>Enquiries</h2>
      </div>

      <div class="filters-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search by number, customer name or email</mat-label>
          <input matInput [(ngModel)]="searchQuery" (ngModelChange)="onFilterChange()" placeholder="Search...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="selectedStatus" (selectionChange)="onFilterChange()">
            <mat-option value="">All Status</mat-option>
            <mat-option value="new">New</mat-option>
            <mat-option value="processing">Processing</mat-option>
            <mat-option value="quoted">Quoted</mat-option>
            <mat-option value="converted">Converted</mat-option>
            <mat-option value="closed">Closed</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-stroked-button (click)="resetFilters()">Reset</button>
      </div>

      <table mat-table [dataSource]="filteredEnquiries()" class="enquiry-table">
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

      <mat-paginator
        [length]="totalEnquiries()"
        [pageSize]="pageSize()"
        [pageSizeOptions]="[10, 25, 50]"
        (page)="onPageChange($event)"
        aria-label="Select page">
      </mat-paginator>
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
    .filters-container {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .filters-container mat-form-field {
      min-width: 200px;
    }
    .search-field {
      flex: 1;
      min-width: 300px !important;
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

  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  enquiries = signal<any[]>([]);
  filteredEnquiries = signal<any[]>([]);
  totalEnquiries = signal<number>(0);
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);
  searchQuery = '';
  selectedStatus = '';
  displayedColumns = ['enquiryNumber', 'customer', 'items', 'status', 'createdAt', 'actions'];

  ngOnInit() {
    this.loadEnquiries();
    this.subscribeToQuotationDeletion();
    this.subscribeToPresentationDeletion();
  }

  loadEnquiries() {
    this.quotationsService.getEnquiries().subscribe(data => {
      this.enquiries.set(data);
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = this.enquiries();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.enquiryNumber?.toLowerCase().includes(query) ||
        e.customerName?.toLowerCase().includes(query) ||
        e.customerEmail?.toLowerCase().includes(query)
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(e => e.status === this.selectedStatus);
    }

    this.totalEnquiries.set(filtered.length);
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    this.filteredEnquiries.set(filtered.slice(start, end));
  }

  onFilterChange() {
    this.pageIndex.set(0);
    this.applyFilters();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.applyFilters();
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.pageIndex.set(0);
    this.applyFilters();
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
        // Create slides from enquiry items, including variant info
        const slides = (fullEnquiry.items || []).map((item: any, index: number) => {
          const slideProduct: any = {
            productId: item.productId
          };
          // If item has variant info, include it
          if (item.selectedVariants?.length) {
            const primaryVariant = item.selectedVariants[0];
            slideProduct.variantId = primaryVariant.variantId;
            slideProduct.variantName = primaryVariant.variantName;
            slideProduct.sku = primaryVariant.sku;
          }

          return {
            slideNumber: index + 1,
            productIds: [item.productId],
            products: [slideProduct],
            layout: 'single' as const,
            slideTitle: item.selectedVariants?.length
              ? `${item.productName} — ${item.selectedVariants.map((v: any) => v.variantName).join(', ')}`
              : item.productName
          };
        });

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
