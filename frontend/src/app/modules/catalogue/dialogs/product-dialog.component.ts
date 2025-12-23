import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CatalogueService } from '../catalogue.service';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.product ? 'Edit Product' : 'Add Product' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="productForm" class="product-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Product Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter product name">
            <mat-error *ngIf="productForm.get('name')?.hasError('required')">
              Product name is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>SKU</mat-label>
            <input matInput formControlName="sku" placeholder="Enter SKU">
            <mat-error *ngIf="productForm.get('sku')?.hasError('required')">
              SKU is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Slug</mat-label>
            <input matInput formControlName="slug" placeholder="product-slug">
            <mat-error *ngIf="productForm.get('slug')?.hasError('required')">
              Slug is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Product description"></textarea>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Price</mat-label>
            <input matInput type="number" formControlName="price" placeholder="0.00">
            <span matPrefix>$&nbsp;</span>
            <mat-error *ngIf="productForm.get('price')?.hasError('required')">
              Price is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Currency</mat-label>
            <mat-select formControlName="currency">
              <mat-option value="USD">USD</mat-option>
              <mat-option value="EUR">EUR</mat-option>
              <mat-option value="GBP">GBP</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Category</mat-label>
            <mat-select formControlName="categoryId">
              <mat-option value="">None</mat-option>
              <mat-option *ngFor="let category of data.categories" [value]="category._id">
                {{ category.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Collection</mat-label>
            <mat-select formControlName="collectionId">
              <mat-option value="">None</mat-option>
              <mat-option *ngFor="let collection of collections()" [value]="collection._id">
                {{ collection.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Images (URLs)</mat-label>
            <input matInput formControlName="imagesInput" placeholder="Enter image URLs separated by commas">
            <mat-hint>Separate multiple URLs with commas</mat-hint>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>3D Model URL</mat-label>
            <input matInput formControlName="model3d" placeholder="https://example.com/model.glb">
            <mat-hint>GLB or GLTF file URL for 3D preview</mat-hint>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-checkbox formControlName="isPublished">Published</mat-checkbox>
        </div>

        <div class="form-section">
          <h3>SEO Settings</h3>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>SEO Title</mat-label>
              <input matInput formControlName="seoTitle" placeholder="SEO title">
            </mat-form-field>
          </div>
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>SEO Description</mat-label>
              <textarea matInput formControlName="seoDescription" rows="2" placeholder="SEO description"></textarea>
            </mat-form-field>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!productForm.valid">
        {{ data.product ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .product-form {
      min-width: 600px;
      max-width: 800px;
    }
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .full-width {
      width: 100%;
    }
    .half-width {
      width: calc(50% - 0.5rem);
    }
    .form-section {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }
    .form-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.1rem;
    }
  `]
})
export class ProductDialogComponent implements OnInit {
  productForm: FormGroup;
  collections = signal<any[]>([]);

  constructor(
    private fb: FormBuilder,
    private catalogueService: CatalogueService,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      slug: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD'],
      categoryId: [''],
      collectionId: [''],
      imagesInput: [''],
      model3d: [''],
      isPublished: [false],
      seoTitle: [''],
      seoDescription: ['']
    });
  }

  ngOnInit() {
    this.loadCollections();
    
    if (this.data.product) {
      const product = this.data.product;
      this.productForm.patchValue({
        name: product.name,
        sku: product.sku,
        slug: product.slug,
        description: product.description,
        price: product.price,
        currency: product.currency,
        categoryId: product.categoryId,
        collectionId: product.collectionId,
        imagesInput: product.images?.join(', ') || '',
        model3d: product.model3d,
        isPublished: product.isPublished,
        seoTitle: product.seo?.title || '',
        seoDescription: product.seo?.description || ''
      });
    }

    // Auto-generate slug from name
    this.productForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.data.product) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        this.productForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  loadCollections() {
    this.catalogueService.getCollections().subscribe(collections => {
      this.collections.set(collections);
    });
  }

  onSave() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const productData = {
        ...formValue,
        images: formValue.imagesInput ? formValue.imagesInput.split(',').map((url: string) => url.trim()) : [],
        seo: {
          title: formValue.seoTitle,
          description: formValue.seoDescription
        }
      };

      delete productData.imagesInput;
      delete productData.seoTitle;
      delete productData.seoDescription;

      const request = this.data.product 
        ? this.catalogueService.updateProduct(this.data.product._id, productData)
        : this.catalogueService.createProduct(productData);

      request.subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}