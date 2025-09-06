import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FinanceService, Receipt, PaymentMethod } from '../finance.service';

@Component({
  selector: 'app-receipts-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule, MatPaginatorModule
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Receipts</h2>
        <button mat-raised-button color="primary" (click)="createReceipt()">
          <mat-icon>add</mat-icon>
          Create Receipt
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="receipts()" class="receipts-table">
          <ng-container matColumnDef="receiptNumber">
            <th mat-header-cell *matHeaderCellDef>Receipt #</th>
            <td mat-cell *matCellDef="let receipt">{{ receipt.receiptNumber }}</td>
          </ng-container>
          
          <ng-container matColumnDef="invoiceId">
            <th mat-header-cell *matHeaderCellDef>Invoice ID</th>
            <td mat-cell *matCellDef="let receipt">{{ receipt.invoiceId }}</td>
          </ng-container>
          
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Amount</th>
            <td mat-cell *matCellDef="let receipt">
              <div class="amount">{{ receipt.currency }} {{ formatCurrency(receipt.amount) }}</div>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="paymentMethod">
            <th mat-header-cell *matHeaderCellDef>Payment Method</th>
            <td mat-cell *matCellDef="let receipt">
              <mat-chip [color]="getPaymentMethodColor(receipt.paymentMethod)">
                {{ receipt.paymentMethod | titlecase }}
              </mat-chip>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="paymentDate">
            <th mat-header-cell *matHeaderCellDef>Payment Date</th>
            <td mat-cell *matCellDef="let receipt">{{ formatDate(receipt.paymentDate) }}</td>
          </ng-container>
          
          <ng-container matColumnDef="reference">
            <th mat-header-cell *matHeaderCellDef>Reference</th>
            <td mat-cell *matCellDef="let receipt">{{ receipt.reference || '-' }}</td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <mat-paginator
          [length]="totalReceipts()"
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
    
    .receipts-table { width: 100%; }
    .amount { font-weight: 600; }
  `]
})
export class ReceiptsPageComponent implements OnInit {
  private financeService = inject(FinanceService);
  private snackBar = inject(MatSnackBar);

  receipts = signal<Receipt[]>([]);
  totalReceipts = signal(0);
  displayedColumns = ['receiptNumber', 'invoiceId', 'amount', 'paymentMethod', 'paymentDate', 'reference'];
  
  currentPage = 1;
  pageSize = 10;

  ngOnInit() {
    this.loadReceipts();
  }

  loadReceipts() {
    this.financeService.getAllReceipts(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.receipts.set(result.receipts);
        this.totalReceipts.set(result.total);
      },
      error: () => {
        this.snackBar.open('Error loading receipts', 'Close', { duration: 3000 });
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadReceipts();
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

  createReceipt() {
    // Open receipt creation dialog
    console.log('Create receipt');
  }
}
