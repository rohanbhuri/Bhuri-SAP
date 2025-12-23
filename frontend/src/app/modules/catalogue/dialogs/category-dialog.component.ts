import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CatalogueService } from '../catalogue.service';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{ getTitle() }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="categoryForm" class="category-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Category Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter category name">
            <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
              Category name is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Slug</mat-label>
            <input matInput formControlName="slug" placeholder="category-slug">
            <mat-error *ngIf="categoryForm.get('slug')?.hasError('required')">
              Slug is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Category description"></textarea>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Parent Category</mat-label>
            <mat-select formControlName="parentId">
              <mat-option value="">None (Root Category)</mat-option>
              <mat-option *ngFor="let category of getAvailableParents()" [value]="category._id">
                {{ category.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-checkbox formControlName="isActive">Active</mat-checkbox>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!categoryForm.valid">
        {{ data.category ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .category-form {
      min-width: 500px;
    }
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class CategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private catalogueService: CatalogueService,
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: [''],
      parentId: [''],
      isActive: [true]
    });
  }

  ngOnInit() {
    if (this.data.category) {
      const category = this.data.category;
      this.categoryForm.patchValue({
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId || '',
        isActive: category.isActive
      });
    } else if (this.data.parentCategory) {
      // Adding subcategory
      this.categoryForm.patchValue({
        parentId: this.data.parentCategory._id
      });
    }

    // Auto-generate slug from name
    this.categoryForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.data.category) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        this.categoryForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  getTitle(): string {
    if (this.data.category) {
      return 'Edit Category';
    } else if (this.data.parentCategory) {
      return `Add Subcategory to ${this.data.parentCategory.name}`;
    }
    return 'Add Category';
  }

  getAvailableParents(): any[] {
    if (!this.data.categories) return [];
    
    // Exclude current category and its children to prevent circular references
    if (this.data.category) {
      return this.data.categories.filter((cat: any) => 
        cat._id !== this.data.category._id && 
        cat.parentId !== this.data.category._id
      );
    }
    
    return this.data.categories;
  }

  onSave() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      
      // Convert empty parentId to null
      if (!categoryData.parentId) {
        categoryData.parentId = null;
      }

      const request = this.data.category 
        ? this.catalogueService.updateCategory(this.data.category._id, categoryData)
        : this.catalogueService.createCategory(categoryData);

      request.subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}