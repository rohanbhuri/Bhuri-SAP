import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FinanceService, Payment, PaymentMethod, PaymentStatus } from '../finance.service';

@Component({
  selector: 'app-payments-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule, MatPaginatorModule
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Payments</h2>
        <button mat-raised-button color="primary" (click)="createPayment()">
          <mat-icon>add</mat-icon>
          Record Payment
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="payments()" class="payments-table">
          <ng-container matColumnDef="invoiceId">
            <th mat-header-cell *matHeaderCellDef>Invoice ID</th>
            <td mat-cell *matCellDef="let payment">{{ payment.invoiceId }}</td>
          </ng-container>
          
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Amount</th>
            <td mat-cell *matCellDef="let payment">
              <div class="amount">{{ formatCurrency(payment.amount) }}</div>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="paymentMethod">
            <th mat-header-cell *matHeaderCellDef>Payment Method</th>
            <td mat-cell *matCellDef="let payment">
              <mat-chip [color]="getPaymentMethodColor(payment.paymentMethod)">
                {{ payment.paymentMethod | titlecase }}
              </mat-chip>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let payment">
              <mat-chip [color]="getStatusColor(payment.status)">
                {{ payment.status | titlecase }}
              </mat-chip>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="paymentDate">
            <th mat-header-cell *matHeaderCellDef>Payment Date</th>
            <td mat-cell *matCellDef="let payment">{{ formatDate(payment.paymentDate) }}</td>
          </ng-container>
          
          <ng-container matColumnDef="reference">
            <th mat-header-cell *matHeaderCellDef>Reference</th>
            <td mat-cell *matCellDef="let payment">{{ payment.reference || '-' }}</td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <mat-paginator
          [length]="totalPayments()"
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
    
    .table-container { 
      background: var(--theme-surface); 
      border-radius: 8px; 
      overflow: hidden; 
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent); 
    }
    
    .payments-table { width: 100%; }
    .amount { font-weight: 600; }
  `]
})
export class PaymentsPageComponent implements OnInit {
  private financeService = inject(FinanceService);
  private snackBar = inject(MatSnackBar);

  payments = signal<Payment[]>([]);
  totalPayments = signal(0);
  displayedColumns = ['invoiceId', 'amount', 'paymentMethod', 'status', 'paymentDate', 'reference'];
  
  currentPage = 1;
  pageSize = 10;

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.financeService.getAllPayments(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.payments.set(result.payments);
        this.totalPayments.set(result.total);
      },
      error: () => {
        this.snackBar.open('Error loading payments', 'Close', { duration: 3000 });
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPayments();
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getPaymentMethodColor(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.CASH: return 'primary';
      case PaymentMethod.CARD: return 'accent';
      case PaymentMethod.BANK_TRANSFER: return 'primary';
      case PaymentMethod.CHECK: return 'warn';
      case PaymentMethod.CRYPTO: return 'accent';
      default: return '';
    }
  }

  getStatusColor(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PENDING: return 'warn';
      case PaymentStatus.COMPLETED: return 'primary';
      case PaymentStatus.FAILED: return 'warn';
      case PaymentStatus.REFUNDED: return 'accent';
      default: return '';
    }
  }

  createPayment() {
    // Open payment creation dialog
    console.log('Create payment');
  }
}
