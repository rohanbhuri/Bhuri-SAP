import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Invoice, InvoiceStatus, CreateInvoiceDto, UpdateInvoiceDto } from '../finance.service';

@Component({
  selector: 'app-invoice-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatIconModule, ReactiveFormsModule, FormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Invoice' : 'Create New Invoice' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="invoiceForm" class="invoice-form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Customer ID</mat-label>
            <input matInput formControlName="customerId" placeholder="Enter customer ID">
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="draft">Draft</mat-option>
              <mat-option value="sent">Sent</mat-option>
              <mat-option value="paid">Paid</mat-option>
              <mat-option value="overdue">Overdue</mat-option>
              <mat-option value="cancelled">Cancelled</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Due Date</mat-label>
            <input matInput [matDatepicker]="dueDatePicker" formControlName="dueDate">
            <mat-datepicker-toggle matSuffix [for]="dueDatePicker"></mat-datepicker-toggle>
            <mat-datepicker #dueDatePicker></mat-datepicker>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Payment Terms</mat-label>
            <input matInput formControlName="paymentTerms" placeholder="e.g., Net 30">
          </mat-form-field>
        </div>

        <div class="form-section">
          <h3>Invoice Items</h3>
          <div class="items-container">
            <div class="item-row" *ngFor="let item of items; let i = index">
              <mat-form-field appearance="outline">
                <mat-label>Product Name</mat-label>
                <input matInput [(ngModel)]="item.productName" placeholder="Enter product name">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Quantity</mat-label>
                <input matInput type="number" [(ngModel)]="item.quantity" (ngModelChange)="calculateItemTotal(i)">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Unit Price</mat-label>
                <input matInput type="number" [(ngModel)]="item.unitPrice" (ngModelChange)="calculateItemTotal(i)">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Tax Rate (%)</mat-label>
                <input matInput type="number" [(ngModel)]="item.taxRate" (ngModelChange)="calculateItemTotal(i)">
              </mat-form-field>
              
              <div class="item-total">
                <strong>Total: \${{ item.totalPrice | number:'1.2-2' }}</strong>
              </div>
              
              <button mat-icon-button (click)="removeItem(i)" color="warn">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            
            <button mat-stroked-button (click)="addItem()" class="add-item-btn">
              <mat-icon>add</mat-icon>
              Add Item
            </button>
          </div>
        </div>

        <div class="totals-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>\${{ subtotal | number:'1.2-2' }}</span>
          </div>
          <div class="total-row">
            <span>Tax:</span>
            <span>\${{ taxTotal | number:'1.2-2' }}</span>
          </div>
          <div class="total-row total-amount">
            <span>Total Amount:</span>
            <span>\${{ grandTotal | number:'1.2-2' }}</span>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Notes</mat-label>
          <textarea matInput formControlName="notes" rows="3" placeholder="Enter any additional notes"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!invoiceForm.valid">
        {{ data ? 'Update' : 'Create' }} Invoice
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .invoice-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 800px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .form-section {
      margin-top: 16px;
    }

    .form-section h3 {
      margin: 0 0 16px 0;
      color: var(--theme-on-surface);
      font-size: 1.1rem;
      font-weight: 500;
    }

    .items-container {
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      border-radius: 8px;
      padding: 16px;
    }

    .item-row {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }

    .item-row mat-form-field {
      flex: 1;
    }

    .item-total {
      min-width: 120px;
      text-align: right;
    }

    .add-item-btn {
      margin-top: 8px;
    }

    .totals-section {
      background: color-mix(in srgb, var(--theme-primary) 5%, transparent);
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .total-amount {
      font-size: 1.2rem;
      font-weight: 600;
      border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      padding-top: 8px;
      margin-top: 8px;
    }

    .full-width {
      width: 100%;
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }
  `]
})
export class InvoiceDialogComponent implements OnInit {
  invoiceForm: FormGroup;
  items: any[] = [];
  subtotal = 0;
  taxTotal = 0;
  grandTotal = 0;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InvoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Invoice | null
  ) {
    this.invoiceForm = this.fb.group({
      customerId: ['', Validators.required],
      status: ['draft', Validators.required],
      dueDate: [null, Validators.required],
      paymentTerms: [''],
      notes: ['']
    });
  }

  ngOnInit() {
    if (this.data) {
      this.invoiceForm.patchValue({
        customerId: this.data.customerId,
        status: this.data.status,
        dueDate: this.data.dueDate,
        paymentTerms: this.data.paymentTerms,
        notes: this.data.notes
      });
      
      this.items = this.data.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate || 0,
        totalPrice: item.totalPrice
      }));
    } else {
      this.addItem();
    }
    
    this.calculateTotals();
  }

  addItem() {
    this.items.push({
      productName: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      totalPrice: 0
    });
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.calculateTotals();
  }

  calculateItemTotal(index: number) {
    const item = this.items[index];
    const subtotal = item.quantity * item.unitPrice;
    const taxAmount = subtotal * (item.taxRate / 100);
    item.totalPrice = subtotal + taxAmount;
    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    this.taxTotal = this.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + (itemSubtotal * (item.taxRate / 100));
    }, 0);
    this.grandTotal = this.subtotal + this.taxTotal;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.invoiceForm.valid && this.items.length > 0) {
      const formValue = this.invoiceForm.value;
      
      const invoiceData = {
        customerId: formValue.customerId,
        status: formValue.status,
        dueDate: formValue.dueDate,
        items: this.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate
        })),
        paymentTerms: formValue.paymentTerms,
        notes: formValue.notes
      };

      this.dialogRef.close(invoiceData);
    }
  }
}
