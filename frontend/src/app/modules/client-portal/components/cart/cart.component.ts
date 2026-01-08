import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ClientPortalService } from '../../client-portal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="cart-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Shopping Cart</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (cartItems().length === 0) {
            <div class="empty-cart">
              <mat-icon>shopping_cart</mat-icon>
              <p>Your cart is empty</p>
            </div>
          } @else {
            <table mat-table [dataSource]="cartItems()" class="cart-table">
              <ng-container matColumnDef="product">
                <th mat-header-cell *matHeaderCellDef>Product</th>
                <td mat-cell *matCellDef="let item">{{ item.productName }}</td>
              </ng-container>

              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef>Price</th>
                <td mat-cell *matCellDef="let item">{{ item.unitPrice | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef>Quantity</th>
                <td mat-cell *matCellDef="let item">
                  <mat-form-field class="quantity-field">
                    <input matInput type="number" [(ngModel)]="item.quantity" 
                           (change)="updateQuantity(item.productId, item.quantity)" min="1">
                  </mat-form-field>
                </td>
              </ng-container>

              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef>Total</th>
                <td mat-cell *matCellDef="let item">{{ item.unitPrice * item.quantity | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let item">
                  <button mat-icon-button color="warn" (click)="removeItem(item.productId)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="cart-summary">
              <h3>Total: {{ getTotal() | currency }}</h3>
              <button mat-raised-button color="primary" (click)="submitEnquiry()">
                <mat-icon>send</mat-icon>
                Submit Enquiry
              </button>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .empty-cart {
      text-align: center;
      padding: 48px;
      color: #999;
    }
    .empty-cart mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }
    .cart-table {
      width: 100%;
      margin: 24px 0;
    }
    .quantity-field {
      width: 80px;
    }
    .cart-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-top: 24px;
    }
  `]
})
export class CartComponent implements OnInit {
  private clientPortalService = inject(ClientPortalService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  cartItems = signal<any[]>([]);
  displayedColumns = ['product', 'price', 'quantity', 'total', 'actions'];

  ngOnInit() {
    this.loadCart();
    this.clientPortalService.cart$.subscribe(cart => {
      this.cartItems.set(cart);
    });
  }

  loadCart() {
    this.cartItems.set(this.clientPortalService.getCart());
  }

  updateQuantity(productId: string, quantity: number) {
    this.clientPortalService.updateCartItem(productId, quantity);
  }

  removeItem(productId: string) {
    this.clientPortalService.removeFromCart(productId);
  }

  getTotal(): number {
    return this.cartItems().reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  submitEnquiry() {
    const clientData = {
      clientId: localStorage.getItem('clientId'),
      customerName: localStorage.getItem('userName'),
      customerEmail: localStorage.getItem('userEmail')
    };

    this.clientPortalService.submitEnquiry(clientData).subscribe({
      next: () => {
        this.snackBar.open('Enquiry submitted successfully', 'Close', { duration: 3000 });
        this.clientPortalService.clearCart();
        this.router.navigate(['/client-portal/quotations']);
      },
      error: () => {
        this.snackBar.open('Failed to submit enquiry', 'Close', { duration: 3000 });
      }
    });
  }
}
