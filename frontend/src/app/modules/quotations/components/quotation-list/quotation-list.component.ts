import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { QuotationsService } from '../../quotations.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quotation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule, MatTableModule, MatChipsModule, MatMenuModule],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Quotations</h2>
        <button mat-raised-button color="primary" [routerLink]="['../new']">
          <mat-icon>add</mat-icon>
          New Quotation
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="quotes" class="crm-table">
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
              <mat-chip [color]="getStatusColor(quote.status)">{{ quote.status }}</mat-chip>
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
                <button mat-menu-item [routerLink]="[quote._id]">
                  <mat-icon>visibility</mat-icon>
                  <span>View</span>
                </button>
                <button mat-menu-item [routerLink]="[quote._id, 'edit']">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="sendEmail(quote._id)">
                  <mat-icon>email</mat-icon>
                  <span>Send Email</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `
})
export class QuotationListComponent {
  quotes: any[] = [];
  displayedColumns = ['quotationNumber', 'client', 'total', 'status', 'date', 'actions'];

  constructor(private quotationsService: QuotationsService) {
    this.quotationsService.getQuotations().subscribe(quotes => {
      this.quotes = quotes || [];
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'DRAFT': return 'accent';
      case 'SENT': return 'primary';
      case 'ACCEPTED': return '';
      case 'DECLINED': return 'warn';
      default: return '';
    }
  }

  sendEmail(id: string) {
    this.quotationsService.sendQuotationEmail(id).subscribe();
  }
}
