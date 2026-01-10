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
import { QuotationsService } from '../../quotations.service';
import { QuotationDialogComponent } from '../../dialogs/quotation-dialog.component';

@Component({
  selector: 'app-quotation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule, MatTableModule, MatChipsModule, MatMenuModule, MatDialogModule],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Quotations</h2>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          New Quotation
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="quotes()" class="crm-table">
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
            <td mat-cell *matCellDef="let quote">{{ quote.grandTotal | currency:quote.currency }}</td>
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
                <button mat-menu-item (click)="downloadPDF(quote._id)">
                  <mat-icon>picture_as_pdf</mat-icon>
                  Download PDF
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
                <button mat-menu-item (click)="sendQuotation(quote._id, 'email')" 
                        [disabled]="quote.status !== 'approved'">
                  <mat-icon>email</mat-icon>
                  Send via Email
                </button>
                <button mat-menu-item (click)="sendQuotation(quote._id, 'whatsapp')" 
                        [disabled]="quote.status !== 'approved'">
                  <mat-icon>chat</mat-icon>
                  Send via WhatsApp
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
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  quotes = signal<any[]>([]);
  displayedColumns = ['quotationNumber', 'client', 'total', 'status', 'date', 'actions'];

  ngOnInit() {
    this.loadQuotations();
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
    });
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

  sendQuotation(id: string, via: 'email' | 'whatsapp') {
    this.quotationsService.sendQuotation(id, via).subscribe({
      next: () => {
        this.snackBar.open(`Quotation sent via ${via}`, 'Close', { duration: 3000 });
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

  downloadPDF(id: string) {
    this.quotationsService.downloadQuotationPDF(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quotation-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('PDF downloaded', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to download PDF', 'Close', { duration: 3000 })
    });
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
