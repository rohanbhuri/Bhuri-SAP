import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CatalogueService } from '../catalogue.service';
import { CategoryDialogComponent } from '../dialogs/category-dialog.component';
import { UploadUrlPipe } from '../../../pipes/upload-url.pipe';
import { UserManagementService } from '../../user-management/user-management.service';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    UploadUrlPipe
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Categories</h2>
        <button mat-raised-button color="primary" (click)="openCategoryDialog()">
          <mat-icon>add</mat-icon>
          Add Category
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="categories()" class="catalogue-table">
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>Image</th>
            <td mat-cell *matCellDef="let category">
              <div class="category-image-cell">
                <img *ngIf="category.image && !category.imageError" 
                     [src]="category.image | uploadUrl" 
                     [alt]="category.name"
                     (error)="onImageError(category)">
                <mat-icon *ngIf="!category.image || category.imageError">category</mat-icon>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let category">
              <div class="category-info">
                <div class="category-name">{{ category.name }}</div>
                <div class="category-slug">{{ category.slug }}</div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let category">{{ category.description || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="parent">
            <th mat-header-cell *matHeaderCellDef>Parent</th>
            <td mat-cell *matCellDef="let category">{{ getParentName(category.parentId) || 'Root' }}</td>
          </ng-container>

          <ng-container matColumnDef="products">
            <th mat-header-cell *matHeaderCellDef>Products</th>
            <td mat-cell *matCellDef="let category">{{ getProductCount(category._id) }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let category">
              <mat-chip [color]="category.isActive ? 'primary' : 'warn'">
                {{ category.isActive ? 'Active' : 'Inactive' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="tracking">
            <th mat-header-cell *matHeaderCellDef>History</th>
            <td mat-cell *matCellDef="let category">
              <div class="tracking-info" [matMenuTriggerFor]="historyMenu" style="cursor: pointer;">
                <div class="tracking-item" title="Created At: {{ category.createdAt | date:'medium' }}">
                  <mat-icon class="tracking-icon">add_circle_outline</mat-icon>
                  <span>{{ getUserName(category.createdBy) || 'System' }}</span>
                  <small>{{ category.createdAt | date:'shortDate' }}</small>
                </div>
                <!-- Show last update if it exists and is different from creation -->
                <div class="tracking-item" *ngIf="category.changeLog?.length > 1" title="Last Updated At: {{ category.updatedAt | date:'medium' }}">
                  <mat-icon class="tracking-icon">history</mat-icon>
                  <span>{{ getUserName(category.updatedBy) || 'System' }}</span>
                  <small>{{ category.updatedAt | date:'shortDate' }}</small>
                </div>
                <!-- Fallback for old data without changeLog but with updatedAt -->
                <div class="tracking-item" *ngIf="(!category.changeLog || category.changeLog.length <= 1) && category.updatedBy && category.updatedBy !== category.createdBy" title="Updated At: {{ category.updatedAt | date:'medium' }}">
                  <mat-icon class="tracking-icon">edit_note</mat-icon>
                  <span>{{ getUserName(category.updatedBy) || 'System' }}</span>
                  <small>{{ category.updatedAt | date:'shortDate' }}</small>
                </div>
              </div>
              <mat-menu #historyMenu="matMenu">
                <div class="history-menu-container" (click)="$event.stopPropagation()">
                  <div class="history-header">
                    <mat-icon>history</mat-icon>
                    <span>Change History</span>
                  </div>
                  <div class="history-list">
                    <div *ngIf="!category.changeLog?.length" class="no-history">No detailed history available</div>
                    <div *ngFor="let log of category.changeLog?.slice()?.reverse()" class="history-item-detail">
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
            <td mat-cell *matCellDef="let category">
              <button mat-icon-button [matMenuTriggerFor]="categoryMenu" class="action-button">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #categoryMenu="matMenu">
                <button mat-menu-item (click)="editCategory(category)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="addSubcategory(category)">
                  <mat-icon>add</mat-icon>
                  <span>Add Subcategory</span>
                </button>
                <button mat-menu-item (click)="toggleActive(category)">
                  <mat-icon>{{ category.isActive ? 'visibility_off' : 'visibility' }}</mat-icon>
                  <span>{{ category.isActive ? 'Deactivate' : 'Activate' }}</span>
                </button>
                <button mat-menu-item (click)="deleteCategory(category._id)" class="text-red-600">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="categoryColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: categoryColumns"></tr>
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
    .category-image-cell {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      overflow: hidden;
      background: #f5f5f5;
    }
    .category-image-cell img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .category-image-cell mat-icon {
      color: #999;
    }
    .category-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .category-name {
      font-weight: 500;
      color: #333;
    }
    .category-slug {
      font-size: 0.875rem;
      color: #666;
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
  `]
})
export class CategoriesPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private catalogueService = inject(CatalogueService);
  private userService = inject(UserManagementService);

  categories = signal<any[]>([]);
  products = signal<any[]>([]);
  users = signal<any[]>([]);
  categoryColumns = ['image', 'name', 'description', 'parent', 'products', 'status', 'tracking', 'actions'];

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.loadUsers();
  }

  loadCategories() {
    this.catalogueService.getCategories().subscribe(categories => {
      // Reset image error flags when loading categories
      categories.forEach(category => {
        category.imageError = false;
      });
      this.categories.set(categories);
    });
  }

  loadProducts() {
    this.catalogueService.getProducts({ limit: 1000 }).subscribe(result => {
      this.products.set(result.items);
    });
  }

  getParentName(parentId: string): string {
    const parent = this.categories().find(c => c._id === parentId);
    return parent?.name || '';
  }

  getProductCount(categoryId: string): number {
    return this.products().filter(p => p.categoryId === categoryId).length;
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '600px',
      data: { categories: this.categories() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  editCategory(category: any) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '600px',
      data: { category, categories: this.categories() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  addSubcategory(parentCategory: any) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '600px',
      data: { 
        parentCategory,
        categories: this.categories()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  toggleActive(category: any) {
    this.catalogueService.updateCategory(category._id, { 
      isActive: !category.isActive 
    }).subscribe(() => {
      this.loadCategories();
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

  deleteCategory(id: string) {
    const productCount = this.getProductCount(id);
    if (productCount > 0) {
      alert(`Cannot delete category. It contains ${productCount} products.`);
      return;
    }

    if (confirm('Are you sure you want to delete this category?')) {
      this.catalogueService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  onImageError(category: any) {
    category.imageError = true;
  }
}