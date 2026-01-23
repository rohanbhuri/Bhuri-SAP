import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { CatalogueService } from '../catalogue.service';
import { ProductDialogComponent } from '../dialogs/product-dialog.component';
import { UploadUrlPipe } from '../../../pipes/upload-url.pipe';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    UploadUrlPipe
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Products</h2>
        <div class="header-actions">
          <button mat-button [matMenuTriggerFor]="importMenu">
            <mat-icon>upload</mat-icon>
            Import/Export
          </button>
          <mat-menu #importMenu="matMenu">
            <button mat-menu-item (click)="downloadTemplate()">
              <mat-icon>download</mat-icon>
              <span>Download CSV Template</span>
            </button>
            <button mat-menu-item (click)="fileInput.click()">
              <mat-icon>upload_file</mat-icon>
              <span>Import Products</span>
            </button>
            <button mat-menu-item (click)="exportProducts()">
              <mat-icon>file_download</mat-icon>
              <span>Export All Products</span>
            </button>
          </mat-menu>
          <input #fileInput type="file" accept=".csv" (change)="onFileSelected($event)" style="display:none">
          <button mat-raised-button color="primary" (click)="openProductDialog()">
            <mat-icon>add</mat-icon>
            Add Product
          </button>
        </div>
      </div>

      <div class="filters-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search by name or code</mat-label>
          <input matInput [(ngModel)]="searchQuery" (ngModelChange)="onFilterChange()" placeholder="Enter name or code...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="selectedCategoryId" (selectionChange)="onFilterChange()">
            <mat-option value="">All Categories</mat-option>
            <mat-option *ngFor="let category of categories()" [value]="category._id">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Collection</mat-label>
          <mat-select [(ngModel)]="selectedCollectionId" (selectionChange)="onFilterChange()">
            <mat-option value="">All Collections</mat-option>
            <mat-option *ngFor="let collection of collections()" [value]="collection._id">
              {{ collection.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Designer</mat-label>
          <mat-select [(ngModel)]="selectedDesignerId" (selectionChange)="onFilterChange()">
            <mat-option value="">All Designers</mat-option>
            <mat-option *ngFor="let designer of designers()" [value]="designer._id">
              {{ designer.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Exclusivity</mat-label>
          <mat-select [(ngModel)]="selectedIsExclusive" (selectionChange)="onFilterChange()">
            <mat-option [value]="null">All Products</mat-option>
            <mat-option [value]="true">Exclusive Only</mat-option>
            <mat-option [value]="false">Non-Exclusive Only</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Featured</mat-label>
          <mat-select [(ngModel)]="selectedIsFeatured" (selectionChange)="onFilterChange()">
            <mat-option [value]="null">All Products</mat-option>
            <mat-option [value]="true">Featured Only</mat-option>
            <mat-option [value]="false">Non-Featured Only</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="selectedIsPublished" (selectionChange)="onFilterChange()">
            <mat-option [value]="null">All Status</mat-option>
            <mat-option [value]="true">Published</mat-option>
            <mat-option [value]="false">Draft</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-stroked-button (click)="resetFilters()">Reset</button>
        <button mat-stroked-button color="primary" [disabled]="!hasActiveFilters" (click)="exportFilteredProducts()">
          <mat-icon>download</mat-icon>
          Export products from filter
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="products()" class="catalogue-table">
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>Image</th>
            <td mat-cell *matCellDef="let product">
              <div class="product-image-cell">
                <img *ngIf="product.imageGallery?.length" [src]="product.imageGallery[0] | uploadUrl" [alt]="product.name">
                <mat-icon *ngIf="!product.imageGallery?.length">image</mat-icon>
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
              <div class="status-cell">
                <mat-chip [color]="product.isPublished ? 'primary' : 'warn'">
                  {{ product.isPublished ? 'Published' : 'Draft' }}
                </mat-chip>
                <mat-icon *ngIf="product.isFeatured" class="featured-icon" title="Featured Product">star</mat-icon>
              </div>
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
        
        <mat-paginator
          [length]="totalProducts()"
          [pageSize]="pageSize()"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          aria-label="Select page">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .tab-content {
      padding: 1.5rem;
    }
    .filters-container {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .filters-container mat-form-field {
      min-width: 200px;
    }
    .search-field {
      flex: 1;
      min-width: 300px !important;
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
    .header-actions {
      display: flex;
      gap: 0.5rem;
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
    .status-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .featured-icon {
      color: #ffd700;
    }
  `]
})
export class ProductsPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private catalogueService = inject(CatalogueService);
  private snackBar = inject(MatSnackBar);

  products = signal<any[]>([]);
  totalProducts = signal<number>(0);
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);
  
  searchQuery = '';
  selectedCategoryId = '';
  selectedCollectionId = '';
  selectedDesignerId = '';
  selectedIsExclusive: boolean | null = null;
  selectedIsFeatured: boolean | null = null;
  selectedIsPublished: boolean | null = null;

  categories = signal<any[]>([]);
  collections = signal<any[]>([]);
  designers = signal<any[]>([]);
  productColumns = ['image', 'product', 'collection', 'category', 'tags', 'status', 'actions'];

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadCollections();
    this.loadDesigners();
  }

  loadProducts() {
    const params: any = {
      page: this.pageIndex() + 1,
      limit: this.pageSize(),
      search: this.searchQuery,
      categoryId: this.selectedCategoryId,
      collectionId: this.selectedCollectionId,
      designerId: this.selectedDesignerId
    };

    if (this.selectedIsExclusive !== null) {
      params.isExclusive = this.selectedIsExclusive;
    }
    if (this.selectedIsFeatured !== null) {
      params.isFeatured = this.selectedIsFeatured;
    }
    if (this.selectedIsPublished !== null) {
      params.isPublished = this.selectedIsPublished;
    }

    this.catalogueService.getProducts(params).subscribe(result => {
      this.products.set(result.items);
      this.totalProducts.set(result.total);
    });
  }

  onFilterChange() {
    this.pageIndex.set(0);
    this.loadProducts();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts();
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategoryId = '';
    this.selectedCollectionId = '';
    this.selectedDesignerId = '';
    this.selectedIsExclusive = null;
    this.selectedIsFeatured = null;
    this.selectedIsPublished = null;
    this.pageIndex.set(0);
    this.loadProducts();
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

  loadDesigners() {
    this.catalogueService.getDesigners().subscribe(designers => {
      this.designers.set(designers);
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
      data: { categories: this.categories(), collections: this.collections(), designers: this.designers() }
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
      data: { product, categories: this.categories(), collections: this.collections(), designers: this.designers() }
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
      data: { product: duplicatedProduct, categories: this.categories(), collections: this.collections(), designers: this.designers() }
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

  downloadTemplate() {
    this.catalogueService.downloadProductTemplate().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'product-import-template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.catalogueService.importProducts(file).subscribe({
        next: (result) => {
          this.snackBar.open(`Import complete: ${result.success} succeeded, ${result.failed} failed`, 'Close', { duration: 5000 });
          if (result.errors.length > 0) {
            console.error('Import errors:', result.errors);
          }
          this.loadProducts();
        },
        error: (err) => {
          this.snackBar.open('Import failed: ' + err.message, 'Close', { duration: 5000 });
        }
      });
    }
    event.target.value = '';
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.searchQuery ||
      this.selectedCategoryId ||
      this.selectedCollectionId ||
      this.selectedDesignerId ||
      this.selectedIsExclusive !== null ||
      this.selectedIsFeatured !== null ||
      this.selectedIsPublished !== null
    );
  }

  exportFilteredProducts() {
    const params: any = {
      search: this.searchQuery,
      categoryId: this.selectedCategoryId,
      collectionId: this.selectedCollectionId,
      designerId: this.selectedDesignerId
    };

    if (this.selectedIsExclusive !== null) {
      params.isExclusive = this.selectedIsExclusive;
    }
    if (this.selectedIsFeatured !== null) {
      params.isFeatured = this.selectedIsFeatured;
    }
    if (this.selectedIsPublished !== null) {
      params.isPublished = this.selectedIsPublished;
    }

    this.catalogueService.exportProducts(params).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'filtered_products.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  exportProducts() {
    this.catalogueService.exportProducts().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}