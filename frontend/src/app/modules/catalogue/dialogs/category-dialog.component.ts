import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { CatalogueService } from '../catalogue.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
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

        <div class="form-section">
          <h3>Category Image</h3>
          <input type="file" #imageInput accept="image/*" (change)="onImageSelect($event)" style="display:none">
          <button mat-raised-button type="button" (click)="imageInput.click()">
            <mat-icon>add_photo_alternate</mat-icon>
            Upload Image
          </button>
          <div class="image-preview" *ngIf="uploadedImage()">
            <img [src]="uploadedImage()" />
            <button mat-icon-button (click)="removeImage()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Or paste image URL</mat-label>
            <input matInput [(ngModel)]="imageUrl" [ngModelOptions]="{standalone: true}" placeholder="https://...">
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

        <div class="form-section">
          <h3>SEO Settings</h3>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>SEO Title</mat-label>
            <input matInput formControlName="seoTitle" placeholder="Category SEO title">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>SEO Description</mat-label>
            <textarea matInput formControlName="seoDescription" rows="2" placeholder="Category SEO description"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>SEO Keywords</mat-label>
            <input matInput formControlName="seoKeywords" placeholder="keyword1, keyword2">
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!categoryForm.valid || saving()">
        {{ saving() ? 'Saving...' : (data.category ? 'Update' : 'Create') }}
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
    .form-section {
      margin: 1.5rem 0;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .form-section h3 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 500;
    }
    .image-preview {
      position: relative;
      width: 150px;
      height: 150px;
      margin: 1rem 0;
    }
    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    .image-preview button {
      position: absolute;
      top: -8px;
      right: -8px;
      background: white;
    }
  `]
})
export class CategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;
  uploadedImage = signal<string>('');
  saving = signal(false);
  imageUrl = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private catalogueService: CatalogueService,
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: [''],
      parentId: [''],
      isActive: [true],
      seoTitle: [''],
      seoDescription: [''],
      seoKeywords: ['']
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
        isActive: category.isActive,
        seoTitle: category.seo?.title || '',
        seoDescription: category.seo?.description || '',
        seoKeywords: category.seo?.keywords || ''
      });
      if (category.image) {
        this.uploadedImage.set(category.image);
      }
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

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      
      this.http.post<any>(`${environment.apiUrl}/catalogue/categories/upload-image`, formData)
        .subscribe(res => {
          if (res.url) {
            this.uploadedImage.set(res.url);
          }
        });
    }
  }

  removeImage() {
    this.uploadedImage.set('');
    this.imageUrl = '';
  }

  onSave() {
    if (this.categoryForm.valid) {
      this.saving.set(true);
      
      const finalImage = this.uploadedImage() || this.imageUrl || null;
      
      const categoryData = {
        ...this.categoryForm.value,
        image: finalImage,
        seo: {
          title: this.categoryForm.value.seoTitle,
          description: this.categoryForm.value.seoDescription,
          keywords: this.categoryForm.value.seoKeywords
        }
      };
      
      delete categoryData.seoTitle;
      delete categoryData.seoDescription;
      delete categoryData.seoKeywords;
      
      // Convert empty parentId to null
      if (!categoryData.parentId) {
        categoryData.parentId = null;
      }

      const request = this.data.category 
        ? this.catalogueService.updateCategory(this.data.category._id, categoryData)
        : this.catalogueService.createCategory(categoryData);

      request.subscribe({
        next: () => {
          this.saving.set(false);
          this.dialogRef.close(true);
        },
        error: () => {
          this.saving.set(false);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}