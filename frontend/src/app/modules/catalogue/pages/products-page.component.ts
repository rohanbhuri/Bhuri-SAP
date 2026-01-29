import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CatalogueService } from '../catalogue.service';
import { MatListModule } from '@angular/material/list';
import { ProductDialogComponent } from '../dialogs/product-dialog.component';
import { UploadUrlPipe } from '../../../pipes/upload-url.pipe';
import { AuthService } from '../../../services/auth.service';
import { UserManagementService } from '../../user-management/user-management.service';

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
    MatProgressSpinnerModule,
    MatListModule,
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

      <div class="import-overlay" *ngIf="isValidating()">
        <div class="overlay-content">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Validating CSV file...</p>
        </div>
      </div>

      <div class="validation-summary" *ngIf="isValidated() && validationResults()">
        <div class="summary-card" [class.has-errors]="validationResults().errors.length > 0">
          <div class="summary-header">
            <h3>Import Validation Results</h3>
            <button mat-icon-button (click)="resetImport()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <div class="summary-stats" *ngIf="validationResults().errors.length === 0">
            <div class="stat-item">
              <span class="stat-label">Total Products:</span>
              <span class="stat-value">{{ validationResults().totalRows }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">To Add:</span>
              <span class="stat-value text-green-600">{{ validationResults().toAdd }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">To Update:</span>
              <span class="stat-value text-blue-600">{{ validationResults().toUpdate }}</span>
            </div>
          </div>

          <div class="error-list" *ngIf="validationResults().errors.length > 0">
            <div class="error-header text-red-600">
              <mat-icon>error_outline</mat-icon>
              <span>Found {{ validationResults().errors.length }} errors in CSV:</span>
            </div>
            <mat-list dense>
              <mat-list-item *ngFor="let error of validationResults().errors">
                <mat-icon matListItemIcon class="text-red-500">circle</mat-icon>
                <div matListItemTitle>{{ error }}</div>
              </mat-list-item>
            </mat-list>
            <p class="error-hint">Please correct these errors in your CSV file and try uploading again.</p>
          </div>

          <div class="summary-actions">
            <button mat-button (click)="resetImport()">Cancel</button>
            <button mat-raised-button color="primary" 
                    *ngIf="validationResults().errors.length === 0" 
                    (click)="proceedWithImport()"
                    [disabled]="isImporting()">
              <mat-icon *ngIf="!isImporting()">check</mat-icon>
              <mat-spinner diameter="20" *ngIf="isImporting()"></mat-spinner>
              Confirm & Import {{ validationResults().totalRows }} Products
            </button>
          </div>
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
                <img *ngIf="getProductImage(product)" [src]="getProductImage(product) | uploadUrl" [alt]="product.name">
                <mat-icon *ngIf="!getProductImage(product)">image</mat-icon>
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

          <ng-container matColumnDef="tracking">
            <th mat-header-cell *matHeaderCellDef>History</th>
            <td mat-cell *matCellDef="let product">
              <div class="tracking-info" [matMenuTriggerFor]="historyMenu" style="cursor: pointer;">
                <div class="tracking-item" title="Created At: {{ product.createdAt | date:'medium' }}">
                  <mat-icon class="tracking-icon">add_circle_outline</mat-icon>
                  <span>{{ getUserName(product.createdBy) || 'System' }}</span>
                  <small>{{ product.createdAt | date:'shortDate' }}</small>
                </div>
                <!-- Show last update if it exists and is different from creation -->
                <div class="tracking-item" *ngIf="product.changeLog?.length > 1" title="Last Updated At: {{ product.updatedAt | date:'medium' }}">
                  <mat-icon class="tracking-icon">history</mat-icon>
                  <span>{{ getUserName(product.updatedBy) || 'System' }}</span>
                  <small>{{ product.updatedAt | date:'shortDate' }}</small>
                </div>
                <!-- Fallback for old data without changeLog but with updatedAt -->
                <div class="tracking-item" *ngIf="(!product.changeLog || product.changeLog.length <= 1) && product.updatedBy && product.updatedBy !== product.createdBy" title="Updated At: {{ product.updatedAt | date:'medium' }}">
                  <mat-icon class="tracking-icon">edit_note</mat-icon>
                  <span>{{ getUserName(product.updatedBy) || 'System' }}</span>
                  <small>{{ product.updatedAt | date:'shortDate' }}</small>
                </div>
              </div>
              <mat-menu #historyMenu="matMenu">
                <div class="history-menu-container" (click)="$event.stopPropagation()">
                  <div class="history-header">
                    <mat-icon>history</mat-icon>
                    <span>Change History</span>
                  </div>
                  <div class="history-list">
                    <div *ngIf="!product.changeLog?.length" class="no-history">No detailed history available</div>
                    <div *ngFor="let log of product.changeLog?.slice()?.reverse()" class="history-item-detail">
                      <div class="history-marker" [class.created]="log.action === 'created'"></div>
                      <div class="history-content">
                        <div class="history-user">{{ getUserName(log.userId) || 'System' }}</div>
                        <div class="history-meta">
                          <span class="history-action" [class.action-created]="log.action === 'created'">{{ log.action }}</span>
                          <span class="history-time">{{ log.timestamp | date:'medium' }}</span>
                        </div>
                        <div class="history-details" *ngIf="log.details">{{ log.details }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </mat-menu>
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
    .tracking-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.75rem;
      color: #757575;
    }
    .tracking-item {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
    .tracking-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #9e9e9e;
    }
    .tracking-item span {
      font-weight: 500;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tracking-item small {
      color: #bdbdbd;
    }
    .history-menu-container {
      padding: 1rem;
      min-width: 300px;
      max-height: 400px;
      overflow-y: auto;
    }
    .history-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    .history-header mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .history-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .history-item-detail {
      display: flex;
      gap: 1rem;
      position: relative;
    }
    .history-marker {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #e0e0e0;
      margin-top: 4px;
      flex-shrink: 0;
      border: 2px solid #fff;
      box-shadow: 0 0 0 1px #e0e0e0;
    }
    .history-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .history-user {
      font-weight: 500;
      font-size: 0.9rem;
      color: #333;
    }
    .history-meta {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      font-size: 0.75rem;
      color: #9e9e9e;
    }
    .history-details {
      font-size: 0.75rem;
      color: #666;
      background: #fdfdfd;
      padding: 4px 8px;
      border-radius: 4px;
      margin-top: 4px;
      border-left: 2px solid #eee;
    }
    .history-action {
      text-transform: capitalize;
      padding: 2px 6px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .history-action.action-created {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .history-marker.created {
      background: #4caf50;
      box-shadow: 0 0 0 1px #4caf50;
    }
    .no-history {
      padding: 1rem;
      text-align: center;
      color: #999;
      font-style: italic;
    }
    .import-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .overlay-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .validation-summary {
      margin-bottom: 2rem;
      animation: slideDown 0.3s ease-out;
    }
    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .summary-card {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .summary-card.has-errors {
      border-color: #ffcdd2;
      background: #fff8f8;
    }
    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .summary-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
    }
    .summary-stats {
      display: flex;
      gap: 3rem;
      margin-bottom: 2rem;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
    }
    .error-list {
      margin-bottom: 1.5rem;
    }
    .error-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }
    .error-hint {
      font-size: 0.875rem;
      color: #666;
      margin-top: 1rem;
    }
    .summary-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      border-top: 1px solid #dee2e6;
      padding-top: 1.5rem;
    }
    .text-green-600 { color: #16a34a; }
    .text-blue-600 { color: #2563eb; }
    .text-red-600 { color: #dc2626; }
    .text-red-500 { color: #ef4444; }
  `]
})
export class ProductsPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private catalogueService = inject(CatalogueService);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private userService = inject(UserManagementService);

  currentUser = toSignal(this.authService.currentUser$);
  isSuperAdmin = computed(() => {
    const user = this.currentUser();
    return user?.roles?.some((r: any) => r.type === 'super_admin') || false;
  });

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
  users = signal<any[]>([]);
  
  isValidating = signal(false);
  isImporting = signal(false);
  isValidated = signal(false);
  validationResults = signal<any>(null);
  selectedFile: File | null = null;

  productColumns = ['image', 'product', 'collection', 'category', 'tags', 'status', 'tracking', 'actions'];

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadCollections();
    this.loadDesigners();
    this.loadUsers();
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

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users.set(users);
    });
  }

  getUserName(userId: string): string {
    if (!userId) return '';
    const user = this.users().find(u => u._id === userId || u.id === userId || (u._id && u._id.toString() === userId));
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories().find(c => c._id === categoryId);
    return category?.name || '';
  }

  getCollectionName(collectionId: string): string {
    const collection = this.collections().find(c => c._id === collectionId);
    return collection?.name || '';
  }

  getProductImage(product: any): string | null {
    if (product.featuredImage && product.featuredImage.trim() !== '') {
      return product.featuredImage;
    }
    if (product.imageGallery && product.imageGallery.length > 0 && product.imageGallery[0]?.trim() !== '') {
      return product.imageGallery[0];
    }
    return null;
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
      createdBy: undefined,
      updatedBy: undefined,
      changeLog: [],
      createdAt: undefined,
      updatedAt: undefined,
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
      this.selectedFile = file;
      this.isValidating.set(true);
      this.isValidated.set(false);
      this.validationResults.set(null);

      this.catalogueService.validateProducts(file).subscribe({
        next: (result) => {
          this.validationResults.set(result);
          this.isValidating.set(false);
          this.isValidated.set(true);
          if (result.errors.length > 0) {
            this.snackBar.open('CSV has validation errors. Please check the summary.', 'Close', { duration: 5000 });
          }
        },
        error: (err) => {
          this.isValidating.set(false);
          this.snackBar.open('Validation failed: ' + err.message, 'Close', { duration: 5000 });
        }
      });
    }
    event.target.value = '';
  }

  proceedWithImport() {
    if (!this.selectedFile) return;

    this.isImporting.set(true);
    this.catalogueService.importProducts(this.selectedFile).subscribe({
      next: (result) => {
        this.isImporting.set(false);
        this.snackBar.open(`Import successful: ${result.success} products processed`, 'Close', { duration: 5000 });
        this.resetImport();
        this.loadProducts();
      },
      error: (err) => {
        this.isImporting.set(false);
        this.snackBar.open('Import failed: ' + err.message, 'Close', { duration: 5000 });
      }
    });
  }

  resetImport() {
    this.selectedFile = null;
    this.isValidating.set(false);
    this.isValidated.set(false);
    this.validationResults.set(null);
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