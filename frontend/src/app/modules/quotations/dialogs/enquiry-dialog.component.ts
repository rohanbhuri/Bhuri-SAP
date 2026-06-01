import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-enquiry-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Enquiry Details: {{ data.enquiry.enquiryNumber }}</h2>
      <button mat-icon-button (click)="dialogRef.close()" class="close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="enquiry-dialog-content">
      <div class="info-section">
        <h3>Customer Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Name:</span>
            <span class="value">{{ data.enquiry.customerName }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ data.enquiry.customerEmail }}</span>
          </div>
          <div class="info-item">
            <span class="label">Phone:</span>
            <span class="value">{{ data.enquiry.customerPhone || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Company:</span>
            <span class="value">{{ data.enquiry.company || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Status:</span>
            <span class="value">
              <mat-chip [class]="'status-' + data.enquiry.status">{{ data.enquiry.status }}</mat-chip>
            </span>
          </div>
          <div class="info-item">
            <span class="label">Date:</span>
            <span class="value">{{ data.enquiry.createdAt | date:'medium' }}</span>
          </div>
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="items-section">
        <h3>Items Requested</h3>
        <table mat-table [dataSource]="data.enquiry.items || []" class="items-table">
          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef>Product</th>
            <td mat-cell *matCellDef="let item">
              <div>{{ item.productName }}</div>
              <div *ngIf="item.selectedVariants?.length" class="variant-info">
                <mat-chip *ngFor="let v of item.selectedVariants" class="variant-chip">
                  {{ v.typeName }}: {{ v.variantName }}
                  <span *ngIf="v.sku" class="sku">({{ v.sku }})</span>
                </mat-chip>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef>Quantity</th>
            <td mat-cell *matCellDef="let item">{{ item.quantity }}</td>
          </ng-container>

          <ng-container matColumnDef="specifications">
            <th mat-header-cell *matHeaderCellDef>Specifications</th>
            <td mat-cell *matCellDef="let item">
              <span *ngIf="item.specifications">{{ item.specifications }}</span>
              <span *ngIf="!item.specifications && item.customDimensions">
                {{ item.customDimensions.width }} x {{ item.customDimensions.depth }} x {{ item.customDimensions.height }}
              </span>
              <span *ngIf="!item.specifications && !item.customDimensions">—</span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <div *ngIf="!data.enquiry.items?.length" class="no-items">
          No items specified in this enquiry.
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="message-section" *ngIf="data.enquiry.message">
        <h3>Message</h3>
        <p class="message-text">{{ data.enquiry.message }}</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 8px;
    }
    .close-btn {
      margin-top: -8px;
    }
    .enquiry-dialog-content {
      width: 100%;
      max-width: 800px;
    }
    
    @media (max-width: 768px) {
      .enquiry-dialog-content {
        max-width: 100%;
      }
    }
    .info-section, .items-section, .message-section {
      padding: 16px 0;
    }
    h3 {
      margin-top: 0;
      color: #3f51b5;
      font-size: 1.1rem;
      margin-bottom: 16px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
    }
    .label {
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 4px;
    }
    .value {
      font-weight: 500;
    }
    .items-table {
      width: 100%;
      background: #fafafa;
      border-radius: 4px;
    }
    .no-items {
      padding: 16px;
      text-align: center;
      color: #666;
      background: #fafafa;
      border-radius: 4px;
    }
    .variant-info {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 4px;
    }
    .variant-chip {
      font-size: 10px;
      min-height: 20px;
      padding: 2px 8px;
      background: #e8f5e9;
      color: #2e7d32;
    }
    .variant-chip .sku {
      font-size: 9px;
      color: #666;
      margin-left: 4px;
    }
    .message-text {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      white-space: pre-wrap;
      margin: 0;
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
export class EnquiryDialogComponent {
  dialogRef = inject(MatDialogRef<EnquiryDialogComponent>);
  displayedColumns = ['product', 'quantity', 'specifications'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { enquiry: any }) {}
}
