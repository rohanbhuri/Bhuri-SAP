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
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Order, OrderStatus, OrderPriority, CreateOrderDto, UpdateOrderDto } from '../order-management.service';

@Component({
  selector: 'app-order-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatIconModule, ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Order' : 'Create New Order' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="orderForm" class="order-form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Customer ID</mat-label>
            <input matInput formControlName="customerId" placeholder="Enter customer ID">
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="pending">Pending</mat-option>
              <mat-option value="confirmed">Confirmed</mat-option>
              <mat-option value="processing">Processing</mat-option>
              <mat-option value="shipped">Shipped</mat-option>
              <mat-option value="delivered">Delivered</mat-option>
              <mat-option value="cancelled">Cancelled</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="low">Low</mat-option>
              <mat-option value="medium">Medium</mat-option>
              <mat-option value="high">High</mat-option>
              <mat-option value="urgent">Urgent</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Expected Delivery Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="expectedDeliveryDate">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>

        <div class="form-section">
          <h3>Shipping Address</h3>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Street</mat-label>
              <input matInput formControlName="shippingStreet" placeholder="Enter street address">
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>City</mat-label>
              <input matInput formControlName="shippingCity" placeholder="Enter city">
            </mat-form-field>
          </div>
          
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>State</mat-label>
              <input matInput formControlName="shippingState" placeholder="Enter state">
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>ZIP Code</mat-label>
              <input matInput formControlName="shippingZipCode" placeholder="Enter ZIP code">
            </mat-form-field>
          </div>
          
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Country</mat-label>
              <input matInput formControlName="shippingCountry" placeholder="Enter country">
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="shippingPhone" placeholder="Enter phone number">
            </mat-form-field>
          </div>
        </div>

        <div class="form-section">
          <h3>Billing Address</h3>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Street</mat-label>
              <input matInput formControlName="billingStreet" placeholder="Enter street address">
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>City</mat-label>
              <input matInput formControlName="billingCity" placeholder="Enter city">
            </mat-form-field>
          </div>
          
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>State</mat-label>
              <input matInput formControlName="billingState" placeholder="Enter state">
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>ZIP Code</mat-label>
              <input matInput formControlName="billingZipCode" placeholder="Enter ZIP code">
            </mat-form-field>
          </div>
          
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Country</mat-label>
              <input matInput formControlName="billingCountry" placeholder="Enter country">
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="billingPhone" placeholder="Enter phone number">
            </mat-form-field>
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
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!orderForm.valid">
        {{ data ? 'Update' : 'Create' }} Order
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .order-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 600px;
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

    .full-width {
      width: 100%;
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }
  `]
})
export class OrderDialogComponent implements OnInit {
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order | null
  ) {
    this.orderForm = this.fb.group({
      customerId: ['', Validators.required],
      status: ['pending', Validators.required],
      priority: ['medium', Validators.required],
      expectedDeliveryDate: [null],
      shippingStreet: ['', Validators.required],
      shippingCity: ['', Validators.required],
      shippingState: ['', Validators.required],
      shippingZipCode: ['', Validators.required],
      shippingCountry: ['', Validators.required],
      shippingPhone: [''],
      billingStreet: ['', Validators.required],
      billingCity: ['', Validators.required],
      billingState: ['', Validators.required],
      billingZipCode: ['', Validators.required],
      billingCountry: ['', Validators.required],
      billingPhone: [''],
      notes: ['']
    });
  }

  ngOnInit() {
    if (this.data) {
      this.orderForm.patchValue({
        customerId: this.data.customerId,
        status: this.data.status,
        priority: this.data.priority,
        expectedDeliveryDate: this.data.expectedDeliveryDate,
        shippingStreet: this.data.shippingAddress.street,
        shippingCity: this.data.shippingAddress.city,
        shippingState: this.data.shippingAddress.state,
        shippingZipCode: this.data.shippingAddress.zipCode,
        shippingCountry: this.data.shippingAddress.country,
        shippingPhone: this.data.shippingAddress.phone,
        billingStreet: this.data.billingAddress.street,
        billingCity: this.data.billingAddress.city,
        billingState: this.data.billingAddress.state,
        billingZipCode: this.data.billingAddress.zipCode,
        billingCountry: this.data.billingAddress.country,
        billingPhone: this.data.billingAddress.phone,
        notes: this.data.notes
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      
      const orderData = {
        customerId: formValue.customerId,
        status: formValue.status,
        priority: formValue.priority,
        expectedDeliveryDate: formValue.expectedDeliveryDate,
        items: this.data?.items || [], // For now, we'll use existing items or empty array
        shippingAddress: {
          street: formValue.shippingStreet,
          city: formValue.shippingCity,
          state: formValue.shippingState,
          zipCode: formValue.shippingZipCode,
          country: formValue.shippingCountry,
          phone: formValue.shippingPhone
        },
        billingAddress: {
          street: formValue.billingStreet,
          city: formValue.billingCity,
          state: formValue.billingState,
          zipCode: formValue.billingZipCode,
          country: formValue.billingCountry,
          phone: formValue.billingPhone
        },
        notes: formValue.notes
      };

      this.dialogRef.close(orderData);
    }
  }
}
