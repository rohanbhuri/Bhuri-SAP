import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { CatalogueService } from '../../catalogue.service';
import { UploadUrlPipe } from '../../../../pipes/upload-url.pipe';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatBadgeModule,
    UploadUrlPipe
  ],
  template: `
    <div class="catalog-container">
      <div class="header">
        <h1>Product Catalog</h1>
        <div class="cart-info">
          <button mat-raised-button color="primary" (click)="viewCart()" [matBadge]="cartItemCount()" matBadgeColor="warn">
            <mat-icon>shopping_cart</mat-icon>
            View Cart
          </button>
        </div>
      </div>

      <div class="products-grid">
        <mat-card *ngFor="let product of products()" class="product-card">
          <div class="product-image">
            <img *ngIf="product.images?.length > 0" [src]="product.images[0] | uploadUrl" [alt]="product.name">
            <div *ngIf="!product.images?.length" class="no-image">
              <mat-icon>image</mat-icon>
            </div>
          </div>
          
          <mat-card-content>
            <h3 class="product-name">{{product.name}}</h3>
            <p class="product-description">{{product.description}}</p>
            <div class="product-price">
              <span class="price">\${{product.price}}</span>
              <span *ngIf="product.compareAtPrice" class="compare-price">\${{product.compareAtPrice}}</span>
            </div>
            <p class="product-sku">SKU: {{product.sku}}</p>
          </mat-card-content>
          
          <mat-card-actions>
            <div class="quantity-controls">
              <mat-form-field appearance="outline" class="quantity-field">
                <mat-label>Qty</mat-label>
                <input matInput type="number" min="1" [value]="getProductQuantity(product._id)" 
                       (input)="updateQuantity(product._id, $event)">
              </mat-form-field>
            </div>
            <button mat-raised-button color="primary" (click)="addToCart(product)">
              <mat-icon>add_shopping_cart</mat-icon>
              Add to Cart
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="cartItems().length > 0" class="cart-summary">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Cart Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="cart-items">
              <div *ngFor="let item of cartItems()" class="cart-item">
                <span class="item-name">{{item.productName}}</span>
                <span class="item-details">{{item.quantity}} × \${{item.unitPrice}}</span>
                <span class="item-total">\${{item.quantity * item.unitPrice}}</span>
                <button mat-icon-button (click)="removeFromCart(item.productId)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>
            <div class="cart-total">
              <strong>Total: \${{calculateCartTotal()}}</strong>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="clearCart()">Clear Cart</button>
            <button mat-raised-button color="accent" (click)="requestQuote()">
              Request Quote
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .catalog-container {
      padding: 1rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .product-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .product-image {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      margin-bottom: 1rem;
    }
    .product-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
    .no-image {
      color: #ccc;
    }
    .no-image mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }
    .product-name {
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }
    .product-description {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    .product-price {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2e7d32;
    }
    .compare-price {
      text-decoration: line-through;
      color: #999;
    }
    .product-sku {
      font-size: 0.8rem;
      color: #999;
      margin: 0;
    }
    mat-card-actions {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .quantity-controls {
      display: flex;
      align-items: center;
    }
    .quantity-field {
      width: 80px;
    }
    .cart-summary {
      position: sticky;
      bottom: 1rem;
    }
    .cart-items {
      max-height: 200px;
      overflow-y: auto;
    }
    .cart-item {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: 1rem;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    .cart-item:last-child {
      border-bottom: none;
    }
    .item-name {
      font-weight: 500;
    }
    .item-details {
      color: #666;
      font-size: 0.9rem;
    }
    .item-total {
      font-weight: bold;
      text-align: right;
    }
    .cart-total {
      text-align: right;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px solid #ddd;
      font-size: 1.1rem;
    }
  `]
})
export class ProductCatalogComponent implements OnInit {
  private catalogueService = inject(CatalogueService);
  private snackBar = inject(MatSnackBar);
  
  products = signal<any[]>([]);
  cartItems = signal<any[]>([]);
  quantities = signal<{[key: string]: number}>({});

  ngOnInit() {
    this.loadProducts();
    this.loadCart();
  }

  loadProducts() {
    this.catalogueService.getProducts({ limit: 100 }).subscribe({
      next: (result: any) => {
        this.products.set(result.items.filter((p: any) => p.isPublished));
      },
      error: () => {
        this.snackBar.open('Failed to load products', 'Close', { duration: 3000 });
      }
    });
  }

  loadCart() {
    const saved = localStorage.getItem('enquiry_cart');
    if (saved) {
      this.cartItems.set(JSON.parse(saved));
    }
  }

  getProductQuantity(productId: string): number {
    return this.quantities()[productId] || 1;
  }

  updateQuantity(productId: string, event: any) {
    const quantity = parseInt(event.target.value) || 1;
    this.quantities.update(q => ({ ...q, [productId]: quantity }));
  }

  addToCart(product: any) {
    const quantity = this.getProductQuantity(product._id);
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
    this.snackBar.open(`${product.name} added to cart`, 'Close', { duration: 2000 });
  }

  removeFromCart(productId: string) {
    const items = this.cartItems().filter(item => item.productId !== productId);
    this.cartItems.set(items);
    this.saveCart();
  }

  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem('enquiry_cart');
  }

  calculateCartTotal(): number {
    return this.cartItems().reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  cartItemCount(): number {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  saveCart() {
    localStorage.setItem('enquiry_cart', JSON.stringify(this.cartItems()));
  }

  viewCart() {
    window.location.href = '/enquiry';
  }

  requestQuote() {
    if (this.cartItems().length === 0) {
      this.snackBar.open('Cart is empty', 'Close', { duration: 2000 });
      return;
    }
    window.location.href = '/enquiry';
  }
}