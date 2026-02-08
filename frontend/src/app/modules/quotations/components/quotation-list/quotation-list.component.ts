import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { QuotationsService } from '../../quotations.service';
import { QuotationDialogComponent } from '../../dialogs/quotation-dialog.component';
import { PreferencesService } from '../../../../services/preferences.service';

@Component({
  selector: 'app-quotation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule, MatTableModule, MatChipsModule, MatMenuModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatPaginatorModule, FormsModule],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Quotations</h2>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          New Quotation
        </button>
      </div>

      <div class="filters-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search by number or client</mat-label>
          <input matInput [(ngModel)]="searchQuery" (ngModelChange)="onFilterChange()" placeholder="Search...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="selectedStatus" (selectionChange)="onFilterChange()">
            <mat-option value="">All Status</mat-option>
            <mat-option value="draft">Draft</mat-option>
            <mat-option value="pending_approval">Pending Approval</mat-option>
            <mat-option value="approved">Approved</mat-option>
            <mat-option value="sent">Sent</mat-option>
            <mat-option value="accepted">Accepted</mat-option>
            <mat-option value="declined">Declined</mat-option>
            <mat-option value="expired">Expired</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-stroked-button (click)="resetFilters()">Reset</button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="filteredQuotes()" class="crm-table">
          <ng-container matColumnDef="quotationNumber">
            <th mat-header-cell *matHeaderCellDef>Quote #</th>
            <td mat-cell *matCellDef="let quote">{{ quote.quotationNumber }}</td>
          </ng-container>

          <ng-container matColumnDef="client">
            <th mat-header-cell *matHeaderCellDef>Client</th>
            <td mat-cell *matCellDef="let quote">
              <div class="client-info">
                <div class="client-name">{{ quote.clientName || 'Unknown' }}</div>
                <div class="client-email">{{ quote.clientEmail }}</div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef>Total</th>
            <td mat-cell *matCellDef="let quote">{{ quote.grandTotal | currency:userCurrency() }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let quote">
              <mat-chip [class]="'status-' + quote.status">{{ quote.status }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let quote">{{ quote.createdAt | date }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let quote">
              <button mat-icon-button [matMenuTriggerFor]="quoteMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #quoteMenu="matMenu">
                <button mat-menu-item (click)="editQuotation(quote)" 
                        [disabled]="quote.status !== 'draft'">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
                <button mat-menu-item (click)="downloadExcel(quote._id)">
                  <mat-icon>table_chart</mat-icon>
                  Download Excel
                </button>
                <button mat-menu-item (click)="submitForApproval(quote._id)" 
                        [disabled]="quote.status !== 'draft'">
                  <mat-icon>send</mat-icon>
                  Submit for Approval
                </button>
                <button mat-menu-item (click)="approve(quote._id)" 
                        [disabled]="quote.status !== 'pending_approval'">
                  <mat-icon>check_circle</mat-icon>
                  Approve
                </button>

                <button mat-menu-item (click)="deleteQuotation(quote._id)" 
                        [disabled]="quote.status !== 'draft'">
                  <mat-icon>delete</mat-icon>
                  Delete
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator
          [length]="totalQuotes()"
          [pageSize]="pageSize()"
          [pageSizeOptions]="[10, 25, 50]"
          (page)="onPageChange($event)"
          aria-label="Select page">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .tab-content {
      padding: 24px;
    }
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .tab-header h2 {
      margin: 0;
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
    .table-container {
      margin-top: 16px;
    }
    .status-draft { background: #e0e0e0; color: #424242; }
    .status-pending_approval { background: #fff3e0; color: #f57c00; }
    .status-approved { background: #e8f5e9; color: #388e3c; }
    .status-sent { background: #e3f2fd; color: #1976d2; }
    .status-accepted { background: #f3e5f5; color: #7b1fa2; }
    .status-declined { background: #ffebee; color: #c62828; }
    .status-expired { background: #fafafa; color: #616161; }
  `]
})
export class QuotationListComponent implements OnInit {
  private quotationsService = inject(QuotationsService);
  private preferencesService = inject(PreferencesService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  quotes = signal<any[]>([]);
  filteredQuotes = signal<any[]>([]);
  totalQuotes = signal<number>(0);
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);
  searchQuery = '';
  selectedStatus = '';
  userCurrency = signal<string>('INR');
  displayedColumns = ['quotationNumber', 'client', 'total', 'status', 'date', 'actions'];

  ngOnInit() {
    this.loadQuotations();
    this.loadPreferences();
  }

  loadPreferences() {
    this.preferencesService.getUserPreferences().subscribe(prefs => {
      if (prefs?.currency) {
        this.userCurrency.set(prefs.currency);
      }
    });
  }

  openDialog() {
    this.dialog.open(QuotationDialogComponent)
      .afterClosed().subscribe(result => {
        if (result) {
          this.snackBar.open('Quotation created successfully', 'Close', { duration: 3000 });
          this.loadQuotations();
        }
      });
  }

  editQuotation(quote: any) {
    this.dialog.open(QuotationDialogComponent, { 
      data: { quotation: quote, mode: 'edit' }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Quotation updated successfully', 'Close', { duration: 3000 });
        this.loadQuotations();
      }
    });
  }

  loadQuotations() {
    this.quotationsService.getQuotations().subscribe(quotes => {
      this.quotes.set(quotes || []);
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = this.quotes();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.quotationNumber?.toLowerCase().includes(query) ||
        q.clientName?.toLowerCase().includes(query) ||
        q.clientEmail?.toLowerCase().includes(query)
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(q => q.status === this.selectedStatus);
    }

    this.totalQuotes.set(filtered.length);
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    this.filteredQuotes.set(filtered.slice(start, end));
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

  submitForApproval(id: string) {
    this.quotationsService.submitForApproval(id).subscribe({
      next: () => {
        this.snackBar.open('Quotation submitted for approval', 'Close', { duration: 3000 });
        this.loadQuotations();
      }
    });
  }

  approve(id: string) {
    this.quotationsService.approveQuotation(id).subscribe({
      next: () => {
        this.snackBar.open('Quotation approved', 'Close', { duration: 3000 });
        this.loadQuotations();
      }
    });
  }



  deleteQuotation(id: string) {
    if (confirm('Are you sure you want to delete this quotation?')) {
      this.quotationsService.deleteQuotation(id).subscribe({
        next: () => {
          this.snackBar.open('Quotation deleted', 'Close', { duration: 3000 });
          this.loadQuotations();
        }
      });
    }
  }



  downloadExcel(id: string) {
    this.quotationsService.downloadQuotationExcel(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quotation-${id}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Excel downloaded', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to download Excel', 'Close', { duration: 3000 })
    });
  }
}
