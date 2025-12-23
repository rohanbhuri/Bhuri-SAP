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

@Component({
  selector: 'app-categories-page',
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
        <h2>Categories</h2>
        <button mat-raised-button color="primary" (click)="openCategoryDialog()">
          <mat-icon>add</mat-icon>
          Add Category
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="categories()" class="catalogue-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let category">
              <div class="category-info">
                <mat-icon class="category-icon">category</mat-icon>
                <div>
                  <div class="category-name">{{ category.name }}</div>
                  <div class="category-slug">{{ category.slug }}</div>
                </div>
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
    .category-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .category-icon {
      color: #4CAF50;
    }
    .category-name {
      font-weight: 500;
      color: #333;
    }
    .category-slug {
      font-size: 0.875rem;
      color: #666;
    }
  `]
})
export class CategoriesPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private catalogueService = inject(CatalogueService);

  categories = signal<any[]>([]);
  products = signal<any[]>([]);
  categoryColumns = ['name', 'description', 'parent', 'products', 'status', 'actions'];

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.catalogueService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });
  }

  loadProducts() {
    this.catalogueService.getProducts().subscribe(products => {
      this.products.set(products);
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
}