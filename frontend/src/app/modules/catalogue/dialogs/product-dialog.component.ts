import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { CatalogueService } from '../catalogue.service';
import { PreferencesService } from '../../../services/preferences.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-dialog',
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
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
    MatExpansionModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.product ? 'Edit Product' : 'Add Product' }}</h2>
    
    <mat-dialog-content class="dialog-content">
      <mat-tab-group>
        <!-- Basic Info Tab -->
        <mat-tab label="Basic Info">
          <div class="tab-content">
            <form [formGroup]="productForm" class="product-form">
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Product Name</mat-label>
                  <input matInput formControlName="name" placeholder="Enter product name">
                  <mat-error>Product name is required</mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Product Code</mat-label>
                  <input matInput formControlName="productCode" placeholder="PRD-001">
                  <mat-error>Product code is required</mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Slug</mat-label>
                  <input matInput formControlName="slug" placeholder="product-slug">
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Short Description</mat-label>
                  <textarea matInput formControlName="description" rows="2"></textarea>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Full Description (HTML)</mat-label>
                  <textarea matInput formControlName="descriptionHtml" rows="6"></textarea>
                  <mat-hint>Use HTML for rich formatting</mat-hint>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Base Price</mat-label>
                  <input matInput type="number" formControlName="basePrice">
                  <span matPrefix>{{ currencySymbol() }}&nbsp;</span>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Currency</mat-label>
                  <input matInput formControlName="currency" [value]="currency()" readonly>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Category</mat-label>
                  <mat-select formControlName="categoryId">
                    <mat-option value="">None</mat-option>
                    <mat-option *ngFor="let cat of data.categories" [value]="cat._id">
                      {{ cat.name }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Collection</mat-label>
                  <mat-select formControlName="collectionId">
                    <mat-option value="">None</mat-option>
                    <mat-option *ngFor="let col of data.collections" [value]="col._id">
                      {{ col.name }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Tags</mat-label>
                  <mat-chip-grid #chipGrid>
                    <mat-chip-row *ngFor="let tag of tags()" (removed)="removeTag(tag)">
                      {{ tag }}
                      <button matChipRemove><mat-icon>cancel</mat-icon></button>
                    </mat-chip-row>
                  </mat-chip-grid>
                  <input placeholder="Add tag..." [matChipInputFor]="chipGrid"
                    [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                    (matChipInputTokenEnd)="addTag($event)" />
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-checkbox formControlName="isPublished">Published</mat-checkbox>
              </div>
            </form>
          </div>
        </mat-tab>

        <!-- Media Tab -->
        <mat-tab label="Media">
          <div class="tab-content">
            <div class="media-section">
              <h3>Images</h3>
              <input type="file" #imageInput multiple accept="image/*" (change)="onImageSelect($event)" style="display:none">
              <button mat-raised-button (click)="imageInput.click()">
                <mat-icon>add_photo_alternate</mat-icon>
                Upload Images
              </button>
              <div class="image-preview" *ngIf="uploadedImages().length">
                <div *ngFor="let img of uploadedImages(); let i = index" class="image-item">
                  <img [src]="img" />
                  <button mat-icon-button (click)="removeImage(i)">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Or paste image URLs (comma separated)</mat-label>
                <input matInput [(ngModel)]="imageUrls" placeholder="https://...">
              </mat-form-field>
            </div>

            <div class="media-section">
              <h3>Videos</h3>
              <input type="file" #videoInput accept="video/*" (change)="onVideoSelect($event)" style="display:none">
              <button mat-raised-button (click)="videoInput.click()">
                <mat-icon>videocam</mat-icon>
                Upload Video
              </button>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Or paste video URLs (comma separated)</mat-label>
                <input matInput [(ngModel)]="videoUrls" placeholder="https://...">
              </mat-form-field>
            </div>

            <div class="media-section">
              <h3>3D Models</h3>
              <input type="file" #modelInput accept=".glb,.gltf" (change)="onModelSelect($event)" style="display:none">
              <button mat-raised-button (click)="modelInput.click()">
                <mat-icon>view_in_ar</mat-icon>
                Upload 3D Model
              </button>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Or paste 3D model URLs (comma separated)</mat-label>
                <input matInput [(ngModel)]="modelUrls" placeholder="https://...model.glb">
              </mat-form-field>
            </div>
          </div>
        </mat-tab>

        <!-- Variations Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">tune</mat-icon>
            Variations
          </ng-template>
          <div class="tab-content">
            <div class="info-banner">
              <mat-icon>info</mat-icon>
              <p>Add product variations like different materials, colors, sizes, or finishes. Each variation can have its own price modifier.</p>
            </div>
            <form [formGroup]="productForm">
              <div class="measurements-section">
                <div class="section-header">
                  <h3>Product Variations</h3>
                  <button mat-raised-button color="primary" type="button" (click)="addMeasurement()">
                    <mat-icon>add</mat-icon>
                    Add Variation Type
                  </button>
                </div>

                <mat-accordion formArrayName="measurements">
                  <mat-expansion-panel *ngFor="let measurement of measurements.controls; let i = index" [formGroupName]="i">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon>tune</mat-icon>
                        {{ measurement.get('name')?.value || 'New Variation Type' }}
                      </mat-panel-title>
                      <mat-panel-description>
                        {{ getMeasurementOptions(i).length }} option(s)
                      </mat-panel-description>
                    </mat-expansion-panel-header>

                    <div class="measurement-content">
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Variation Type</mat-label>
                        <input matInput formControlName="name" placeholder="e.g., Material, Color, Size, Finish">
                        <mat-hint>Examples: Material, Color, Size, Finish, Style</mat-hint>
                      </mat-form-field>

                      <div class="options-header">
                        <h4>Variation Options</h4>
                        <button mat-raised-button color="accent" type="button" (click)="addMeasurementOption(i)">
                          <mat-icon>add</mat-icon>
                          Add Option
                        </button>
                      </div>

                      <div formArrayName="options" class="options-list">
                        <div *ngFor="let option of getMeasurementOptions(i).controls; let j = index" [formGroupName]="j" class="option-row">
                          <span class="option-number">{{ j + 1 }}</span>
                          <mat-form-field appearance="outline" class="option-value">
                            <mat-label>Option Name</mat-label>
                            <input matInput formControlName="value" placeholder="e.g., White Marble, Brass Finish">
                          </mat-form-field>
                          <mat-form-field appearance="outline" class="option-price">
                            <mat-label>Price Modifier</mat-label>
                            <input matInput type="number" formControlName="priceModifier">
                            <span matPrefix>+{{ currencySymbol() }}&nbsp;</span>
                            <mat-hint>Additional cost</mat-hint>
                          </mat-form-field>
                          <button mat-icon-button color="warn" type="button" (click)="removeMeasurementOption(i, j)">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </div>
                      </div>

                      <div class="panel-actions">
                        <button mat-button color="warn" type="button" (click)="removeMeasurement(i)">
                          <mat-icon>delete</mat-icon>
                          Remove Variation Type
                        </button>
                      </div>
                    </div>
                  </mat-expansion-panel>
                </mat-accordion>

                <div *ngIf="measurements.length === 0" class="empty-state">
                  <mat-icon>tune</mat-icon>
                  <p>No variations added yet</p>
                  <button mat-raised-button color="primary" type="button" (click)="addMeasurement()">
                    <mat-icon>add</mat-icon>
                    Add First Variation
                  </button>
                </div>
              </div>
            </form>
          </div>
        </mat-tab>

        <!-- SEO Tab -->
        <mat-tab label="SEO">
          <div class="tab-content">
            <form [formGroup]="productForm">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>SEO Title</mat-label>
                <input matInput formControlName="seoTitle">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>SEO Description</mat-label>
                <textarea matInput formControlName="seoDescription" rows="3"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>SEO Keywords</mat-label>
                <input matInput formControlName="seoKeywords" placeholder="keyword1, keyword2">
              </mat-form-field>
            </form>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!productForm.valid || saving()">
        {{ saving() ? 'Saving...' : (data.product ? 'Update' : 'Create') }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .tab-icon {
      margin-right: 8px;
    }
    .info-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .info-banner mat-icon {
      color: #2196f3;
    }
    .info-banner p {
      margin: 0;
      color: #1565c0;
    }
    .measurements-section {
      margin-top: 1rem;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .section-header h3 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .options-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px 0 12px;
    }
    .options-header h4 {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    .options-list {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
    }
    .measurement-content {
      padding: 1rem 0;
    }
    .option-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
      background: white;
      padding: 12px;
      border-radius: 4px;
    }
    .option-number {
      min-width: 24px;
      height: 24px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }
    .option-value {
      flex: 2;
    }
    .option-price {
      flex: 1;
    }
    .panel-actions {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      background: #f9f9f9;
      border-radius: 8px;
      border: 2px dashed #ddd;
    }
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #999;
      margin-bottom: 16px;
    }
    .empty-state p {
      color: #666;
      margin-bottom: 16px;
    }
    .dialog-content {
      min-width: 800px;
      max-height: 70vh;
    }
    .tab-content {
      padding: 1.5rem 0;
    }
    .product-form {
      max-width: 900px;
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
    .media-section {
      margin-bottom: 2rem;
    }
    .media-section h3 {
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
    }
    .image-preview {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin: 1rem 0;
    }
    .image-item {
      position: relative;
      width: 100px;
      height: 100px;
    }
    .image-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    .image-item button {
      position: absolute;
      top: -8px;
      right: -8px;
      background: white;
    }
  `]
})
export class ProductDialogComponent implements OnInit {
  productForm: FormGroup;
  tags = signal<string[]>([]);
  uploadedImages = signal<string[]>([]);
  saving = signal(false);
  currency = signal('USD');
  currencySymbol = signal('$');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  imageUrls = '';
  videoUrls = '';
  modelUrls = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private catalogueService: CatalogueService,
    private preferencesService: PreferencesService,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      productCode: ['', Validators.required],
      slug: [''],
      description: [''],
      descriptionHtml: [''],
      basePrice: [0, [Validators.min(0)]],
      currency: ['USD'],
      categoryId: [''],
      collectionId: [''],
      isPublished: [false],
      dimensionType: ['hwl'],
      dimensionUnit: ['cm'],
      measurements: this.fb.array([]),
      seoTitle: [''],
      seoDescription: [''],
      seoKeywords: ['']
    });
  }

  get measurements(): FormArray {
    return this.productForm.get('measurements') as FormArray;
  }

  ngOnInit() {
    this.preferencesService.getUserPreferences().subscribe(prefs => {
      if (prefs) {
        this.currency.set(prefs.currency || 'USD');
        this.currencySymbol.set(prefs.currencySymbol || '$');
        this.productForm.patchValue({ currency: prefs.currency || 'USD' });
      }
    });

    if (this.data.product) {
      const p = this.data.product;
      this.productForm.patchValue({
        name: p.name,
        productCode: p.productCode,
        slug: p.slug,
        description: p.description,
        descriptionHtml: p.descriptionHtml,
        basePrice: p.basePrice,
        currency: p.currency,
        categoryId: p.categoryId,
        collectionId: p.collectionId,
        isPublished: p.isPublished,
        seoTitle: p.seo?.title,
        seoDescription: p.seo?.description,
        seoKeywords: p.seo?.keywords
      });
      
      if (p.tags) this.tags.set(p.tags);
      if (p.images) this.uploadedImages.set(p.images);
      if (p.videos) this.videoUrls = p.videos.join(', ');
      if (p.models3d) this.modelUrls = p.models3d.join(', ');
      
      if (p.measurements) {
        p.measurements.forEach((m: any) => {
          const measurementGroup = this.fb.group({
            name: [m.name],
            options: this.fb.array(m.options.map((o: any) => this.fb.group({
              value: [o.value],
              priceModifier: [o.priceModifier]
            })))
          });
          this.measurements.push(measurementGroup);
        });
      }
    }

    this.productForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.data.product) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        this.productForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.update(tags => [...tags, value]);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  addMeasurement() {
    const measurementGroup = this.fb.group({
      name: [''],
      options: this.fb.array([])
    });
    this.measurements.push(measurementGroup);
  }

  removeMeasurement(index: number) {
    this.measurements.removeAt(index);
  }

  getMeasurementOptions(measurementIndex: number): FormArray {
    return this.measurements.at(measurementIndex).get('options') as FormArray;
  }

  addMeasurementOption(measurementIndex: number) {
    const options = this.getMeasurementOptions(measurementIndex);
    options.push(this.fb.group({
      value: [''],
      priceModifier: [0]
    }));
  }

  removeMeasurementOption(measurementIndex: number, optionIndex: number) {
    const options = this.getMeasurementOptions(measurementIndex);
    options.removeAt(optionIndex);
  }

  onImageSelect(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const formData = new FormData();
        formData.append('images', file);
        
        this.http.post<any>(`${environment.apiUrl}/catalogue/products/upload-images`, formData)
          .subscribe(res => {
            if (res.urls) {
              this.uploadedImages.update((imgs: string[]) => [...imgs, ...res.urls]);
            }
          });
      }
    }
  }

  onVideoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('video', file);
      
      this.http.post<any>(`${environment.apiUrl}/catalogue/products/upload-video`, formData)
        .subscribe(res => {
          if (res.url) {
            this.videoUrls = this.videoUrls ? `${this.videoUrls}, ${res.url}` : res.url;
          }
        });
    }
  }

  onModelSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('model', file);
      
      this.http.post<any>(`${environment.apiUrl}/catalogue/products/upload-model`, formData)
        .subscribe(res => {
          if (res.url) {
            this.modelUrls = this.modelUrls ? `${this.modelUrls}, ${res.url}` : res.url;
          }
        });
    }
  }

  removeImage(index: number) {
    this.uploadedImages.update((imgs: string[]) => imgs.filter((_: string, i: number) => i !== index));
  }

  onSave() {
    if (this.productForm.valid) {
      this.saving.set(true);
      
      const allImages = [
        ...this.uploadedImages(),
        ...(this.imageUrls ? this.imageUrls.split(',').map(u => u.trim()) : [])
      ];
      
      const allVideos = this.videoUrls ? this.videoUrls.split(',').map(u => u.trim()) : [];
      const allModels = this.modelUrls ? this.modelUrls.split(',').map(u => u.trim()) : [];

      const productData = {
        ...this.productForm.value,
        tags: this.tags(),
        images: allImages,
        videos: allVideos,
        models3d: allModels,
        seo: {
          title: this.productForm.value.seoTitle,
          description: this.productForm.value.seoDescription,
          keywords: this.productForm.value.seoKeywords
        }
      };

      delete productData.seoTitle;
      delete productData.seoDescription;
      delete productData.seoKeywords;

      const request = this.data.product 
        ? this.catalogueService.updateProduct(this.data.product._id, productData)
        : this.catalogueService.createProduct(productData);

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
