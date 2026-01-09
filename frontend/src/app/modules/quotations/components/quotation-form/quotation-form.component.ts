import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotationsService } from '../../quotations.service';
import { PreferencesService } from '../../../../services/preferences.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

@Component({
    selector: 'app-quotation-form',
    standalone: true,
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatRadioModule
    ],
    template: `
    <div class="container mx-auto p-4 max-w-6xl">
      <h1 class="text-2xl font-bold mb-6">New Quotation</h1>
      
      <form [formGroup]="quoteForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- Client Info -->
        <div class="bg-white p-6 rounded shadow grid grid-cols-2 gap-4">
             <div>
                <label class="block text-sm font-medium text-gray-700">Client Name</label>
                <input formControlName="clientName" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
             <div>
                <label class="block text-sm font-medium text-gray-700">Client Email</label>
                <input formControlName="clientEmail" type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
        </div>

        <!-- Items -->
        <div class="bg-white p-6 rounded shadow">
            <div class="flex justify-between mb-4">
                <h2 class="text-lg font-semibold">Items</h2>
                <button type="button" (click)="addItem()" class="text-blue-600 text-sm hover:underline">+ Add Item</button>
            </div>
            
            <div formArrayName="items">
                <div *ngFor="let item of items.controls; let i=index" [formGroupName]="i" class="border rounded p-4 mb-4">
                    <div class="grid grid-cols-12 gap-3 items-start">
                        <!-- Product Selection -->
                        <div class="col-span-4">
                            <label class="block text-xs font-medium text-gray-600 mb-1">Product</label>
                            <select formControlName="productId" (change)="onProductChange(i)" class="w-full border p-2 rounded text-sm">
                                <option value="">Select Product</option>
                                <option *ngFor="let product of products" [value]="product._id">{{product.name}}</option>
                            </select>
                        </div>
                        
                        <!-- Variation Selection -->
                        <div class="col-span-3" *ngIf="getProductVariations(i).length > 0">
                            <label class="block text-xs font-medium text-gray-600 mb-1">Variation</label>
                            <select formControlName="variationId" (change)="onVariationChange(i)" class="w-full border p-2 rounded text-sm">
                                <option value="">Base Product</option>
                                <option *ngFor="let variation of getProductVariations(i)" [value]="variation._id">
                                    {{variation.name}} (+{{currencySymbol}}{{variation.priceModifier}})
                                </option>
                            </select>
                        </div>
                        
                        <!-- Quantity -->
                        <div [class.col-span-1]="getProductVariations(i).length > 0" [class.col-span-2]="getProductVariations(i).length === 0">
                            <label class="block text-xs font-medium text-gray-600 mb-1">Qty</label>
                            <input formControlName="quantity" type="number" min="1" class="w-full border p-2 rounded text-sm">
                        </div>
                        
                        <!-- Original Price (Read-only) -->
                        <div class="col-span-2">
                            <label class="block text-xs font-medium text-gray-600 mb-1">Original Price</label>
                            <input formControlName="originalPrice" type="number" readonly class="w-full border p-2 rounded text-sm bg-gray-50">
                        </div>
                        
                        <!-- Custom Price -->
                        <div class="col-span-2">
                            <label class="block text-xs font-medium text-gray-600 mb-1">Custom Price</label>
                            <input formControlName="unitPrice" type="number" step="0.01" class="w-full border p-2 rounded text-sm">
                        </div>
                        
                        <!-- Total -->
                        <div class="col-span-2 text-right">
                            <label class="block text-xs font-medium text-gray-600 mb-1">Total</label>
                            <div class="font-mono font-semibold text-sm pt-2">{{currencySymbol}}{{ (item.get('quantity')?.value * item.get('unitPrice')?.value) || 0 }}</div>
                        </div>
                        
                        <!-- Remove Button -->
                        <div class="col-span-1 text-center">
                            <label class="block text-xs font-medium text-transparent mb-1">-</label>
                            <button type="button" (click)="removeItem(i)" class="text-red-500 hover:text-red-700 text-xl">×</button>
                        </div>
                    </div>
                    
                    <!-- Description -->
                    <div class="mt-3" *ngIf="item.get('productId')?.value">
                        <label class="block text-xs font-medium text-gray-600 mb-1">Description/Notes</label>
                        <textarea formControlName="description" rows="2" class="w-full border p-2 rounded text-sm" placeholder="Additional details..."></textarea>
                    </div>
                </div>
            </div>
        </div>

        <!-- Totals & Discount -->
        <div class="bg-white p-6 rounded shadow">
            <div class="max-w-md ml-auto space-y-3">
                <div class="flex justify-between text-lg">
                    <span>Subtotal:</span>
                    <span class="font-mono">{{currencySymbol}}{{ calculateSubtotal() }}</span>
                </div>
                
                <!-- Discount Section -->
                <div class="border-t pt-3">
                    <div class="flex items-center gap-4 mb-2">
                        <label class="text-sm font-medium">Discount:</label>
                        <mat-radio-group formControlName="discountType" class="flex gap-4">
                            <mat-radio-button value="none">None</mat-radio-button>
                            <mat-radio-button value="fixed">Fixed</mat-radio-button>
                            <mat-radio-button value="percentage">Percentage</mat-radio-button>
                        </mat-radio-group>
                    </div>
                    
                    <div *ngIf="quoteForm.get('discountType')?.value !== 'none'" class="flex items-center gap-2">
                        <input 
                            formControlName="discountValue" 
                            type="number" 
                            step="0.01" 
                            min="0"
                            [max]="quoteForm.get('discountType')?.value === 'percentage' ? 100 : calculateSubtotal()"
                            class="border p-2 rounded w-32 text-sm"
                            placeholder="0"
                        >
                        <span class="text-sm">{{ quoteForm.get('discountType')?.value === 'percentage' ? '%' : currencySymbol }}</span>
                        <span class="ml-auto font-mono text-red-600">-{{currencySymbol}}{{ calculateDiscountAmount() }}</span>
                    </div>
                </div>
                
                <div class="flex justify-between text-xl font-bold border-t pt-3">
                    <span>Grand Total:</span>
                    <span class="font-mono">{{currencySymbol}}{{ calculateGrandTotal() }}</span>
                </div>
            </div>
        </div>

        <div class="flex justify-end space-x-4">
             <button type="button" (click)="goBack()" class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
             <button type="submit" [disabled]="quoteForm.invalid" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
                Create Quote
            </button>
        </div>
      </form>
    </div>
  `
})
export class QuotationFormComponent implements OnInit {
    quoteForm: FormGroup;
    currencySymbol = '$';
    currency = 'USD';
    products: any[] = [];
    selectedProducts: Map<number, any> = new Map();

    constructor(
        private fb: FormBuilder,
        private quotationsService: QuotationsService,
        private router: Router,
        private preferencesService: PreferencesService
    ) {
        this.quoteForm = this.fb.group({
            clientName: ['', Validators.required],
            clientEmail: ['', [Validators.required, Validators.email]],
            currency: [this.currency],
            discountType: ['none'],
            discountValue: [0],
            items: this.fb.array([this.createItem()])
        });
    }

    ngOnInit() {
        this.loadCurrencyPreferences();
        this.loadProducts();
    }

    loadProducts() {
        this.quotationsService.getProducts().subscribe({
            next: (products) => {
                this.products = products;
            },
            error: (err) => console.error('Failed to load products', err)
        });
    }

    loadCurrencyPreferences() {
        this.preferencesService.getUserPreferences().subscribe({
            next: (prefs) => {
                if (prefs) {
                    this.currency = prefs.currency || 'USD';
                    this.currencySymbol = prefs.currencySymbol || '$';
                    this.quoteForm.patchValue({ currency: this.currency });
                }
            },
            error: () => {
                console.log('Using default currency');
            }
        });
    }

    get items() {
        return this.quoteForm.get('items') as FormArray;
    }

    createItem() {
        return this.fb.group({
            productId: [''],
            productName: ['', Validators.required],
            variationId: [''],
            variationName: [''],
            quantity: [1, [Validators.required, Validators.min(1)]],
            originalPrice: [0],
            unitPrice: [0, [Validators.required, Validators.min(0)]],
            description: ['']
        });
    }

    addItem() {
        this.items.push(this.createItem());
    }

    removeItem(index: number) {
        this.items.removeAt(index);
        this.selectedProducts.delete(index);
    }

    onProductChange(index: number) {
        const item = this.items.at(index);
        const productId = item.get('productId')?.value;
        
        if (!productId) {
            this.selectedProducts.delete(index);
            return;
        }
        
        const product = this.products.find(p => p._id === productId);
        if (product) {
            this.selectedProducts.set(index, product);
            item.patchValue({
                productName: product.name,
                variationId: '',
                variationName: '',
                originalPrice: product.basePrice,
                unitPrice: product.basePrice
            });
        }
    }

    onVariationChange(index: number) {
        const item = this.items.at(index);
        const variationId = item.get('variationId')?.value;
        const product = this.selectedProducts.get(index);
        
        if (!product) return;
        
        if (!variationId) {
            item.patchValue({
                variationName: '',
                originalPrice: product.basePrice,
                unitPrice: product.basePrice
            });
        } else {
            const variation = product.variations.find((v: any) => v._id === variationId);
            if (variation) {
                const variationPrice = product.basePrice + variation.priceModifier;
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

    calculateSubtotal() {
        return this.items.controls.reduce((acc, curr) => {
            const val = curr.value;
            return acc + (val.quantity * val.unitPrice);
        }, 0);
    }

    calculateDiscountAmount() {
        const subtotal = this.calculateSubtotal();
        const discountType = this.quoteForm.get('discountType')?.value;
        const discountValue = this.quoteForm.get('discountValue')?.value || 0;
        
        if (discountType === 'fixed') {
            return Math.min(discountValue, subtotal);
        } else if (discountType === 'percentage') {
            return (subtotal * discountValue) / 100;
        }
        return 0;
    }

    calculateGrandTotal() {
        return Math.max(0, this.calculateSubtotal() - this.calculateDiscountAmount());
    }

    goBack() {
        this.router.navigate(['/quotations']);
    }

    onSubmit() {
        if (this.quoteForm.valid) {
            const formValue = this.quoteForm.value;
            const subtotal = this.calculateSubtotal();
            const discountAmount = this.calculateDiscountAmount();
            const grandTotal = this.calculateGrandTotal();

            const payload = {
                ...formValue,
                subtotal,
                discountTotal: discountAmount,
                grandTotal,
                discount: formValue.discountType !== 'none' ? {
                    type: formValue.discountType,
                    value: formValue.discountValue
                } : null,
                items: formValue.items.map((item: any) => ({
                    productId: item.productId || undefined,
                    productName: item.productName,
                    variationId: item.variationId || undefined,
                    variationName: item.variationName || undefined,
                    quantity: item.quantity,
                    originalPrice: item.originalPrice,
                    unitPrice: item.unitPrice,
                    total: item.quantity * item.unitPrice,
                    description: item.description || undefined
                }))
            };

            this.quotationsService.createQuotation(payload).subscribe({
                next: () => this.router.navigate(['/quotations']),
                error: (err) => alert('Failed to create quotation: ' + (err.error?.message || err.message))
            });
        }
    }
}
