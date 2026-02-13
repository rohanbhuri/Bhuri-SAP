import { Component, Inject, OnInit, signal, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CatalogueService } from '../catalogue.service';
import { PreferencesService } from '../../../services/preferences.service';
import { UploadUrlPipe } from '../../../pipes/upload-url.pipe';
import Quill from 'quill';

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
    MatExpansionModule,
    MatSnackBarModule,
    UploadUrlPipe
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
                  <input matInput formControlName="productCode" placeholder="PRD-001" (blur)="checkProductCode()">
                  <mat-error *ngIf="productForm.get('productCode')?.hasError('required')">Product code is required</mat-error>
                  <mat-error *ngIf="productForm.get('productCode')?.hasError('duplicate')">Product code already exists</mat-error>
                  <mat-hint *ngIf="productCodeChecking()">Checking...</mat-hint>
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

              <div class="editor-field">
                <label>Full Description (Rich Text)</label>
                <div #descriptionEditor class="quill-editor"></div>
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
                  <mat-label>Designer</mat-label>
                  <mat-select formControlName="designerId">
                    <mat-option value="">None</mat-option>
                    <mat-option *ngFor="let designer of data.designers" [value]="designer._id">
                      {{ designer.name }}
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
                <mat-checkbox formControlName="isExclusive">Exclusive (Login Required)</mat-checkbox>
                <mat-checkbox formControlName="isFeatured">Featured</mat-checkbox>
              </div>
            </form>
          </div>
        </mat-tab>

        <!-- Media Tab -->
        <mat-tab label="Media">
          <div class="tab-content">
            <div class="media-section">
              <h3>Product Images</h3>
              <input type="file" #imageInput multiple accept="image/*" (change)="onImageSelect($event)" style="display:none">
              <button mat-raised-button (click)="imageInput.click()">
                <mat-icon>add_photo_alternate</mat-icon>
                Upload Images
              </button>
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
              <p *ngIf="uploadedImages().length" class="hint-text">
                <mat-icon>info</mat-icon> Click star to set featured image
              </p>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Or paste image URLs (comma separated)</mat-label>
                <input matInput [(ngModel)]="imageUrls" (keyup.enter)="addExternalImageUrls()" placeholder="https://...">
                <button mat-icon-button matSuffix (click)="addExternalImageUrls()" *ngIf="imageUrls.trim()" title="Add Links">
                  <mat-icon>add_link</mat-icon>
                </button>
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
                          <mat-form-field appearance="outline" class="option-code">
                            <mat-label>Product Code</mat-label>
                            <input matInput [value]="getVariationProductCode(i, j)" (input)="setVariationProductCode(i, j, $event)" placeholder="PRD-001-V1">
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

                      <div class="variation-images-section">
                        <h4>Variation Images (Optional)</h4>
                        <input type="file" #varImageInput multiple accept="image/*" (change)="onVariationImageSelect($event, i)" style="display:none">
                        <button mat-raised-button type="button" (click)="varImageInput.click()">
                          <mat-icon>add_photo_alternate</mat-icon>
                          Upload Images for {{ measurement.get('name')?.value }}
                        </button>
                        <div class="image-preview" *ngIf="getVariationImages(i).length">
                          <div *ngFor="let img of getVariationImages(i); let j = index" class="image-item" [class.featured]="getVariationFeaturedIndex(i) === j">
                            <img [src]="img | uploadUrl" />
                            <button mat-icon-button class="set-featured" (click)="setVariationFeaturedImage(i, j)" [class.active]="getVariationFeaturedIndex(i) === j">
                              <mat-icon>{{ getVariationFeaturedIndex(i) === j ? 'star' : 'star_border' }}</mat-icon>
                            </button>
                            <button mat-icon-button class="remove-btn" (click)="removeVariationImage(i, j)">
                              <mat-icon>close</mat-icon>
                            </button>
                          </div>
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

        <!-- Dimensions Tab -->
        <mat-tab label="Dimensions">
          <div class="tab-content">
            <form [formGroup]="productForm">
              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Product Shape</mat-label>
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

              <div *ngIf="productForm.get('dimensionShape')?.value === 'rectangle'">
                <h3>Rectangle Dimensions</h3>
                <div class="dimension-group">
                  <h4>Width (Customizable)</h4>
                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Min</mat-label>
                      <input matInput type="number" formControlName="widthMin" min="0">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Max</mat-label>
                      <input matInput type="number" formControlName="widthMax" min="0">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Default</mat-label>
                      <input matInput type="number" formControlName="widthDefault" min="0">
                    </mat-form-field>
                  </div>
                </div>

                <div class="dimension-group">
                  <h4>Height (Fixed)</h4>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Height</mat-label>
                    <input matInput type="number" formControlName="height" min="0">
                  </mat-form-field>
                </div>

                <div class="dimension-group">
                  <h4>Depth (Fixed)</h4>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Depth</mat-label>
                    <input matInput type="number" formControlName="depth" min="0">
                  </mat-form-field>
                </div>
              </div>

              <div *ngIf="productForm.get('dimensionShape')?.value === 'round'">
                <h3>Round Dimensions</h3>
                <div class="dimension-group">
                  <h4>Diameter (Customizable)</h4>
                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Min</mat-label>
                      <input matInput type="number" formControlName="diameterMin" min="0">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Max</mat-label>
                      <input matInput type="number" formControlName="diameterMax" min="0">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Default</mat-label>
                      <input matInput type="number" formControlName="diameterDefault" min="0">
                    </mat-form-field>
                  </div>
                </div>

                <div class="dimension-group">
                  <h4>Height (Fixed)</h4>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Height</mat-label>
                    <input matInput type="number" formControlName="height" min="0">
                  </mat-form-field>
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
    .option-code {
      flex: 1.5;
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
      width: 100%;
      max-height: 70vh;
    }
    .tab-content {
      padding: 1.5rem 0;
    }
    .product-form {
      width: 100%;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0.5rem;
      }
      .half-width {
        width: 100%;
      }
      .tab-content {
        padding: 1rem 0;
      }
    }
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      align-items: center;
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
    .image-item.featured {
      border: 3px solid #ffd700;
      border-radius: 4px;
    }
    .image-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    .image-item .remove-btn {
      position: absolute;
      top: -8px;
      right: -8px;
      background: white;
    }
    .image-item .set-featured {
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
    }
    .image-item .set-featured.active {
      color: #ffd700;
    }
    .hint-text {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
    .hint-text mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .variation-images-section {
      margin-top: 16px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .variation-images-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #666;
    }
    .dimension-group {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .dimension-group h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
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
export class ProductDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('descriptionEditor') descriptionEditorElement!: ElementRef;
  productForm: FormGroup;
  tags = signal<string[]>([]);
  uploadedImages = signal<string[]>([]);
  featuredImageIndex = signal<number>(-1);
  variationImages = signal<Map<number, string[]>>(new Map());
  variationFeaturedImages = signal<Map<number, number>>(new Map());
  variationProductCodes = signal<Map<number, Map<number, string>>>(new Map());
  saving = signal(false);
  productCodeChecking = signal(false);
  currency = signal('INR');
  currencySymbol = signal('₹');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  imageUrls = '';
  videoUrls = '';
  modelUrls = '';
  quillEditor: any;

  constructor(
    private fb: FormBuilder,
    private catalogueService: CatalogueService,
    private preferencesService: PreferencesService,
    private snackBar: MatSnackBar,
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
      currency: ['INR'],
      categoryId: [''],
      collectionId: [''],
      designerId: [''],
      isPublished: [false],
      isExclusive: [false],
      isFeatured: [false],
      dimensionShape: ['rectangle'],
      dimensionUnit: ['cm'],
      widthMin: [0],
      widthMax: [0],
      widthDefault: [0],
      height: [0],
      depth: [0],
      diameterMin: [0],
      diameterMax: [0],
      diameterDefault: [0],
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
        this.currency.set(prefs.currency || 'INR');
        this.currencySymbol.set(prefs.currencySymbol || '₹');
        this.productForm.patchValue({ currency: prefs.currency || 'INR' });
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
        designerId: p.designerId,
        isPublished: p.isPublished,
        isExclusive: p.isExclusive || false,
        isFeatured: p.isFeatured || false,
        dimensionShape: p.dimensionConfig?.shape || 'rectangle',
        dimensionUnit: p.dimensionConfig?.unit || 'cm',
        widthMin: p.dimensionConfig?.width?.min || 0,
        widthMax: p.dimensionConfig?.width?.max || 0,
        widthDefault: p.dimensionConfig?.width?.default || 0,
        height: p.dimensionConfig?.height || 0,
        depth: p.dimensionConfig?.depth || 0,
        diameterMin: p.dimensionConfig?.diameter?.min || 0,
        diameterMax: p.dimensionConfig?.diameter?.max || 0,
        diameterDefault: p.dimensionConfig?.diameter?.default || 0,
        seoTitle: p.seo?.title,
        seoDescription: p.seo?.description,
        seoKeywords: p.seo?.keywords
      });
      
      if (p.tags) this.tags.set(p.tags);
      
      // Initialize images: ensuring featuredImage is visible even if not in gallery
      let initialImages = [...(p.imageGallery || [])];
      if (p.featuredImage && p.featuredImage.trim() !== '' && !initialImages.includes(p.featuredImage)) {
        initialImages = [p.featuredImage, ...initialImages];
      }
      this.uploadedImages.set(initialImages);
      
      if (p.featuredImage) {
        const index = initialImages.indexOf(p.featuredImage);
        if (index !== -1) this.featuredImageIndex.set(index);
      }
      if (p.videos) this.videoUrls = p.videos.join(', ');
      if (p.models3d) this.modelUrls = p.models3d.join(', ');
      
      // Transform variations back to measurements for editing
      if (p.variations && p.variations.length > 0) {
        const measurementsMap = this.transformVariationsToMeasurements(p.variations);
        let measurementIndex = 0;
        measurementsMap.forEach((options, name) => {
          const measurementGroup = this.fb.group({
            name: [name],
            options: this.fb.array(options.map((o: any) => this.fb.group({
              value: [o.value],
              priceModifier: [o.priceModifier]
            })))
          });
          this.measurements.push(measurementGroup);
          
          // Restore variation images and product codes
          const variation = p.variations.find((v: any) => v[name]);
          if (variation) {
            if (variation.imageGallery && variation.imageGallery.length > 0) {
              const varImagesMap = new Map(this.variationImages());
              varImagesMap.set(measurementIndex, variation.imageGallery);
              this.variationImages.set(varImagesMap);
              
              if (variation.featuredImage) {
                const featuredIdx = variation.imageGallery.indexOf(variation.featuredImage);
                if (featuredIdx !== -1) {
                  const featuredMap = new Map(this.variationFeaturedImages());
                  featuredMap.set(measurementIndex, featuredIdx);
                  this.variationFeaturedImages.set(featuredMap);
                }
              }
            }
            
            // Restore product codes for each option
            const productCodesMap = new Map<number, string>();
            options.forEach((opt: any, optIdx: number) => {
              const varWithCode = p.variations.find((v: any) => v[name] === opt.value);
              if (varWithCode && varWithCode.sku) {
                productCodesMap.set(optIdx, varWithCode.sku);
              }
            });
            if (productCodesMap.size > 0) {
              const codesMap = new Map(this.variationProductCodes());
              codesMap.set(measurementIndex, productCodesMap);
              this.variationProductCodes.set(codesMap);
            }
          }
          measurementIndex++;
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

  ngAfterViewInit() {
    this.quillEditor = new Quill(this.descriptionEditorElement.nativeElement, {
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

    if (this.data?.product?.descriptionHtml) {
      this.quillEditor.root.innerHTML = this.data.product.descriptionHtml;
    }

    this.quillEditor.on('text-change', () => {
      this.productForm.patchValue({ descriptionHtml: this.quillEditor.root.innerHTML });
    });
  }

  checkProductCode() {
    const productCode = this.productForm.get('productCode')?.value;
    if (!productCode) return;

    this.productCodeChecking.set(true);
    const excludeId = this.data.product?._id;
    
    this.catalogueService.checkProductCodeExists(productCode, excludeId).subscribe({
      next: (result) => {
        this.productCodeChecking.set(false);
        if (result.exists) {
          this.productForm.get('productCode')?.setErrors({ duplicate: true });
        } else {
          const errors = this.productForm.get('productCode')?.errors;
          if (errors) {
            delete errors['duplicate'];
            this.productForm.get('productCode')?.setErrors(Object.keys(errors).length ? errors : null);
          }
        }
      },
      error: () => {
        this.productCodeChecking.set(false);
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
    const files = Array.from(event.target.files) as File[];
    if (files.length) {
      console.log('Uploading', files.length, 'images...');
      this.catalogueService.uploadProductImages(files).subscribe({
        next: (res) => {
          console.log('Upload response:', res);
          if (res.urls) {
            this.uploadedImages.update((imgs: string[]) => [...imgs, ...res.urls]);
            console.log('Images added:', res.urls);
            this.snackBar.open(`${res.urls.length} image(s) uploaded successfully`, 'Close', { duration: 2000 });
          }
        },
        error: (err) => {
          console.error('Image upload failed:', err);
          const message = err.error?.message || 'Failed to upload images';
          this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  addExternalImageUrls() {
    if (this.imageUrls && this.imageUrls.trim()) {
      const urls = this.imageUrls.split(',').map(u => u.trim()).filter(u => u);
      if (urls.length > 0) {
        this.uploadedImages.update(imgs => [...imgs, ...urls]);
        this.imageUrls = '';
        this.snackBar.open(`${urls.length} image(s) added to gallery`, 'Close', { duration: 2000 });
      }
    }
  }

  onVideoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploading video:', file.name);
      this.catalogueService.uploadProductVideo(file).subscribe({
        next: (res) => {
          console.log('Video upload response:', res);
          if (res.url) {
            this.videoUrls = this.videoUrls ? `${this.videoUrls}, ${res.url}` : res.url;
            this.snackBar.open('Video uploaded successfully', 'Close', { duration: 2000 });
          }
        },
        error: (err) => {
          console.error('Video upload failed:', err);
          const message = err.error?.message || 'Failed to upload video';
          this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  onModelSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploading 3D model:', file.name);
      this.catalogueService.uploadProduct3DModel(file).subscribe({
        next: (res) => {
          console.log('Model upload response:', res);
          if (res.url) {
            this.modelUrls = this.modelUrls ? `${this.modelUrls}, ${res.url}` : res.url;
            this.snackBar.open('3D model uploaded successfully', 'Close', { duration: 2000 });
          }
        },
        error: (err) => {
          console.error('Model upload failed:', err);
          const message = err.error?.message || 'Failed to upload 3D model';
          this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  removeImage(index: number) {
    this.uploadedImages.update((imgs: string[]) => imgs.filter((_: string, i: number) => i !== index));
    if (this.featuredImageIndex() === index) {
      this.featuredImageIndex.set(-1);
    } else if (this.featuredImageIndex() > index) {
      this.featuredImageIndex.update(idx => idx - 1);
    }
  }

  setFeaturedImage(index: number) {
    this.featuredImageIndex.set(index);
  }

  onVariationImageSelect(event: any, measurementIndex: number) {
    const files = Array.from(event.target.files) as File[];
    if (files.length) {
      this.catalogueService.uploadProductImages(files).subscribe({
        next: (res) => {
          if (res.urls) {
            const currentImages = this.variationImages().get(measurementIndex) || [];
            const newMap = new Map(this.variationImages());
            newMap.set(measurementIndex, [...currentImages, ...res.urls]);
            this.variationImages.set(newMap);
            this.snackBar.open(`${res.urls.length} variation image(s) uploaded`, 'Close', { duration: 2000 });
          }
        },
        error: (err) => {
          console.error('Image upload failed:', err);
          const message = err.error?.message || 'Failed to upload images';
          this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  getVariationImages(measurementIndex: number): string[] {
    return this.variationImages().get(measurementIndex) || [];
  }

  getVariationFeaturedIndex(measurementIndex: number): number {
    return this.variationFeaturedImages().get(measurementIndex) ?? -1;
  }

  setVariationFeaturedImage(measurementIndex: number, imageIndex: number) {
    const newMap = new Map(this.variationFeaturedImages());
    newMap.set(measurementIndex, imageIndex);
    this.variationFeaturedImages.set(newMap);
  }

  removeVariationImage(measurementIndex: number, imageIndex: number) {
    const currentImages = this.variationImages().get(measurementIndex) || [];
    const newMap = new Map(this.variationImages());
    newMap.set(measurementIndex, currentImages.filter((_, i) => i !== imageIndex));
    this.variationImages.set(newMap);
    
    const featuredIdx = this.variationFeaturedImages().get(measurementIndex);
    if (featuredIdx === imageIndex) {
      const featuredMap = new Map(this.variationFeaturedImages());
      featuredMap.set(measurementIndex, -1);
      this.variationFeaturedImages.set(featuredMap);
    } else if (featuredIdx !== undefined && featuredIdx > imageIndex) {
      const featuredMap = new Map(this.variationFeaturedImages());
      featuredMap.set(measurementIndex, featuredIdx - 1);
      this.variationFeaturedImages.set(featuredMap);
    }
  }

  getVariationProductCode(measurementIndex: number, optionIndex: number): string {
    return this.variationProductCodes().get(measurementIndex)?.get(optionIndex) || '';
  }

  setVariationProductCode(measurementIndex: number, optionIndex: number, event: any) {
    const code = event.target.value;
    const measurementMap = this.variationProductCodes().get(measurementIndex) || new Map();
    const newMeasurementMap = new Map(measurementMap);
    newMeasurementMap.set(optionIndex, code);
    
    const newMap = new Map(this.variationProductCodes());
    newMap.set(measurementIndex, newMeasurementMap);
    this.variationProductCodes.set(newMap);
  }

  onSave() {
    if (this.productForm.valid) {
      this.saving.set(true);
      
      // Add any remaining URLs from the input field
      if (this.imageUrls && this.imageUrls.trim()) {
        const urls = this.imageUrls.split(',').map(u => u.trim()).filter(u => u);
        this.uploadedImages.update(imgs => [...imgs, ...urls]);
        this.imageUrls = '';
      }
      
      const allImages = this.uploadedImages();
      
      const featuredImage = this.featuredImageIndex() >= 0 ? allImages[this.featuredImageIndex()] : (allImages[0] || '');
      
      const allVideos = this.videoUrls ? this.videoUrls.split(',').map(u => u.trim()) : [];
      const allModels = this.modelUrls ? this.modelUrls.split(',').map(u => u.trim()) : [];

      // Transform measurements to variations format
      const variations = this.transformMeasurementsToVariations(
        this.productForm.value.measurements || [],
        this.productForm.value.basePrice || 0
      );

      const productData = {
        ...this.productForm.value,
        tags: this.tags(),
        featuredImage: featuredImage,
        imageGallery: allImages,
        videos: allVideos,
        models3d: allModels,
        variations: variations,
        dimensionConfig: {
          shape: this.productForm.value.dimensionShape,
          unit: this.productForm.value.dimensionUnit,
          width: { min: this.productForm.value.widthMin, max: this.productForm.value.widthMax, default: this.productForm.value.widthDefault },
          height: this.productForm.value.height,
          depth: this.productForm.value.depth,
          diameter: { min: this.productForm.value.diameterMin, max: this.productForm.value.diameterMax, default: this.productForm.value.diameterDefault }
        },
        seo: {
          title: this.productForm.value.seoTitle,
          description: this.productForm.value.seoDescription,
          keywords: this.productForm.value.seoKeywords
        }
      };

      delete productData.measurements;
      delete productData.dimensionShape;
      delete productData.dimensionUnit;
      delete productData.widthMin;
      delete productData.widthMax;
      delete productData.widthDefault;
      delete productData.height;
      delete productData.depth;
      delete productData.diameterMin;
      delete productData.diameterMax;
      delete productData.diameterDefault;
      delete productData.seoTitle;
      delete productData.seoDescription;
      delete productData.seoKeywords;

      const request = this.data.product 
        ? this.catalogueService.updateProduct(this.data.product._id, productData)
        : this.catalogueService.createProduct(productData);

      request.subscribe({
        next: () => {
          this.saving.set(false);
          this.snackBar.open('Product saved successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.saving.set(false);
          const message = err.error?.message || err.message || 'Failed to save product';
          this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  private transformMeasurementsToVariations(measurements: any[], basePrice: number): any[] {
    if (!measurements || measurements.length === 0) return [];

    const variations: any[] = [];
    let variationCounter = 1;
    
    // Generate all combinations of measurement options
    const generateCombinations = (index: number, current: any, optionIndices: number[]) => {
      if (index === measurements.length) {
        const variationName = Object.values(current).join(' - ');
        const totalModifier = Object.keys(current).reduce((sum, key) => {
          const measurement = measurements.find(m => m.name === key);
          const option = measurement?.options?.find((o: any) => o.value === current[key]);
          return sum + (option?.priceModifier || 0);
        }, 0);

        // Get images and product code for this variation
        const measurementIndex = optionIndices[0];
        const optionIndex = optionIndices[optionIndices.length - 1];
        const varImages = this.variationImages().get(measurementIndex) || [];
        const varFeaturedIdx = this.variationFeaturedImages().get(measurementIndex) ?? -1;
        const varFeaturedImage = varFeaturedIdx >= 0 ? varImages[varFeaturedIdx] : (varImages[0] || '');
        const varProductCode = this.variationProductCodes().get(measurementIndex)?.get(optionIndex) || 
                               `${this.productForm.value.productCode}-V${variationCounter}`;

        variations.push({
          name: variationName,
          sku: varProductCode,
          featuredImage: varFeaturedImage,
          imageGallery: varImages,
          dimensions: {},
          price: basePrice + totalModifier,
          priceModifier: totalModifier,
          isAvailable: true,
          ...current
        });
        variationCounter++;
        return;
      }

      const measurement = measurements[index];
      if (measurement.options && measurement.options.length > 0) {
        measurement.options.forEach((option: any, optIdx: number) => {
          generateCombinations(index + 1, {
            ...current,
            [measurement.name]: option.value
          }, [...optionIndices, optIdx]);
        });
      } else {
        generateCombinations(index + 1, current, optionIndices);
      }
    };

    generateCombinations(0, {}, []);
    return variations;
  }

  onCancel() {
    this.dialogRef.close();
  }

  private transformVariationsToMeasurements(variations: any[]): Map<string, any[]> {
    const measurementsMap = new Map<string, any[]>();
    const excludeKeys = ['name', 'sku', 'imageGallery', 'dimensions', 'price', 'priceModifier', 'isAvailable', '_id', 'featuredImage'];
    
    variations.forEach(variation => {
      Object.keys(variation).forEach(key => {
        if (!excludeKeys.includes(key)) {
          if (!measurementsMap.has(key)) {
            measurementsMap.set(key, []);
          }
          const options = measurementsMap.get(key)!;
          const existingOption = options.find(o => o.value === variation[key]);
          if (!existingOption) {
            options.push({
              value: variation[key],
              priceModifier: variation.priceModifier || 0
            });
          }
        }
      });
    });
    
    return measurementsMap;
  }
}
