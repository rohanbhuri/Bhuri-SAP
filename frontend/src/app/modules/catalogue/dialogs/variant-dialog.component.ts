import { Component, Inject, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CatalogueService } from '../catalogue.service';
import { UploadUrlPipe } from '../../../pipes/upload-url.pipe';
import Quill from 'quill';

export interface VariantDialogData {
  variant: any;
  productDimensionConfig: any;
  currencySymbol: string;
  typeName: string;
}

@Component({
  selector: 'app-variant-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatCheckboxModule, MatIconModule, MatTabsModule,
    MatSnackBarModule, UploadUrlPipe
  ],
  template: `
    <h2 mat-dialog-title>Edit Variant: {{ data.variant?.name || 'New Variant' }}</h2>

    <mat-dialog-content class="dialog-content">
      <mat-tab-group>
        <!-- Basic Info -->
        <mat-tab label="Basic Info">
          <div class="tab-content">
            <form [formGroup]="variantForm" class="variant-form">
              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Variant Name</mat-label>
                  <input matInput formControlName="name">
                </mat-form-field>
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>SKU</mat-label>
                  <input matInput formControlName="sku">
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Price Modifier</mat-label>
                  <input matInput type="number" formControlName="priceModifier">
                  <span matPrefix>+{{ data.currencySymbol }}&nbsp;</span>
                </mat-form-field>
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Final Price</mat-label>
                  <input matInput type="number" formControlName="price">
                  <span matPrefix>{{ data.currencySymbol }}&nbsp;</span>
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Short Description</mat-label>
                  <textarea matInput formControlName="description" rows="2"></textarea>
                </mat-form-field>
              </div>
              <div class="editor-field">
                <label>Full Description (Rich Text)</label>
                <div #descriptionEditor class="quill-editor"></div>
              </div>
              <div class="form-row">
                <mat-checkbox formControlName="isAvailable">Available</mat-checkbox>
              </div>
            </form>
          </div>
        </mat-tab>

        <!-- Media -->
        <mat-tab label="Media">
          <div class="tab-content">
            <div class="media-section">
              <h3>Images</h3>
              <input type="file" #imageInput multiple accept="image/*" (change)="onImageSelect($event)" style="display:none">
              <button mat-raised-button (click)="imageInput.click()">
                <mat-icon>add_photo_alternate</mat-icon> Upload Images
              </button>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Or paste image URLs (comma separated)</mat-label>
                <input matInput [(ngModel)]="imageUrls" (keyup.enter)="addExternalImageUrls()">
                <button mat-icon-button matSuffix (click)="addExternalImageUrls()" *ngIf="imageUrls.trim()" title="Add Links">
                  <mat-icon>add_link</mat-icon>
                </button>
              </mat-form-field>
              <div class="image-preview" *ngIf="uploadedImages().length">
                <div *ngFor="let img of uploadedImages(); let i = index" class="image-item" [class.featured]="featuredImageIndex() === i">
                  <img [src]="img | uploadUrl" />
                  <button mat-icon-button class="set-featured" (click)="setFeaturedImage(i)" [class.active]="featuredImageIndex() === i">
                    <mat-icon>{{ featuredImageIndex() === i ? 'star' : 'star_border' }}</mat-icon>
                  </button>
                  <button mat-icon-button class="remove-btn" (click)="removeImage(i)">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>
            </div>

            <div class="media-section">
              <h3>Videos</h3>
              <input type="file" #videoInput accept="video/*" (change)="onVideoSelect($event)" style="display:none">
              <button mat-raised-button (click)="videoInput.click()">
                <mat-icon>videocam</mat-icon> Upload Video
              </button>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Or paste video URLs (comma separated)</mat-label>
                <input matInput [(ngModel)]="videoUrls">
              </mat-form-field>
            </div>

            <div class="media-section">
              <h3>3D Models</h3>
              <input type="file" #modelInput accept=".glb,.gltf" (change)="onModelSelect($event)" style="display:none">
              <button mat-raised-button (click)="modelInput.click()">
                <mat-icon>view_in_ar</mat-icon> Upload 3D Model
              </button>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Or paste 3D model URLs (comma separated)</mat-label>
                <input matInput [(ngModel)]="modelUrls">
              </mat-form-field>
            </div>

            <div class="media-section">
              <h3>Technical Sheet (PDF)</h3>
              <input type="file" #techSheetInput accept=".pdf" (change)="onTechnicalSheetSelect($event)" style="display:none">
              <button mat-raised-button (click)="techSheetInput.click()">
                <mat-icon>picture_as_pdf</mat-icon> Upload Technical Sheet
              </button>
              <div *ngIf="uploadedTechnicalSheet()" class="technical-sheet-preview">
                <mat-icon>picture_as_pdf</mat-icon>
                <span>{{ uploadedTechnicalSheet() }}</span>
                <button mat-icon-button class="remove-btn" (click)="removeTechnicalSheet()">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Or paste technical sheet URL</mat-label>
                <input matInput [(ngModel)]="technicalSheetUrl">
              </mat-form-field>
            </div>
          </div>
        </mat-tab>

        <!-- Dimensions -->
        <mat-tab label="Dimensions">
          <div class="tab-content">
            <div class="info-banner" *ngIf="!overrideDimensions()">
              <mat-icon>info</mat-icon>
              <p>This variant inherits dimensions from the product. Toggle below to override.</p>
            </div>
            <mat-checkbox [checked]="overrideDimensions()" (change)="overrideDimensions.set($event.checked)">
              Override product dimensions for this variant
            </mat-checkbox>

            <form [formGroup]="variantForm" *ngIf="overrideDimensions()" class="dimension-form">
              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Shape</mat-label>
                  <mat-select formControlName="dimensionShape">
                    <mat-option value="rectangle">Rectangle</mat-option>
                    <mat-option value="round">Round</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Unit</mat-label>
                  <mat-select formControlName="dimensionUnit">
                    <mat-option value="cm">Centimeters (cm)</mat-option>
                    <mat-option value="inch">Inches (in)</mat-option>
                    <mat-option value="mm">Millimeters (mm)</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div *ngIf="variantForm.get('dimensionShape')?.value === 'rectangle'">
                <div class="dimension-group">
                  <h4>Width</h4>
                  <div class="form-row">
                    <mat-form-field appearance="outline"><mat-label>Min</mat-label><input matInput type="number" formControlName="widthMin"></mat-form-field>
                    <mat-form-field appearance="outline"><mat-label>Max</mat-label><input matInput type="number" formControlName="widthMax"></mat-form-field>
                    <mat-form-field appearance="outline"><mat-label>Default</mat-label><input matInput type="number" formControlName="widthDefault"></mat-form-field>
                  </div>
                </div>
                <div class="dimension-group">
                  <h4>Height</h4>
                  <mat-form-field appearance="outline" class="full-width"><mat-label>Height</mat-label><input matInput type="number" formControlName="dimHeight"></mat-form-field>
                </div>
                <div class="dimension-group">
                  <h4>Depth</h4>
                  <mat-form-field appearance="outline" class="full-width"><mat-label>Depth</mat-label><input matInput type="number" formControlName="depth"></mat-form-field>
                </div>
              </div>

              <div *ngIf="variantForm.get('dimensionShape')?.value === 'round'">
                <div class="dimension-group">
                  <h4>Diameter</h4>
                  <div class="form-row">
                    <mat-form-field appearance="outline"><mat-label>Min</mat-label><input matInput type="number" formControlName="diameterMin"></mat-form-field>
                    <mat-form-field appearance="outline"><mat-label>Max</mat-label><input matInput type="number" formControlName="diameterMax"></mat-form-field>
                    <mat-form-field appearance="outline"><mat-label>Default</mat-label><input matInput type="number" formControlName="diameterDefault"></mat-form-field>
                  </div>
                </div>
                <div class="dimension-group">
                  <h4>Height</h4>
                  <mat-form-field appearance="outline" class="full-width"><mat-label>Height</mat-label><input matInput type="number" formControlName="dimHeight"></mat-form-field>
                </div>
              </div>
            </form>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!variantForm.valid">Save Variant</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content { width: 100%; max-height: 70vh; }
    .tab-content { padding: 1.5rem 0; }
    .variant-form, .dimension-form { width: 100%; }
    .form-row { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; }
    .full-width { width: 100%; }
    .half-width { width: calc(50% - 0.5rem); }
    .media-section { margin-bottom: 2rem; }
    .media-section h3 { margin: 0 0 1rem 0; font-size: 1.1rem; }
    .image-preview { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1rem 0; }
    .image-item { position: relative; width: 100px; height: 100px; }
    .image-item.featured { border: 3px solid #ffd700; border-radius: 4px; }
    .image-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
    .image-item .remove-btn { position: absolute; top: -8px; right: -8px; background: white; }
    .image-item .set-featured { position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); background: white; }
    .image-item .set-featured.active { color: #ffd700; }
    .technical-sheet-preview { display: flex; align-items: center; gap: 8px; padding: 12px; background: #f5f5f5; border-radius: 4px; margin: 12px 0; }
    .technical-sheet-preview mat-icon { color: #d32f2f; }
    .technical-sheet-preview span { flex: 1; font-size: 14px; }
    .info-banner { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px; margin-bottom: 16px; }
    .info-banner mat-icon { color: #2196f3; }
    .info-banner p { margin: 0; color: #1565c0; }
    .dimension-group { margin: 1rem 0; padding: 1rem; background: #f9f9f9; border-radius: 8px; }
    .dimension-group h4 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666; }
    .editor-field { margin: 1rem 0; }
    .editor-field label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: #666; }
    .quill-editor { min-height: 150px; background: white; border: 1px solid #ccc; border-radius: 4px; }
    ::ng-deep .ql-toolbar { border-top-left-radius: 4px; border-top-right-radius: 4px; }
    ::ng-deep .ql-container { border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; }
  `]
})
export class VariantDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('descriptionEditor') descriptionEditorElement!: ElementRef;
  variantForm: FormGroup;
  uploadedImages = signal<string[]>([]);
  featuredImageIndex = signal<number>(-1);
  uploadedTechnicalSheet = signal<string>('');
  overrideDimensions = signal(false);
  imageUrls = '';
  videoUrls = '';
  modelUrls = '';
  technicalSheetUrl = '';
  quillEditor: any;

  constructor(
    private fb: FormBuilder,
    private catalogueService: CatalogueService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<VariantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VariantDialogData
  ) {
    this.variantForm = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      description: [''],
      descriptionHtml: [''],
      price: [0, [Validators.min(0)]],
      priceModifier: [0],
      isAvailable: [true],
      dimensionShape: ['rectangle'],
      dimensionUnit: ['cm'],
      widthMin: [0], widthMax: [0], widthDefault: [0],
      dimHeight: [0], depth: [0],
      diameterMin: [0], diameterMax: [0], diameterDefault: [0]
    });
  }

  ngOnInit() {
    const v = this.data.variant;
    if (v) {
      this.variantForm.patchValue({
        name: v.name || '',
        sku: v.sku || '',
        description: v.description || '',
        descriptionHtml: v.descriptionHtml || '',
        price: v.price || 0,
        priceModifier: v.priceModifier || 0,
        isAvailable: v.isAvailable !== false
      });

      if (v.imageGallery?.length) this.uploadedImages.set([...v.imageGallery]);
      if (v.featuredImage) {
        const idx = (v.imageGallery || []).indexOf(v.featuredImage);
        if (idx !== -1) this.featuredImageIndex.set(idx);
      }
      if (v.videos?.length) this.videoUrls = v.videos.join(', ');
      if (v.models3d?.length) this.modelUrls = v.models3d.join(', ');
      if (v.technicalSheet) this.uploadedTechnicalSheet.set(v.technicalSheet);

      if (v.dimensionConfig) {
        this.overrideDimensions.set(true);
        const dc = v.dimensionConfig;
        this.variantForm.patchValue({
          dimensionShape: dc.shape || 'rectangle',
          dimensionUnit: dc.unit || 'cm',
          widthMin: dc.width?.min || 0,
          widthMax: dc.width?.max || 0,
          widthDefault: dc.width?.default || 0,
          dimHeight: dc.height || 0,
          depth: dc.depth || 0,
          diameterMin: dc.diameter?.min || 0,
          diameterMax: dc.diameter?.max || 0,
          diameterDefault: dc.diameter?.default || 0
        });
      } else if (this.data.productDimensionConfig) {
        // Pre-fill with product dimensions (but don't enable override)
        const dc = this.data.productDimensionConfig;
        this.variantForm.patchValue({
          dimensionShape: dc.shape || 'rectangle',
          dimensionUnit: dc.unit || 'cm',
          widthMin: dc.width?.min || 0,
          widthMax: dc.width?.max || 0,
          widthDefault: dc.width?.default || 0,
          dimHeight: dc.height || 0,
          depth: dc.depth || 0,
          diameterMin: dc.diameter?.min || 0,
          diameterMax: dc.diameter?.max || 0,
          diameterDefault: dc.diameter?.default || 0
        });
      }
    }
  }

  ngAfterViewInit() {
    if (this.descriptionEditorElement?.nativeElement) {
      this.quillEditor = new Quill(this.descriptionEditorElement.nativeElement, {
        theme: 'snow',
        modules: { toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']] }
      });
      if (this.data.variant?.descriptionHtml) {
        this.quillEditor.root.innerHTML = this.data.variant.descriptionHtml;
      }
      this.quillEditor.on('text-change', () => {
        this.variantForm.patchValue({
          description: this.quillEditor.getText().trim(),
          descriptionHtml: this.quillEditor.root.innerHTML
        }, { emitEvent: false });
      });
    }
  }

  onImageSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (files.length) {
      this.catalogueService.uploadProductImages(files).subscribe({
        next: (res) => {
          if (res.urls) {
            this.uploadedImages.update(imgs => [...imgs, ...res.urls]);
            this.snackBar.open(`${res.urls.length} image(s) uploaded`, 'Close', { duration: 2000 });
          }
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Upload failed', 'Close', { duration: 5000, panelClass: ['error-snackbar'] })
      });
    }
  }

  addExternalImageUrls() {
    if (this.imageUrls?.trim()) {
      const urls = this.imageUrls.split(',').map(u => u.trim()).filter(u => u);
      if (urls.length) {
        this.uploadedImages.update(imgs => [...imgs, ...urls]);
        this.imageUrls = '';
      }
    }
  }

  removeImage(index: number) {
    this.uploadedImages.update(imgs => imgs.filter((_, i) => i !== index));
    if (this.featuredImageIndex() === index) this.featuredImageIndex.set(-1);
    else if (this.featuredImageIndex() > index) this.featuredImageIndex.update(i => i - 1);
  }

  setFeaturedImage(index: number) { this.featuredImageIndex.set(index); }

  onVideoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.catalogueService.uploadProductVideo(file).subscribe({
        next: (res) => { if (res.url) { this.videoUrls = this.videoUrls ? `${this.videoUrls}, ${res.url}` : res.url; this.snackBar.open('Video uploaded', 'Close', { duration: 2000 }); } },
        error: (err) => this.snackBar.open(err.error?.message || 'Upload failed', 'Close', { duration: 5000, panelClass: ['error-snackbar'] })
      });
    }
  }

  onModelSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.catalogueService.uploadProduct3DModel(file).subscribe({
        next: (res) => { if (res.url) { this.modelUrls = this.modelUrls ? `${this.modelUrls}, ${res.url}` : res.url; this.snackBar.open('3D model uploaded', 'Close', { duration: 2000 }); } },
        error: (err) => this.snackBar.open(err.error?.message || 'Upload failed', 'Close', { duration: 5000, panelClass: ['error-snackbar'] })
      });
    }
  }

  onTechnicalSheetSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name?.toLowerCase().endsWith('.pdf')) { this.snackBar.open('Only PDF files allowed', 'Close', { duration: 3000, panelClass: ['error-snackbar'] }); event.target.value = ''; return; }
      const maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) { this.snackBar.open(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 20MB.`, 'Close', { duration: 5000, panelClass: ['error-snackbar'] }); event.target.value = ''; return; }
      this.catalogueService.uploadProductTechnicalSheet(file).subscribe({
        next: (res) => { if (res.url) { this.uploadedTechnicalSheet.set(res.url); this.snackBar.open('Technical sheet uploaded', 'Close', { duration: 2000 }); } event.target.value = ''; },
        error: (err) => { this.snackBar.open(err.error?.message || 'Upload failed', 'Close', { duration: 5000, panelClass: ['error-snackbar'] }); event.target.value = ''; }
      });
    }
  }

  removeTechnicalSheet() { this.uploadedTechnicalSheet.set(''); this.technicalSheetUrl = ''; }

  onSave() {
    if (!this.variantForm.valid) return;
    const f = this.variantForm.value;
    const allImages = this.uploadedImages();
    const featuredImage = this.featuredImageIndex() >= 0 ? allImages[this.featuredImageIndex()] : (allImages[0] || '');
    const videos = this.videoUrls ? this.videoUrls.split(',').map(u => u.trim()).filter(u => u) : [];
    const models3d = this.modelUrls ? this.modelUrls.split(',').map(u => u.trim()).filter(u => u) : [];
    const technicalSheet = this.uploadedTechnicalSheet() || this.technicalSheetUrl?.trim() || null;

    let dimensionConfig = null;
    if (this.overrideDimensions()) {
      dimensionConfig = {
        shape: f.dimensionShape,
        unit: f.dimensionUnit,
        width: { min: f.widthMin, max: f.widthMax, default: f.widthDefault },
        height: f.dimHeight,
        depth: f.depth,
        diameter: { min: f.diameterMin, max: f.diameterMax, default: f.diameterDefault }
      };
    }

    const result = {
      _id: this.data.variant?._id || crypto.randomUUID(),
      name: f.name,
      sku: f.sku,
      description: f.description,
      descriptionHtml: f.descriptionHtml,
      price: f.price,
      priceModifier: f.priceModifier,
      featuredImage,
      imageGallery: allImages,
      videos,
      models3d,
      technicalSheet,
      dimensionConfig,
      isAvailable: f.isAvailable
    };

    this.dialogRef.close(result);
  }

  onCancel() { this.dialogRef.close(null); }
}
