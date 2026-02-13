import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { CatalogueService } from '../catalogue.service';
import { environment } from '../../../../environments/environment';
import { UploadUrlPipe } from '../../../pipes/upload-url.pipe';

@Component({
  selector: 'app-collection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    UploadUrlPipe
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.collection ? 'Edit Collection' : 'Add Collection' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="collectionForm" class="collection-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Collection Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter collection name">
            <mat-error>Collection name is required</mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Slug</mat-label>
            <input matInput formControlName="slug" placeholder="collection-slug">
            <mat-error>Slug is required</mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Collection description"></textarea>
          </mat-form-field>
        </div>

        <div class="form-section">
          <h3>Collection Image</h3>
          <input type="file" #imageInput accept="image/*" (change)="onImageSelect($event)" style="display:none">
          <button mat-raised-button type="button" (click)="imageInput.click()">
            <mat-icon>add_photo_alternate</mat-icon>
            Upload Image
          </button>
          <div class="image-preview" *ngIf="uploadedImage()">
            <img [src]="uploadedImage() | uploadUrl" 
                 (error)="onImagePreviewError()" 
                 *ngIf="!imagePreviewError" />
            <div *ngIf="imagePreviewError" class="image-error">
              <mat-icon>broken_image</mat-icon>
              <span>Image failed to load</span>
            </div>
            <button mat-icon-button (click)="removeImage()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Or paste image URL</mat-label>
            <input matInput [(ngModel)]="imageUrl" [ngModelOptions]="{standalone: true}" placeholder="https://...">
          </mat-form-field>
        </div>

        <div class="form-row flags-row">
          <mat-checkbox formControlName="isActive">Active</mat-checkbox>
          <mat-checkbox formControlName="isExclusive">Exclusive</mat-checkbox>
          <mat-checkbox formControlName="isAppointmentRequired">Appointment Required</mat-checkbox>
          <mat-checkbox formControlName="isFeatured">Featured</mat-checkbox>
        </div>

        <div class="form-section">
          <h3>SEO Settings</h3>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>SEO Title</mat-label>
            <input matInput formControlName="seoTitle" placeholder="Collection SEO title">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>SEO Description</mat-label>
            <textarea matInput formControlName="seoDescription" rows="2" placeholder="Collection SEO description"></textarea>
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
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!collectionForm.valid || saving()">
        {{ saving() ? 'Saving...' : (data?.collection ? 'Update' : 'Create') }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .collection-form {
      width: 100%;
    }
    
    @media (max-width: 768px) {
      .collection-form {
        padding: 0;
      }
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
    .image-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: #f5f5f5;
      border-radius: 4px;
      color: #999;
      font-size: 0.875rem;
    }
    .image-error mat-icon {
      margin-bottom: 0.5rem;
    }
    .flags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
  `]
})
export class CollectionDialogComponent implements OnInit {
  collectionForm: FormGroup;
  uploadedImage = signal<string>('');
  saving = signal(false);
  imageUrl = '';
  imagePreviewError = signal(false);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private catalogueService: CatalogueService,
    private dialogRef: MatDialogRef<CollectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.collectionForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: [''],
      isActive: [true],
      isExclusive: [false],
      isAppointmentRequired: [false],
      isFeatured: [false],
      seoTitle: [''],
      seoDescription: [''],
      seoKeywords: ['']
    });
  }

  ngOnInit() {
    if (this.data?.collection) {
      const collection = this.data.collection;
      this.collectionForm.patchValue({
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        isActive: collection.isActive,
        isExclusive: collection.isExclusive || false,
        isAppointmentRequired: collection.isAppointmentRequired || false,
        isFeatured: collection.isFeatured || false,
        seoTitle: collection.seo?.title || '',
        seoDescription: collection.seo?.description || '',
        seoKeywords: collection.seo?.keywords || ''
      });
      if (collection.image) {
        this.uploadedImage.set(collection.image);
      }
    }

    // Auto-generate slug from name
    this.collectionForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.data?.collection) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        this.collectionForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      
      this.http.post<any>(`${environment.apiUrl}/catalogue/collections/upload-image`, formData)
        .subscribe(res => {
          if (res.url) {
            this.uploadedImage.set(res.url);
            this.imagePreviewError.set(false); // Reset error flag for new image
          }
        });
    }
  }

  removeImage() {
    this.uploadedImage.set('');
    this.imageUrl = '';
    this.imagePreviewError.set(false);
  }

  onImagePreviewError() {
    this.imagePreviewError.set(true);
  }

  onSave() {
    if (this.collectionForm.valid) {
      this.saving.set(true);
      
      const finalImage = this.uploadedImage() || this.imageUrl || null;
      
      const collectionData = {
        ...this.collectionForm.value,
        image: finalImage,
        seo: {
          title: this.collectionForm.value.seoTitle,
          description: this.collectionForm.value.seoDescription,
          keywords: this.collectionForm.value.seoKeywords
        }
      };
      
      delete collectionData.seoTitle;
      delete collectionData.seoDescription;
      delete collectionData.seoKeywords;

      const request = this.data?.collection 
        ? this.catalogueService.updateCollection(this.data.collection._id, collectionData)
        : this.catalogueService.createCollection(collectionData);

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