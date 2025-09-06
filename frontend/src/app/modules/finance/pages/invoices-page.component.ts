import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { FinanceService, Invoice, InvoiceStatus } from '../finance.service';
import { InvoiceDialogComponent } from '../dialogs/invoice-dialog.component';

@Component({
  selector: 'app-invoices-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule, MatMenuModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatPaginatorModule, FormsModule
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Invoices</h2>
        <button mat-raised-button color="primary" (click)="openInvoiceDialog()">
          <mat-icon>add</mat-icon>
          Create Invoice
        </button>
      </div>
      
      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Search Invoices</mat-label>
          <input matInput [(ngModel)]="searchQuery" (input)="applyFilters()" placeholder="Search by invoice number, product name...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(value)]="selectedStatus" (selectionChange)="applyFilters()">
            <mat-option value="">All Statuses</mat-option>
            <mat-option value="draft">Draft</mat-option>
            <mat-option value="sent">Sent</mat-option>
            <mat-option value="paid">Paid</mat-option>
            <mat-option value="overdue">Overdue</mat-option>
            <mat-option value="cancelled">Cancelled</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="invoices()" class="invoices-table">
          <ng-container matColumnDef="invoiceNumber">
            <th mat-header-cell *matHeaderCellDef>Invoice #</th>
            <td mat-cell *matCellDef="let invoice">{{ invoice.invoiceNumber }}</td>
          </ng-container>
          
          <ng-container matColumnDef="customer">
            <th mat-header-cell *matHeaderCellDef>Customer</th>
            <td mat-cell *matCellDef="let invoice">
              <div class="customer-info">
                <div class="customer-avatar">{{ getInitials(invoice.customerId) }}</div>
                <div class="customer-details">
                  <div class="customer-name">{{ invoice.customerId }}</div>
                  <div class="customer-email">{{ formatDate(invoice.issueDate) }}</div>
                </div>
              </div>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="items">
            <th mat-header-cell *matHeaderCellDef>Items</th>
            <td mat-cell *matCellDef="let invoice">
              <div class="items-info">
                <div class="items-count">{{ invoice.items.length }} item(s)</div>
                <div class="items-preview">{{ invoice.items[0]?.productName || 'No items' }}</div>
              </div>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Amount</th>
            <td mat-cell *matCellDef="let invoice">
              <div class="amount-info">
                <div class="total-amount">{{ invoice.currency }} {{ formatCurrency(invoice.totalAmount) }}</div>
                <div class="subtotal" *ngIf="invoice.taxAmount > 0">
                  Subtotal: {{ invoice.currency }} {{ formatCurrency(invoice.subtotal) }}
                </div>
              </div>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let invoice">
              <mat-chip [color]="getStatusColor(invoice.status)">
                {{ invoice.status | titlecase }}
              </mat-chip>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="dates">
            <th mat-header-cell *matHeaderCellDef>Dates</th>
            <td mat-cell *matCellDef="let invoice">
              <div class="dates-info">
                <div class="issue-date">Issued: {{ formatDate(invoice.issueDate) }}</div>
                <div class="due-date">Due: {{ formatDate(invoice.dueDate) }}</div>
                <div class="paid-date" *ngIf="invoice.paidDate">
                  Paid: {{ formatDate(invoice.paidDate) }}
                </div>
              </div>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let invoice">
              <button mat-icon-button [matMenuTriggerFor]="invoiceMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #invoiceMenu="matMenu">
                <button mat-menu-item (click)="viewInvoice(invoice)">
                  <mat-icon>visibility</mat-icon>
                  <span>View Details</span>
                </button>
                <button mat-menu-item (click)="editInvoice(invoice)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="sendInvoice(invoice)" *ngIf="invoice.status === 'draft'">
                  <mat-icon>send</mat-icon>
                  <span>Send</span>
                </button>
                <button mat-menu-item (click)="recordPayment(invoice)" *ngIf="invoice.status === 'sent'">
                  <mat-icon>payment</mat-icon>
                  <span>Record Payment</span>
                </button>
                <button mat-menu-item (click)="deleteInvoice(invoice._id)" class="delete-action">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <mat-paginator
          [length]="totalInvoices()"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: var(--theme-on-surface); }
    
    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    
    .filters mat-form-field {
      min-width: 200px;
    }
    
    .table-container { 
      background: var(--theme-surface); 
      border-radius: 8px; 
      overflow: hidden; 
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent); 
    }
    
    .invoices-table { width: 100%; }
    
    .customer-info { display: flex; align-items: center; gap: 12px; }
    .customer-avatar { 
      width: 40px; height: 40px; border-radius: 50%; 
      background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent)); 
      color: white; display: flex; align-items: center; justify-content: center; 
      font-weight: 600; font-size: 14px; 
    }
    .customer-name { font-weight: 500; margin-bottom: 2px; }
    .customer-email { font-size: 12px; opacity: 0.7; }
    
    .items-info { }
    .items-count { font-weight: 500; margin-bottom: 2px; }
    .items-preview { font-size: 12px; opacity: 0.7; }
    
    .amount-info { }
    .total-amount { font-weight: 600; margin-bottom: 4px; }
    .subtotal { font-size: 12px; opacity: 0.7; }
    
    .dates-info { }
    .issue-date { font-weight: 500; margin-bottom: 2px; }
    .due-date { font-size: 12px; opacity: 0.7; margin-bottom: 2px; }
    .paid-date { font-size: 12px; color: #4caf50; }
    
    .delete-action { color: #f44336; }
    
    /* Dark theme adjustments */
    :host-context(body.dark-theme) .table-container {
      border-color: color-mix(in srgb, var(--theme-on-surface) 20%, transparent);
    }
  `]
})
export class InvoicesPageComponent implements OnInit {
  private financeService = inject(FinanceService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  invoices = signal<Invoice[]>([]);
  totalInvoices = signal(0);
  displayedColumns = ['invoiceNumber', 'customer', 'items', 'amount', 'status', 'dates', 'actions'];
  
  searchQuery = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 10;

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.financeService.getAllInvoices(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.invoices.set(result.invoices);
        this.totalInvoices.set(result.total);
      },
      error: () => {
        this.snackBar.open('Error loading invoices', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilters() {
    // In a real implementation, you would filter on the backend
    this.currentPage = 1;
    this.loadInvoices();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadInvoices();
  }

  getInitials(customerId: string): string {
    return customerId.substring(0, 2).toUpperCase();
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: InvoiceStatus): string {
    switch (status) {
      case InvoiceStatus.DRAFT: return 'warn';
      case InvoiceStatus.SENT: return 'primary';
      case InvoiceStatus.PAID: return 'primary';
      case InvoiceStatus.OVERDUE: return 'warn';
      case InvoiceStatus.CANCELLED: return 'warn';
      default: return '';
    }
  }

  openInvoiceDialog(invoice?: Invoice) {
    const dialogRef = this.dialog.open(InvoiceDialogComponent, {
      width: '800px',
      data: invoice || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInvoices();
        this.snackBar.open(
          invoice ? 'Invoice updated successfully' : 'Invoice created successfully', 
          'Close', 
          { duration: 3000 }
        );
      }
    });
  }

  viewInvoice(invoice: Invoice) {
    console.log('View invoice:', invoice);
  }

  editInvoice(invoice: Invoice) {
    this.openInvoiceDialog(invoice);
  }

  sendInvoice(invoice: Invoice) {
    // Update invoice status to sent
    this.financeService.updateInvoice(invoice._id, { status: InvoiceStatus.SENT }).subscribe({
      next: () => {
        this.loadInvoices();
        this.snackBar.open('Invoice sent successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Error sending invoice', 'Close', { duration: 3000 })
    });
  }

  recordPayment(invoice: Invoice) {
    // Open payment dialog
    console.log('Record payment for invoice:', invoice);
  }

  deleteInvoice(id: string) {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.financeService.deleteInvoice(id).subscribe({
        next: () => {
          this.loadInvoices();
          this.snackBar.open('Invoice deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error deleting invoice', 'Close', { duration: 3000 })
      });
    }
  }
}
