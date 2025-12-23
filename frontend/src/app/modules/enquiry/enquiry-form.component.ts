import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { EnquiryService } from './enquiry.service';

@Component({
  selector: 'app-enquiry-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="enquiry-container">
      <mat-card class="enquiry-card">
        <mat-card-header>
          <mat-card-title>Request Quote</mat-card-title>
          <mat-card-subtitle>Get a personalized quotation for your selected items</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="enquiryForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="customerName" required>
                <mat-error>Name is required</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="customerEmail" required>
                <mat-error>Valid email is required</mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Phone</mat-label>
                <input matInput formControlName="customerPhone">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Company</mat-label>
                <input matInput formControlName="company">
              </mat-form-field>
            </div>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Message</mat-label>
              <textarea matInput rows="4" formControlName="message" 
                placeholder="Tell us about your requirements..."></textarea>
            </mat-form-field>
            
            <div class="cart-items" *ngIf="cartItems().length > 0">
              <h3>Selected Items</h3>
              <div class="item" *ngFor="let item of cartItems()">
                <div class="item-info">
                  <strong>{{item.productName}}</strong>
                  <span>Qty: {{item.quantity}} × \${{item.unitPrice}}</span>
                </div>
                <button type="button" mat-icon-button (click)="removeItem(item.productId)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              <div class="total">
                <strong>Total: \${{calculateTotal()}}</strong>
              </div>
            </div>
          </form>
        </mat-card-content>
        
        <mat-card-actions align="end">
          <button mat-button type="button" (click)="clearCart()">Clear Cart</button>
          <button mat-raised-button color="primary" 
                  [disabled]="enquiryForm.invalid || cartItems().length === 0"
                  (click)="onSubmit()">
            Submit Enquiry
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .enquiry-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
    }
    .enquiry-card {
      padding: 1rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .form-row mat-form-field {
      flex: 1;
    }
    .full-width {
      width: 100%;
    }
    .cart-items {
      margin: 1rem 0;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    .item:last-child {
      border-bottom: none;
    }
    .item-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .total {
      text-align: right;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px solid #ddd;
    }
  `]
})
export class EnquiryFormComponent {
  enquiryForm: FormGroup;
  cartItems = signal<any[]>([]);

  constructor(
    private fb: FormBuilder,
    private enquiryService: EnquiryService,
    private snackBar: MatSnackBar
  ) {
    this.enquiryForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: [''],
      company: [''],
      message: ['']
    });

    this.loadCartItems();
  }

  loadCartItems() {
    const saved = localStorage.getItem('enquiry_cart');
    if (saved) {
      this.cartItems.set(JSON.parse(saved));
    }
  }

  addToCart(product: any, quantity: number = 1) {
    const items = this.cartItems();
    const existingIndex = items.findIndex(item => item.productId === product._id);
    
    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        productId: product._id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        specifications: ''
      });
    }
    
    this.cartItems.set([...items]);
    this.saveCart();
  }

  removeItem(productId: string) {
    const items = this.cartItems().filter(item => item.productId !== productId);
    this.cartItems.set(items);
    this.saveCart();
  }

  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem('enquiry_cart');
  }

  calculateTotal(): number {
    return this.cartItems().reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  saveCart() {
    localStorage.setItem('enquiry_cart', JSON.stringify(this.cartItems()));
  }

  onSubmit() {
    if (this.enquiryForm.valid && this.cartItems().length > 0) {
      const enquiryData = {
        ...this.enquiryForm.value,
        items: this.cartItems(),
        source: 'website'
      };

      this.enquiryService.createEnquiry(enquiryData).subscribe({
        next: (response) => {
          this.snackBar.open('Enquiry submitted successfully! We will get back to you soon.', 'Close', {
            duration: 5000
          });
          this.enquiryForm.reset();
          this.clearCart();
        },
        error: (error) => {
          this.snackBar.open('Failed to submit enquiry. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
}