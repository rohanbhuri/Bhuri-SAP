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
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>Image</th>
            <td mat-cell *matCellDef="let product">
              <div class="product-image-cell">
                <img *ngIf="product.images?.length" [src]="product.images[0]" [alt]="product.name">
                <mat-icon *ngIf="!product.images?.length">image</mat-icon>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef>Product</th>
            <td mat-cell *matCellDef="let product">
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-code">Code: {{ product.productCode }}</div>
                <div class="product-variations" *ngIf="product.variations?.length">
                  {{ product.variations.length }} variation(s)
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="collection">
            <th mat-header-cell *matHeaderCellDef>Collection</th>
            <td mat-cell *matCellDef="let product">{{ getCollectionName(product.collectionId) || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let product">{{ getCategoryName(product.categoryId) || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="tags">
            <th mat-header-cell *matHeaderCellDef>Tags</th>
            <td mat-cell *matCellDef="let product">
              <div class="tags-cell">
                <mat-chip *ngFor="let tag of product.tags?.slice(0, 2)" class="tag-chip">{{ tag }}</mat-chip>
                <span *ngIf="product.tags?.length > 2" class="more-tags">+{{ product.tags.length - 2 }}</span>
              </div>
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
  `,
  styles: [`
    .tab-content {
      padding: 1.5rem;
    }
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .tab-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
    .table-container {
      overflow-x: auto;
    }
    .product-image-cell {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      overflow: hidden;
      background: #f5f5f5;
    }
    .product-image-cell img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .product-image-cell mat-icon {
      color: #999;
    }
    .product-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .product-name {
      font-weight: 500;
      color: #333;
    }
    .product-code {
      font-size: 0.875rem;
      color: #666;
    }
    .product-variations {
      font-size: 0.75rem;
      color: #2196F3;
      margin-top: 0.25rem;
    }
    .tags-cell {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .tag-chip {
      font-size: 0.75rem;
      min-height: 24px;
      padding: 0 8px;
    }
    .more-tags {
      font-size: 0.75rem;
      color: #666;
    }
  `]
})
export class ProductsPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private catalogueService = inject(CatalogueService);

  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  collections = signal<any[]>([]);
  productColumns = ['image', 'product', 'collection', 'category', 'tags', 'status', 'actions'];

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadCollections();
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

  loadCollections() {
    this.catalogueService.getCollections().subscribe(collections => {
      this.collections.set(collections);
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories().find(c => c._id === categoryId);
    return category?.name || '';
  }

  getCollectionName(collectionId: string): string {
    const collection = this.collections().find(c => c._id === collectionId);
    return collection?.name || '';
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '1000px',
      maxHeight: '90vh',
      data: { categories: this.categories(), collections: this.collections() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(product: any) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '1000px',
      maxHeight: '90vh',
      data: { product, categories: this.categories(), collections: this.collections() }
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
      productCode: `${product.productCode}-COPY`,
      slug: `${product.slug}-copy`,
      isPublished: false
    };

    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '1000px',
      maxHeight: '90vh',
      data: { product: duplicatedProduct, categories: this.categories(), collections: this.collections() }
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