import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CatalogueService } from '../catalogue.service';
import { ProductDialogComponent } from '../dialogs/product-dialog.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Products</h2>
        <button mat-raised-button color="primary" (click)="openProductDialog()">
          <mat-icon>add</mat-icon>
          Add Product
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="products()" class="catalogue-table">
          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef>Product</th>
            <td mat-cell *matCellDef="let product">
              <div class="product-info">
                <div class="product-image">
                  <img *ngIf="product.images?.length" [src]="product.images[0]" [alt]="product.name">
                  <mat-icon *ngIf="!product.images?.length">image</mat-icon>
                </div>
                <div class="product-details">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-sku">SKU: {{ product.sku }}</div>
                </div>
                <mat-chip *ngIf="product.model3d" class="model-3d-badge">3D</mat-chip>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let product">{{ getCategoryName(product.categoryId) || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Price</th>
            <td mat-cell *matCellDef="let product">
              <span class="price-display">{{ product.price | currency:product.currency }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let product">
              <mat-chip [color]="product.isPublished ? 'primary' : 'warn'">
                {{ product.isPublished ? 'Published' : 'Draft' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let product">
              <button mat-icon-button [matMenuTriggerFor]="productMenu" class="action-button">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #productMenu="matMenu">
                <button mat-menu-item (click)="editProduct(product)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="duplicateProduct(product)">
                  <mat-icon>content_copy</mat-icon>
                  <span>Duplicate</span>
                </button>
                <button mat-menu-item (click)="togglePublish(product)">
                  <mat-icon>{{ product.isPublished ? 'visibility_off' : 'visibility' }}</mat-icon>
                  <span>{{ product.isPublished ? 'Unpublish' : 'Publish' }}</span>
                </button>
                <button mat-menu-item (click)="deleteProduct(product._id)" class="text-red-600">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="productColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: productColumns"></tr>
        </table>
      </div>
    </div>
  `
})
export class ProductsPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private catalogueService = inject(CatalogueService);

  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  productColumns = ['product', 'category', 'price', 'status', 'actions'];

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.catalogueService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }

  loadCategories() {
    this.catalogueService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories().find(c => c._id === categoryId);
    return category?.name || '';
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '800px',
      data: { categories: this.categories() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(product: any) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '800px',
      data: { product, categories: this.categories() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  duplicateProduct(product: any) {
    const duplicatedProduct = {
      ...product,
      _id: undefined,
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
      slug: `${product.slug}-copy`,
      isPublished: false
    };

    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '800px',
      data: { product: duplicatedProduct, categories: this.categories() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  togglePublish(product: any) {
    this.catalogueService.updateProduct(product._id, { 
      isPublished: !product.isPublished 
    }).subscribe(() => {
      this.loadProducts();
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.catalogueService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}