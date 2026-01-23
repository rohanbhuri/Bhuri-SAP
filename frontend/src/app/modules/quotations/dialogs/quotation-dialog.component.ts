import { Component, OnInit, inject, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { QuotationsService } from '../quotations.service';
import { ClientManagementService } from '../../client-management/services/client-management.service';
import { CatalogueService } from '../../catalogue/catalogue.service';
import { PreferencesService } from '../../../services/preferences.service';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-quotation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatRadioModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Edit Quotation' : 'Create Manual Quotation' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Search Client</mat-label>
          <input matInput formControlName="clientSearch" [matAutocomplete]="autoClient" placeholder="Type to search...">
          <mat-autocomplete #autoClient="matAutocomplete" (optionSelected)="onClientSelected($event)" [displayWith]="displayClient">
            <mat-option *ngFor="let client of filteredClients | async" [value]="client">
              {{ client.contactPerson }}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>

        <h3>Items</h3>
        <div formArrayName="items">
          <div *ngFor="let item of items.controls; let i=index" [formGroupName]="i" class="item-card">
            <div class="item-row">
              <mat-form-field appearance="outline" class="product-field">
                <mat-label>Search Product</mat-label>
                <input matInput formControlName="productSearch" [matAutocomplete]="autoProduct" placeholder="Type to search...">
                <mat-autocomplete #autoProduct="matAutocomplete" (optionSelected)="onProductSelected(i, $event)" [displayWith]="displayProduct">
                  <mat-option *ngFor="let product of getFilteredProducts(i) | async" [value]="product">
                    {{ product.name }} ({{ product.productCode }})
                  </mat-option>
                </mat-autocomplete>
              </mat-form-field>

              <mat-form-field appearance="outline" class="variation-field" *ngIf="getProductVariations(i).length > 0">
                <mat-label>Variation</mat-label>
                <mat-select formControlName="variationId" (selectionChange)="onVariationChange(i, $event)">
                  <mat-option value="">Base Product</mat-option>
                  <mat-option *ngFor="let variation of getProductVariations(i); let vi = index" [value]="variation.sku || vi">
                    {{variation.name}} (+{{currencySymbol}}{{variation.priceModifier}})
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="qty-field">
                <mat-label>Qty</mat-label>
                <input matInput type="number" formControlName="quantity" min="1" required>
              </mat-form-field>

              <button mat-icon-button color="warn" type="button" (click)="removeItem(i)" class="delete-btn">
                <mat-icon>delete</mat-icon>
              </button>
            </div>

            <div class="price-row" *ngIf="item.get('productId')?.value">
              <mat-form-field appearance="outline" class="dimension-field" *ngIf="getProductShape(i) === 'rectangle' && !isSofa(i)">
                <mat-label>Width</mat-label>
                <input matInput type="number" formControlName="customWidth" 
                  [min]="getProductDimensionMin(i, 'width')" 
                  [max]="getProductDimensionMax(i, 'width')"
                  (input)="onDimensionChange(i)">
                <mat-hint>Range: {{getProductDimensionMin(i, 'width')}} - {{getProductDimensionMax(i, 'width')}}</mat-hint>
              </mat-form-field>

              <div class="dimension-field" *ngIf="getProductShape(i) === 'rectangle' && isSofa(i)">
                <mat-label>Width (300mm)</mat-label>
                <input type="range"
                  formControlName="customWidth"
                  [min]="getProductDimensionMin(i, 'width')"
                  [max]="getProductDimensionMax(i, 'width')"
                  [step]="300"
                  (input)="onDimensionChange(i)"
                  class="sofa-slider">
                <mat-hint>Range: {{getProductDimensionMin(i, 'width')}} - {{getProductDimensionMax(i, 'width')}} | Seats: {{calculateSeats(item.get('customWidth')?.value)}}</mat-hint>
              </div>

              <mat-form-field appearance="outline" class="dimension-field" *ngIf="getProductShape(i) === 'round'">
                <mat-label>Diameter</mat-label>
                <input matInput type="number" formControlName="customDiameter" 
                  [min]="getProductDimensionMin(i, 'diameter')" 
                  [max]="getProductDimensionMax(i, 'diameter')"
                  (input)="onDimensionChange(i)">
                <mat-hint>Range: {{getProductDimensionMin(i, 'diameter')}} - {{getProductDimensionMax(i, 'diameter')}}</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="dimension-field">
                <mat-label>Depth (Fixed)</mat-label>
                <input matInput type="number" formControlName="customDepth" readonly>
              </mat-form-field>

              <mat-form-field appearance="outline" class="dimension-field">
                <mat-label>Height (Fixed)</mat-label>
                <input matInput type="number" formControlName="customHeight" readonly>
              </mat-form-field>

              <mat-form-field appearance="outline" class="price-field">
                <mat-label>Original Price</mat-label>
                <input matInput type="number" formControlName="originalPrice" readonly>
              </mat-form-field>

              <mat-form-field appearance="outline" class="price-field">
                <mat-label>Custom Price</mat-label>
                <input matInput type="number" formControlName="unitPrice" step="0.01" min="0" required>
              </mat-form-field>

              <div class="item-total">
                <span class="label">Total:</span>
                <span class="value">{{currencySymbol}}{{ getItemTotal(i).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <button mat-button type="button" (click)="addItem()">
          <mat-icon>add</mat-icon>
          Add Item
        </button>

        <div class="totals" *ngIf="items.length > 0">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>{{currencySymbol}}{{ calculateSubtotal().toFixed(2) }}</span>
          </div>

          <div class="discount-section">
            <div class="discount-header">
              <span>Discount:</span>
              <mat-radio-group formControlName="discountType" class="discount-radio">
                <mat-radio-button value="none">None</mat-radio-button>
                <mat-radio-button value="fixed">Fixed</mat-radio-button>
                <mat-radio-button value="percentage">%</mat-radio-button>
              </mat-radio-group>
            </div>
            
            <div class="discount-input" *ngIf="form.get('discountType')?.value !== 'none'">
              <mat-form-field appearance="outline">
                <mat-label>{{ form.get('discountType')?.value === 'percentage' ? 'Percentage' : 'Amount' }}</mat-label>
                <input matInput type="number" formControlName="discountValue" step="0.01" min="0" 
                  [max]="form.get('discountType')?.value === 'percentage' ? 100 : calculateSubtotal()">
                <span matSuffix>{{ form.get('discountType')?.value === 'percentage' ? '%' : currencySymbol }}</span>
              </mat-form-field>
              <span class="discount-amount">-{{currencySymbol}}{{ calculateDiscountAmount().toFixed(2) }}</span>
            </div>
          </div>

          <div class="total-row grand-total">
            <span><strong>Grand Total:</strong></span>
            <span><strong>{{currencySymbol}}{{ calculateGrandTotal().toFixed(2) }}</strong></span>
          </div>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!selectedClient || items.length === 0">
        {{ isEditMode ? 'Update Quotation' : 'Create Quotation' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { max-height: 70vh; overflow-y: auto; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .item-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #fafafa; }
    .item-row { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px; }
    .item-row mat-form-field { margin-bottom: 0; }
    .product-field { flex: 2; min-width: 250px; }
    .variation-field { flex: 1.5; min-width: 200px; }
    .qty-field { width: 100px; flex-shrink: 0; }
    .delete-btn { flex-shrink: 0; margin-top: 8px; }
    .price-row { display: flex; gap: 12px; align-items: flex-start; }
    .price-row mat-form-field { margin-bottom: 0; }
    .price-field { flex: 1; min-width: 150px; }
    .dimension-field { flex: 1; min-width: 120px; }
    .dimension-field mat-slider { width: 100%; margin-bottom: 8px; }
    .sofa-slider { width: 100%; margin-bottom: 8px; }
    .item-total { display: flex; flex-direction: column; align-items: flex-end; min-width: 140px; padding: 12px; background: #e3f2fd; border-radius: 4px; margin-top: 8px; }
    .item-total .label { font-size: 11px; color: #666; }
    .item-total .value { font-size: 18px; font-weight: 600; font-family: monospace; color: #1976d2; }
    .totals { margin-top: 20px; padding: 20px; background: #f5f5f5; border-radius: 8px; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
    .grand-total { font-size: 20px; padding-top: 16px; border-top: 2px solid #ddd; margin-top: 12px; }
    .discount-section { margin: 16px 0; padding: 16px; background: white; border-radius: 4px; }
    .discount-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 12px; }
    .discount-radio { display: flex; gap: 16px; }
    .discount-input { display: flex; gap: 12px; align-items: center; margin-top: 8px; }
    .discount-input mat-form-field { width: 200px; margin-bottom: 0; }
    .discount-amount { font-weight: 600; color: #d32f2f; font-family: monospace; font-size: 16px; min-width: 120px; text-align: right; }
    h3 { margin: 20px 0 12px; font-size: 17px; font-weight: 500; }
  `]
})
export class QuotationDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<QuotationDialogComponent>);
  private fb = inject(FormBuilder);
  private quotationsService = inject(QuotationsService);
  private clientService = inject(ClientManagementService);
  private catalogueService = inject(CatalogueService);
  private preferencesService = inject(PreferencesService);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup;
  clients: any[] = [];
  products: any[] = [];
  categories: any[] = [];
  filteredClients: Observable<any[]>;
  selectedClient: any = null;
  selectedProducts: Map<number, any> = new Map();
  currencySymbol = '₹';
  currency = 'INR';
  isEditMode = false;
  quotationId?: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      clientSearch: [''],
      discountType: ['none'],
      discountValue: [0],
      items: this.fb.array([])
    });
    
    // Initialize filteredClients immediately to prevent template errors
    this.filteredClients = this.form.get('clientSearch')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterClients(typeof value === 'string' ? value : value?.companyName || ''))
    );
  }

  ngOnInit() {
    this.loadClients();
    this.loadProducts();
    this.loadCategories();
    this.loadCurrencyPreferences();
    
    if (this.data?.quotation) {
      if (this.data.mode === 'create-from-presentation') {
        this.isEditMode = false;
        setTimeout(() => this.loadQuotationDataFromPresentation(this.data.quotation));
      } else {
        this.isEditMode = true;
        this.quotationId = this.data.quotation._id;
        setTimeout(() => this.loadQuotationData(this.data.quotation));
      }
    } else {
      setTimeout(() => this.addItem());
    }
  }

  loadCurrencyPreferences() {
    this.preferencesService.getUserPreferences().subscribe({
      next: (prefs) => {
        if (prefs) {
          this.currency = prefs.currency || 'INR';
          this.currencySymbol = prefs.currencySymbol || '₹';
          this.cdr.detectChanges();
        }
      },
      error: () => console.log('Using default currency')
    });
  }

  loadQuotationData(quotation: any) {
    // Wait for clients and products to load first
    const checkDataLoaded = setInterval(() => {
      if (this.clients.length > 0 && this.products.length > 0) {
        clearInterval(checkDataLoaded);
        
        // Find and set client
        const client = this.clients.find(c => c._id === quotation.clientId);
        if (client) {
          this.selectedClient = client;
          this.form.patchValue({ clientSearch: client });
        }

        // Set discount
        if (quotation.discount) {
          this.form.patchValue({
            discountType: quotation.discount.type,
            discountValue: quotation.discount.value
          });
        }

        // Load items
        quotation.items.forEach((item: any) => {
          const itemGroup = this.fb.group({
            productSearch: [''],
            productId: [item.productId || ''],
            variationId: [item.variationId || ''],
            variationName: [item.variationName || ''],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            customWidth: [item.customDimensions?.width || 0],
            customDiameter: [item.customDimensions?.diameter || 0],
            customDepth: [item.customDimensions?.depth || 0],
            customHeight: [item.customDimensions?.height || 0],
            originalPrice: [item.originalPrice || item.unitPrice],
            unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]]
          });

          // Find and set product
          if (item.productId) {
            const product = this.products.find(p => p._id === item.productId);
            if (product) {
              const index = this.items.length;
              this.selectedProducts.set(index, product);
              itemGroup.patchValue({ productSearch: product });
              
              // Prefetch dimensions from product if not in item
              if (!item.customDimensions?.width && !item.customDimensions?.diameter && product.dimensionConfig) {
                itemGroup.patchValue({
                  customWidth: product.dimensionConfig.width?.default || 0,
                  customDiameter: product.dimensionConfig.diameter?.default || 0,
                  customDepth: product.dimensionConfig.depth || 0,
                  customHeight: product.dimensionConfig.height || 0
                });
              }
            }
          }

          this.items.push(itemGroup);
        });
        
        this.cdr.detectChanges();
      }
    }, 100);
  }

  loadQuotationDataFromPresentation(quotationData: any) {
    // Wait for clients and products to load first
    const checkDataLoaded = setInterval(() => {
      if (this.clients.length > 0 && this.products.length > 0) {
        clearInterval(checkDataLoaded);
        
        // Find and set client
        const client = this.clients.find(c => c._id === quotationData.clientId);
        if (client) {
          this.selectedClient = client;
          this.form.patchValue({ clientSearch: client });
        }

        // Load items from presentation
        quotationData.items.forEach((item: any) => {
          const itemGroup = this.fb.group({
            productSearch: [''],
            productId: [item.productId || ''],
            variationId: [''],
            variationName: [''],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            customWidth: [item.customDimensions?.width || 0],
            customDiameter: [item.customDimensions?.diameter || 0],
            customDepth: [item.customDimensions?.depth || 0],
            customHeight: [item.customDimensions?.height || 0],
            originalPrice: [item.originalPrice || item.unitPrice],
            unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]]
          });

          // Find and set product
          if (item.productId) {
            const product = this.products.find(p => p._id === item.productId);
            if (product) {
              const index = this.items.length;
              this.selectedProducts.set(index, product);
              itemGroup.patchValue({ productSearch: product });
              
              // Prefetch dimensions from product if not in item
              if (!item.customDimensions?.width && !item.customDimensions?.diameter && product.dimensionConfig) {
                itemGroup.patchValue({
                  customWidth: product.dimensionConfig.width?.default || 0,
                  customDiameter: product.dimensionConfig.diameter?.default || 0,
                  customDepth: product.dimensionConfig.depth || 0,
                  customHeight: product.dimensionConfig.height || 0
                });
              }
            }
          }

          this.items.push(itemGroup);
        });
        
        this.cdr.detectChanges();
      }
    }, 100);
  }

  get items() {
    return this.form.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.fb.group({
      productSearch: [''],
      productId: [''],
      variationId: [''],
      variationName: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      customWidth: [0],
      customDiameter: [0],
      customDepth: [0],
      customHeight: [0],
      originalPrice: [0],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.selectedProducts.delete(index);
  }

  loadClients() {
    this.clientService.getAllClients().subscribe((clients: any) => {
      this.clients = clients;
      this.filteredClients = this.form.get('clientSearch')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterClients(typeof value === 'string' ? value : value?.companyName || ''))
      );
      this.cdr.detectChanges();
    });
  }

  loadProducts() {
    console.log('QuotationDialog: Requesting products with limit 1000, isPublished=true');
    this.catalogueService.getProducts({ limit: 1000, isPublished: true }).subscribe((data: any) => {
      console.log('QuotationDialog: Raw API response:', data);
      
      if (data && data.items) {
        this.products = data.items;
        console.log('QuotationDialog: Encapsulated items found. Total products:', this.products.length);
      } else if (Array.isArray(data)) {
        this.products = data;
        console.log('QuotationDialog: Array response. Total products:', this.products.length);
      } else {
        console.warn('QuotationDialog: Unexpected response format', data);
      }
      
      this.cdr.detectChanges();
    });
  }

  loadCategories() {
    this.catalogueService.getCategories().subscribe((categories: any) => {
      this.categories = categories;
      this.cdr.detectChanges();
    });
  }

  private _filterClients(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.clients.filter(client => 
      client.companyName?.toLowerCase().includes(filterValue) || 
      client.contactPerson?.toLowerCase().includes(filterValue) ||
      client.email?.toLowerCase().includes(filterValue)
    ).slice(0, 50);
  }

  private _filterProducts(value: string): any[] {
    if (!this.products) {
        console.warn('QuotationDialog: Products not yet loaded');
        return [];
    }
    
    const filterValue = value.toLowerCase().trim();
    
    if (!filterValue) {
        return this.products;
    }
    
    const result = this.products.filter(product => 
      product.name?.toLowerCase().includes(filterValue) ||
      product.productCode?.toLowerCase().includes(filterValue)
    );
    
    console.log(`QuotationDialog: Search "${value}" yielded ${result.length} results from ${this.products.length} products`);
    return result;
  }

  getFilteredProducts(index: number): Observable<any[]> {
    const item = this.items.at(index);
    const control = item.get('productSearch')!;
    
    return control.valueChanges.pipe(
      startWith(control.value || ''),
      map(value => {
        // Extract string from value - could be string, object, or empty
        let searchTerm = '';
        if (typeof value === 'string') {
          searchTerm = value;
        } else if (value && typeof value === 'object') {
          // If it's an object (selected product), use its name for display but don't filter
          searchTerm = value.name || '';
        }
        
        console.log(`QuotationDialog: Filtering products for item ${index}, search term: "${searchTerm}"`);
        return this._filterProducts(searchTerm);
      })
    );
  }

  displayClient(client: any): string {
    return client ? client.contactPerson : '';
  }

  displayProduct(product: any): string {
    return product ? product.name : '';
  }

  onClientSelected(event: any) {
    this.selectedClient = event.option.value;
  }

  onProductSelected(index: number, event: any) {
    const product = event.option.value;
    this.selectedProducts.set(index, product);
    const config = product.dimensionConfig || {};
    
    this.items.at(index).patchValue({ 
      productId: product._id,
      variationId: '',
      variationName: '',
      customWidth: config.width?.default || 0,
      customDiameter: config.diameter?.default || 0,
      customDepth: config.depth || 0,
      customHeight: config.height || 0,
      originalPrice: product.basePrice,
      unitPrice: product.basePrice
    });
    this.cdr.detectChanges();
  }

  onVariationChange(index: number, event?: any) {
    const item = this.items.at(index);
    const variationId = item.get('variationId')?.value;
    const product = this.selectedProducts.get(index);
    
    console.log('Variation changed:', { index, variationId, product: product?.name });
    
    if (!product) return;
    
    if (!variationId || variationId === '') {
      item.patchValue({
        variationName: '',
        originalPrice: product.basePrice,
        unitPrice: product.basePrice
      });
    } else {
      // Find variation by SKU or index
      const variation = product.variations?.find((v: any) => 
        (v.sku && v.sku === variationId) || 
        (v._id && v._id === variationId)
      ) || product.variations?.[parseInt(variationId)];
      
      console.log('Found variation:', variation);
      
      if (variation) {
        const variationPrice = product.basePrice + (variation.priceModifier || 0);
        console.log('Setting price:', { basePrice: product.basePrice, priceModifier: variation.priceModifier, variationPrice });
        
        item.patchValue({
          variationName: variation.name,
          originalPrice: variationPrice,
          unitPrice: variationPrice
        });
      }
    }
  }

  getProductVariations(index: number): any[] {
    const product = this.selectedProducts.get(index);
    return product?.variations || [];
  }

  getCustomWidthControl(index: number): FormControl {
    return this.items.at(index).get('customWidth') as FormControl;
  }

  isSofa(index: number): boolean {
    const product = this.selectedProducts.get(index);
    return product?.categoryId === '6966a6b2cdf2abe6fa7981aa';
  }

  calculateSeats(width: number): number {
    if (!width) return 0;
    const rawSeats = width / 600;
    const integerPart = Math.floor(rawSeats);
    const decimalPart = rawSeats - integerPart;
    
    if (decimalPart < 0.25) {
      return integerPart;
    } else if (decimalPart >= 0.25 && decimalPart <= 0.50) {
      return integerPart + 0.5;
    } else if (decimalPart > 0.50 && decimalPart < 0.75) {
      return integerPart + 0.5;
    } else {
      return integerPart + 1;
    }
  }

  getItemTotal(index: number): number {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const unitPrice = item.get('unitPrice')?.value || 0;
    return quantity * unitPrice;
  }

  calculateSubtotal(): number {
    return this.items.controls.reduce((total, item, index) => {
      return total + this.getItemTotal(index);
    }, 0);
  }

  calculateDiscountAmount(): number {
    const subtotal = this.calculateSubtotal();
    const discountType = this.form.get('discountType')?.value;
    const discountValue = this.form.get('discountValue')?.value || 0;
    
    if (discountType === 'fixed') {
      return Math.min(discountValue, subtotal);
    } else if (discountType === 'percentage') {
      return (subtotal * discountValue) / 100;
    }
    return 0;
  }

  calculateGrandTotal(): number {
    return Math.max(0, this.calculateSubtotal() - this.calculateDiscountAmount());
  }

  getProductDimensionMin(index: number, dimension: 'width' | 'diameter'): number {
    const product = this.selectedProducts.get(index);
    return product?.dimensionConfig?.[dimension]?.min || 0;
  }

  getProductDimensionMax(index: number, dimension: 'width' | 'diameter'): number {
    const product = this.selectedProducts.get(index);
    return product?.dimensionConfig?.[dimension]?.max || 9999;
  }

  getProductShape(index: number): 'rectangle' | 'round' {
    const product = this.selectedProducts.get(index);
    return product?.dimensionConfig?.shape || 'rectangle';
  }

  onDimensionChange(index: number) {
    const item = this.items.at(index);
    const product = this.selectedProducts.get(index);
    if (!product) return;

    const config = product.dimensionConfig || {};
    const shape = config.shape || 'rectangle';
    
    let dimensionRatio = 1;
    
    if (shape === 'rectangle') {
      const customWidth = item.get('customWidth')?.value || config.width?.default || 0;
      const defaultWidth = config.width?.default || 0;
      dimensionRatio = defaultWidth > 0 ? customWidth / defaultWidth : 1;
    } else if (shape === 'round') {
      const customDiameter = item.get('customDiameter')?.value || config.diameter?.default || 0;
      const defaultDiameter = config.diameter?.default || 0;
      dimensionRatio = defaultDiameter > 0 ? customDiameter / defaultDiameter : 1;
    }

    const basePrice = product.basePrice || 0;
    const adjustedPrice = basePrice * dimensionRatio;

    item.patchValue({
      originalPrice: adjustedPrice,
      unitPrice: adjustedPrice
    });
  }

  save() {
    if (this.selectedClient && this.items.length > 0) {
      const quotationItems = this.items.controls
        .filter(item => item.get('productId')?.value)
        .map(item => {
          const productId = item.get('productId')?.value;
          const variationId = item.get('variationId')?.value;
          const variationName = item.get('variationName')?.value;
          const quantity = item.get('quantity')?.value;
          const originalPrice = item.get('originalPrice')?.value;
          const unitPrice = item.get('unitPrice')?.value;
          const customWidth = item.get('customWidth')?.value;
          const customDepth = item.get('customDepth')?.value;
          const customHeight = item.get('customHeight')?.value;
          const product = this.products.find(p => p._id === productId);
          const isSofaProduct = product?.categoryId === '6966a6b2cdf2abe6fa7981aa';
          const seats = isSofaProduct && customWidth ? this.calculateSeats(customWidth) : undefined;
          
          return {
            productId,
            productName: product?.name || '',
            productCode: product?.productCode || '',
            variationId: variationId || undefined,
            variationName: variationName || undefined,
            quantity,
            originalPrice,
            unitPrice,
            customDimensions: {
              width: customWidth,
              diameter: item.get('customDiameter')?.value,
              depth: customDepth,
              height: customHeight,
              seats: seats
            },
            total: unitPrice * quantity
          };
        });

      const subtotal = this.calculateSubtotal();
      const discountAmount = this.calculateDiscountAmount();
      const grandTotal = this.calculateGrandTotal();

      const quotation = {
        clientId: this.selectedClient._id,
        clientName: this.selectedClient.contactPerson,
        clientEmail: this.selectedClient.email,
        items: quotationItems,
        subtotal,
        discountTotal: discountAmount,
        discount: this.form.get('discountType')?.value !== 'none' ? {
          type: this.form.get('discountType')?.value,
          value: this.form.get('discountValue')?.value
        } : null,
        grandTotal,
        currency: this.currency,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      const request = this.isEditMode 
        ? this.quotationsService.updateQuotation(this.quotationId!, quotation)
        : this.quotationsService.createQuotation(quotation);

      request.subscribe({
        next: (result) => this.dialogRef.close(result),
        error: (err: any) => console.error('Failed to save quotation', err)
      });
    }
  }
}
