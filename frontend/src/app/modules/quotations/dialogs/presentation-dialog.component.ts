import { Component, Inject, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { FormControl, AbstractControl } from '@angular/forms';
import { QuotationsService } from '../quotations.service';
import { CatalogueService } from '../../catalogue/catalogue.service';
import { ClientManagementService } from '../../client-management/services/client-management.service';
import { HttpClient } from '@angular/common/http';
import { getBrandConfig } from '../../../brand.config';

@Component({
  selector: 'app-presentation-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatRadioModule,
    MatAutocompleteModule, MatChipsModule
  ],
  template: `
    <h2 mat-dialog-title>{{data ? 'Edit' : 'Create'}} Presentation</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Client</mat-label>
          <mat-select formControlName="clientId" required (selectionChange)="onClientChange($event)">
            <mat-option *ngFor="let client of clients" [value]="client._id">
              {{client.contactPerson}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Enquiry (Optional)</mat-label>
          <mat-select formControlName="enquiryId">
            <mat-option [value]="null">None</mat-option>
            <mat-option *ngFor="let enq of enquiries" [value]="enq._id">{{enq.enquiryNumber}}</mat-option>
          </mat-select>
        </mat-form-field>

        <h3>Cover Slide Settings</h3>
        <div class="slide-item">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Background Image</mat-label>
            <input matInput formControlName="coverBackground" readonly>
          </mat-form-field>
          <input type="file" #coverFile (change)="onCoverImageSelect($event)" accept="image/*" style="display:none">
          <button mat-button type="button" (click)="coverFile.click()">
            <mat-icon>upload</mat-icon> Upload Background
          </button>
          <img *ngIf="coverImagePreview" [src]="coverImagePreview" style="max-width:200px;margin-top:10px">

          <div class="color-controls">
            <div class="color-field">
              <label>Overlay Color</label>
              <input type="color" formControlName="overlayColor">
            </div>
            <mat-form-field appearance="outline" class="slider-field">
              <mat-label>Overlay Transparency (%)</mat-label>
              <input matInput type="number" formControlName="overlayTransparency" min="0" max="100">
            </mat-form-field>
            <div class="color-field">
              <label>Text Color</label>
              <input type="color" formControlName="textColor">
            </div>
          </div>
        </div>

        <h3>Layout Slide (Slide 2)</h3>
        <div class="slide-item">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Layout Image</mat-label>
            <input matInput formControlName="layoutImage" readonly>
          </mat-form-field>
          <input type="file" #layoutFile (change)="onLayoutImageSelect($event)" accept="image/*" style="display:none">
          <button mat-button type="button" (click)="layoutFile.click()">
            <mat-icon>upload</mat-icon> Upload Layout
          </button>
          <img *ngIf="layoutImagePreview" [src]="layoutImagePreview" style="max-width:200px;margin-top:10px">
        </div>

        <h3>Product Slides</h3>
        <div formArrayName="slides">
          <div *ngFor="let slide of slides.controls; let i = index" [formGroupName]="i" class="slide-item">
            <h4>Slide {{i + 3}}</h4>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Slide Title (Optional)</mat-label>
              <input matInput formControlName="slideTitle">
            </mat-form-field>

            <mat-radio-group formControlName="layout">
              <mat-radio-button value="single">Single Product</mat-radio-button>
              <mat-radio-button value="multiple">Multiple Products</mat-radio-button>
            </mat-radio-group>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Search Products (Name or Code)</mat-label>
              <mat-chip-grid #chipGrid aria-label="Product selection">
                <mat-chip-row *ngFor="let prodId of slide.get('productIds')?.value" (removed)="removeProduct(i, prodId)">
                  {{getProductName(prodId)}}
                  <button matChipRemove [attr.aria-label]="'remove ' + getProductName(prodId)">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip-row>
              </mat-chip-grid>
              <input placeholder="Type to search..." #productInput [formControl]="getSearchControl(i)"
                 [matChipInputFor]="chipGrid" [matAutocomplete]="auto">
              <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onProductSelected(i, $event); productInput.value=''">
                <mat-option *ngFor="let product of getSearchOptions(slide.get('searchControl')) | async" [value]="product._id">
                  {{product.name}} ({{product.productCode}})
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <button mat-icon-button color="warn" (click)="removeSlide(i)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <button mat-button (click)="addSlide()">
          <mat-icon>add</mat-icon> Add Slide
        </button>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.valid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 16px; }
    .slide-item { border: 1px solid #ddd; padding: 16px; margin-bottom: 16px; border-radius: 4px; }
    mat-radio-button { margin-right: 16px; }
    .color-controls { display: flex; gap: 16px; margin-top: 16px; align-items: flex-end; }
    .color-field { display: flex; flex-direction: column; gap: 4px; }
    .color-field label { font-size: 12px; color: #666; }
    .color-field input[type="color"] { width: 60px; height: 40px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
    .slider-field { flex: 1; margin-bottom: 0 !important; }
  `]
})
export class PresentationDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private quotationsService = inject(QuotationsService);
  private catalogueService = inject(CatalogueService);
  private clientService = inject(ClientManagementService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  dialogRef = inject(MatDialogRef<PresentationDialogComponent>);

  form: FormGroup;
  clients: any[] = [];
  enquiries: any[] = [];
  products: any[] = [];
  coverImagePreview: string | null = null;
  coverImageFile: File | null = null;
  layoutImagePreview: string | null = null;
  layoutImageFile: File | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      clientId: ['', Validators.required],
      clientName: [''],
      enquiryId: [null],
      coverBackground: [''],
      overlayColor: ['#000000'],
      overlayTransparency: [50],
      textColor: ['#FFFFFF'],
      layoutImage: [''],
      slides: this.fb.array([])
    });
  }
  
  // Cache for search options observables
  searchOptionsMap = new Map<AbstractControl, Observable<any[]>>();

  ngOnInit() {
    this.loadClients();
    this.loadEnquiries();
    this.loadProducts();

    if (this.data) {
      this.form.patchValue(this.data);
      if (this.data.coverBackground) {
        const apiUrl = getBrandConfig().app.apiUrl.replace('/api', '');
        this.coverImagePreview = this.data.coverBackground.startsWith('http') 
          ? this.data.coverBackground 
          : `${apiUrl}${this.data.coverBackground}`;
      }
      if (this.data.layoutImage) {
        const apiUrl = getBrandConfig().app.apiUrl.replace('/api', '');
        this.layoutImagePreview = this.data.layoutImage.startsWith('http') 
          ? this.data.layoutImage 
          : `${apiUrl}${this.data.layoutImage}`;
      }
       
      // No parallel init needed anymore

      
      this.data.slides?.forEach((slide: any) => {
        this.slides.push(this.fb.group({
          slideNumber: [slide.slideNumber],
          layout: [slide.layout],
          productIds: [slide.productIds],
          products: [slide.products || []],
          slideTitle: [slide.slideTitle || ''],
          searchControl: ['']
        }));
      });
    }
  }

  get slides() {
    return this.form.get('slides') as FormArray;
  }

  loadClients() {
    this.clientService.getAllClients().subscribe(clients => {
      this.clients = clients;
      this.cdr.detectChanges();
    });
  }

  loadEnquiries() {
    this.quotationsService.getAllEnquiries().subscribe(data => {
      this.enquiries = data;
      this.cdr.detectChanges();
    });
  }

  loadProducts() {
    console.log('PresentationDialog: Requesting products with limit 1000, isPublished=true');
    this.catalogueService.getProducts({ limit: 1000, isPublished: true }).subscribe(data => {
      console.log('PresentationDialog: Raw API response:', data);
      
      if (data && data.items) {
        this.products = data.items;
        console.log('PresentationDialog: Encapsulated items found. Total products:', this.products.length);
      } else if (Array.isArray(data)) {
        this.products = data;
        console.log('PresentationDialog: Array response. Total products:', this.products.length);
      } else {
        console.warn('PresentationDialog: Unexpected response format', data);
      }

      
      
      // Update validity of all search controls in the slides FormArray
      this.slides.controls.forEach(slideGroup => {
          const control = slideGroup.get('searchControl');
          if (control) {
            control.updateValueAndValidity({ emitEvent: true });
          }
      });
      
      this.cdr.detectChanges();
    });
  }

  // Helper to safely get the FormControl for search
  getSearchControl(index: number): FormControl {
    return this.slides.at(index).get('searchControl') as FormControl;
  }

  // Helper to get or create the filtered options observable for a specific control
  getSearchOptions(control: AbstractControl | null): Observable<any[]> {
    if (!control) return new Observable(); // Should not happen
    
    if (!this.searchOptionsMap.has(control)) {
      const options$ = control.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterProducts(value || ''))
      );
      this.searchOptionsMap.set(control, options$);
    }
    
    return this.searchOptionsMap.get(control)!;
  }
  
  // Clean up cache when removing slides (optional, but good practice)
  private clearSearchOptionCache(control: AbstractControl) {
      this.searchOptionsMap.delete(control);
  }

  // Removed unused methods: getFilteredProducts, getProductSearchControl


  private _filterProducts(value: string): any[] {
    if (!this.products) {
        console.warn('PresentationDialog: Products not yet loaded');
        return [];
    }
    
    // Trim and lower case the search term
    const filterValue = (value || '').toLowerCase().trim();
    
    // If empty search, return all products (or maybe slice for performance if needed, but previously we wanted all)
    // However, mat-autocomplete usually needs ALL options to be available for initial display correctly.
    // If no filter, just return products.
    if (!filterValue) {
        return this.products;
    }

    const result = this.products.filter(product => {
      // Safely access properties and ensure they adhere to string type
      const name = (product.name || '').toLowerCase();
      const code = (product.productCode || '').toLowerCase();
      
      return name.includes(filterValue) || code.includes(filterValue);
    });

    // Sort to prioritize better matches
    result.sort((a, b) => {
      const aName = a.name?.toLowerCase() || '';
      const bName = b.name?.toLowerCase() || '';
      const aCode = a.productCode?.toLowerCase() || '';
      const bCode = b.productCode?.toLowerCase() || '';

      // 1. Exact match works best
      if (aCode === filterValue) return -1;
      if (bCode === filterValue) return 1;
      if (aName === filterValue) return -1;
      if (bName === filterValue) return 1;

      // 2. Starts with serves better than just includes
      const aStarts = aName.startsWith(filterValue) || aCode.startsWith(filterValue);
      const bStarts = bName.startsWith(filterValue) || bCode.startsWith(filterValue);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return 0;
    });
    
    console.log(`PresentationDialog: Search "${value}" yielded ${result.length} results from ${this.products.length} products`);
    return result;
  }

  getProductName(id: string): string {
    const product = this.products.find(p => p._id === id);
    return product ? `${product.name} (${product.productCode})` : 'Unknown Product';
  }

  onProductSelected(slideIndex: number, event: any) {
    const productId = event.option.value;
    const slide = this.slides.at(slideIndex);
    const currentProducts = slide.get('productIds')?.value || [];
    const currentProductDetails = slide.get('products')?.value || [];
    
    const layout = slide.get('layout')?.value;

    if (layout === 'single') {
      // Replace existing with new one
      slide.patchValue({
         productIds: [productId],
         products: [{ productId }]
      });
    } else {
      // Multiple mode
      if (!currentProducts.includes(productId)) {
        slide.patchValue({
          productIds: [...currentProducts, productId],
          products: [...currentProductDetails, { productId }]
        });
      }
    }
    
    // Reset search input
    const control = this.slides.at(slideIndex).get('searchControl');
    if (control) {
        control.setValue('');
    }
  }

  removeProduct(slideIndex: number, productId: string) {
    const slide = this.slides.at(slideIndex);
    const currentProducts = slide.get('productIds')?.value || [];
    const currentProductDetails = slide.get('products')?.value || [];
    const index = currentProducts.indexOf(productId);

    if (index >= 0) {
      const newProducts = [...currentProducts];
      newProducts.splice(index, 1);
      const newProductDetails = currentProductDetails.filter((p: any) => p.productId !== productId);
      slide.patchValue({
        productIds: newProducts,
        products: newProductDetails
      });
    }
  }

  onClientChange(event: any) {
    const client = this.clients.find(c => c._id === event.value);
    if (client) {
      this.form.patchValue({ 
        clientName: client.contactPerson
      });
    }
  }

  addSlide() {
    this.slides.push(this.fb.group({
      slideNumber: [this.slides.length + 3],
      layout: ['single'],
      productIds: [[], Validators.required],
      products: [[]],
      slideTitle: [''],
      searchControl: ['']
    }));
  }

  removeSlide(index: number) {
    const control = this.slides.at(index).get('searchControl');
    if (control) {
        this.clearSearchOptionCache(control);
    }
    this.slides.removeAt(index);
  }

  onCoverImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.coverImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coverImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onLayoutImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.layoutImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.layoutImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadCoverImage(): Promise<string | null> {
    if (!this.coverImageFile) return null;
    
    const formData = new FormData();
    formData.append('file', this.coverImageFile);
    
    try {
      const response: any = await this.http.post(`${getBrandConfig().app.apiUrl}/catalogue/upload`, formData).toPromise();
      return response.url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }

  async uploadLayoutImage(): Promise<string | null> {
    if (!this.layoutImageFile) return null;
    
    const formData = new FormData();
    formData.append('file', this.layoutImageFile);
    
    try {
      const response: any = await this.http.post(`${getBrandConfig().app.apiUrl}/catalogue/upload`, formData).toPromise();
      return response.url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }

  async save() {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      // Clean up searchControl from slides before saving
      const slides = formValue.slides.map((slide: any) => {
          const { searchControl, ...rest } = slide;
          return rest;
      });
      
      let formData = { ...formValue, slides };
      
      if (this.coverImageFile) {
        const uploadedUrl = await this.uploadCoverImage();
        if (uploadedUrl) {
          formData.coverBackground = uploadedUrl;
        }
      }
      
      if (this.layoutImageFile) {
        const uploadedUrl = await this.uploadLayoutImage();
        if (uploadedUrl) {
          formData.layoutImage = uploadedUrl;
        }
      }
      
      const request = this.data
        ? this.quotationsService.updatePresentation(this.data._id, formData)
        : this.quotationsService.createPresentation(formData);

      request.subscribe(() => this.dialogRef.close(true));
    }
  }
}
