import { Component, Inject, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CatalogueService } from '../catalogue.service';
import { UploadUrlPipe } from '../../../pipes/upload-url.pipe';
import Quill from 'quill';

@Component({
  selector: 'app-designer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    UploadUrlPipe
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Edit Designer' : 'Add Designer' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="designerForm" class="designer-form">
        <div class="profile-section">
          <div class="profile-upload">
            <div class="profile-preview" (click)="profileInput.click()">
              <img *ngIf="profileImageUrl()" [src]="profileImageUrl() | uploadUrl" alt="Profile">
              <mat-icon *ngIf="!profileImageUrl()">person</mat-icon>
              <div class="upload-overlay">
                <mat-icon>camera_alt</mat-icon>
              </div>
            </div>
            <input #profileInput type="file" accept="image/*" (change)="onProfileImageSelect($event)" hidden>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Designer name">
          <mat-error *ngIf="designerForm.get('name')?.hasError('required')">Name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Bio</mat-label>
          <textarea matInput formControlName="bio" rows="4" placeholder="Designer biography"></textarea>
        </mat-form-field>

        <div class="editor-field">
          <label>Description (Rich Text)</label>
          <div #editor class="quill-editor"></div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="email@example.com">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone" placeholder="+1 234 567 8900">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Website</mat-label>
          <input matInput formControlName="website" placeholder="https://designer-website.com">
        </mat-form-field>

        <div class="portfolio-section">
          <h3>Portfolio Images</h3>
          <div class="portfolio-grid">
            <div *ngFor="let img of portfolioImages(); let i = index" class="portfolio-item">
              <img [src]="img | uploadUrl" alt="Portfolio">
              <button mat-icon-button class="remove-btn" (click)="removePortfolioImage(i)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="portfolio-upload" (click)="portfolioInput.click()">
              <mat-icon>add_photo_alternate</mat-icon>
              <span>Add Images</span>
            </div>
          </div>
          <input #portfolioInput type="file" accept="image/*" multiple (change)="onPortfolioImagesSelect($event)" hidden>
        </div>

        <mat-slide-toggle formControlName="isActive" color="primary">
          Active
        </mat-slide-toggle>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!designerForm.valid || saving()">
        {{ saving() ? 'Saving...' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .designer-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }
    
    @media (max-width: 768px) {
      .designer-form {
        gap: 0.5rem;
      }
    }
    .full-width {
      width: 100%;
    }
    .profile-section {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }
    .profile-upload {
      position: relative;
    }
    .profile-preview {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      cursor: pointer;
      position: relative;
    }
    .profile-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .profile-preview mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #999;
    }
    .upload-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .profile-preview:hover .upload-overlay {
      opacity: 1;
    }
    .upload-overlay mat-icon {
      color: white;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .portfolio-section h3 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 500;
    }
    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.5rem;
    }
    .portfolio-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
    }
    .portfolio-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .remove-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0,0,0,0.6);
      color: white;
      width: 24px;
      height: 24px;
    }
    .remove-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .portfolio-upload {
      aspect-ratio: 1;
      border: 2px dashed #ccc;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .portfolio-upload:hover {
      border-color: #2196F3;
      background: #f5f5f5;
    }
    .portfolio-upload mat-icon {
      color: #999;
    }
    .portfolio-upload span {
      font-size: 0.75rem;
      color: #666;
    }
    .editor-field {
      margin: 1rem 0;
    }
    .editor-field label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #666;
    }
    .quill-editor {
      min-height: 200px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    ::ng-deep .ql-toolbar {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    ::ng-deep .ql-container {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  `]
})
export class DesignerDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('editor') editorElement!: ElementRef;
  designerForm: FormGroup;
  isEditMode = false;
  saving = signal(false);
  profileImageUrl = signal<string>('');
  portfolioImages = signal<string[]>([]);
  profileImageFile: File | null = null;
  portfolioImageFiles: File[] = [];
  quillEditor: any;

  constructor(
    private fb: FormBuilder,
    private catalogueService: CatalogueService,
    private dialogRef: MatDialogRef<DesignerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.designerForm = this.fb.group({
      name: ['', Validators.required],
      bio: [''],
      description: [''],
      email: [''],
      phone: [''],
      website: [''],
      isActive: [true]
    });
  }

  ngOnInit() {
    if (this.data?.designer) {
      this.isEditMode = true;
      const designer = this.data.designer;
      this.designerForm.patchValue(designer);
      if (designer.profileImage) {
        this.profileImageUrl.set(designer.profileImage);
      }
      if (designer.portfolioImages) {
        this.portfolioImages.set([...designer.portfolioImages]);
      }
    }
  }

  ngAfterViewInit() {
    this.quillEditor = new Quill(this.editorElement.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });

    if (this.data?.designer?.description) {
      this.quillEditor.root.innerHTML = this.data.designer.description;
    }

    this.quillEditor.on('text-change', () => {
      this.designerForm.patchValue({ description: this.quillEditor.root.innerHTML });
    });
  }

  onProfileImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onPortfolioImagesSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    files.forEach(file => {
      this.portfolioImageFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.portfolioImages.update(imgs => [...imgs, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  }

  removePortfolioImage(index: number) {
    this.portfolioImages.update(imgs => imgs.filter((_, i) => i !== index));
    if (index < this.portfolioImageFiles.length) {
      this.portfolioImageFiles.splice(index, 1);
    }
  }

  async onSave() {
    if (this.designerForm.valid) {
      this.saving.set(true);
      
      try {
        let profileImageUrl = this.isEditMode ? this.data.designer.profileImage : '';
        let portfolioUrls = this.isEditMode ? [...this.data.designer.portfolioImages] : [];

        // Upload profile image
        if (this.profileImageFile) {
          const result = await this.catalogueService.uploadDesignerProfile(this.profileImageFile).toPromise();
          profileImageUrl = result.url;
        }

        // Upload portfolio images
        if (this.portfolioImageFiles.length > 0) {
          const result = await this.catalogueService.uploadDesignerPortfolio(this.portfolioImageFiles).toPromise();
          portfolioUrls = [...portfolioUrls, ...result.urls];
        }

        const designerData = {
          ...this.designerForm.value,
          profileImage: profileImageUrl,
          portfolioImages: portfolioUrls
        };

        if (this.isEditMode) {
          await this.catalogueService.updateDesigner(this.data.designer._id, designerData).toPromise();
        } else {
          await this.catalogueService.createDesigner(designerData).toPromise();
        }

        this.dialogRef.close(true);
      } catch (error) {
        console.error('Error saving designer:', error);
        alert('Failed to save designer');
      } finally {
        this.saving.set(false);
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
