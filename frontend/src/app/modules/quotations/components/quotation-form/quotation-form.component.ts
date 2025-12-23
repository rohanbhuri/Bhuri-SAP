import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotationsService } from '../../quotations.service';

@Component({
    selector: 'app-quotation-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="container mx-auto p-4 max-w-4xl">
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
                <div *ngFor="let item of items.controls; let i=index" [formGroupName]="i" class="grid grid-cols-12 gap-2 mb-2 items-center">
                    <div class="col-span-5">
                        <input formControlName="productName" placeholder="Product / Service" class="w-full border p-2 rounded">
                    </div>
                    <div class="col-span-2">
                         <input formControlName="quantity" type="number" placeholder="Qty" class="w-full border p-2 rounded">
                    </div>
                    <div class="col-span-2">
                         <input formControlName="unitPrice" type="number" placeholder="Price" class="w-full border p-2 rounded">
                    </div>
                    <div class="col-span-2 text-right font-mono">
                        {{ (item.get('quantity')?.value * item.get('unitPrice')?.value) || 0 | currency }}
                    </div>
                    <div class="col-span-1 text-center">
                        <button type="button" (click)="removeItem(i)" class="text-red-500">×</button>
                    </div>
                </div>
            </div>
            <div class="mt-4 text-right text-xl font-bold">
                Total: {{ calculateTotal() | currency }}
            </div>
        </div>

        <div class="flex justify-end space-x-4">
             <button type="button" routerLink=".." class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
             <button type="submit" [disabled]="quoteForm.invalid" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Create Quote
            </button>
        </div>
      </form>
    </div>
  `
})
export class QuotationFormComponent {
    quoteForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private quotationsService: QuotationsService,
        private router: Router
    ) {
        this.quoteForm = this.fb.group({
            clientName: ['', Validators.required],
            clientEmail: ['', [Validators.required, Validators.email]],
            currency: ['USD'],
            items: this.fb.array([this.createItem()])
        });
    }

    get items() {
        return this.quoteForm.get('items') as FormArray;
    }

    createItem() {
        return this.fb.group({
            productName: ['', Validators.required],
            quantity: [1, Validators.required],
            unitPrice: [0, Validators.required]
        });
    }

    addItem() {
        this.items.push(this.createItem());
    }

    removeItem(index: number) {
        this.items.removeAt(index);
    }

    calculateTotal() {
        return this.items.controls.reduce((acc, curr) => {
            const val = curr.value;
            return acc + (val.quantity * val.unitPrice);
        }, 0);
    }

    onSubmit() {
        if (this.quoteForm.valid) {
            const formValue = this.quoteForm.value;
            const total = this.calculateTotal();

            const payload = {
                ...formValue,
                subtotal: total,
                grandTotal: total, // Simplified for now (no tax)
                items: formValue.items.map((item: any) => ({
                    ...item,
                    total: item.quantity * item.unitPrice
                }))
            };

            this.quotationsService.createQuotation(payload).subscribe({
                next: () => this.router.navigate(['../']),
                error: (err) => alert('Failed to create quotation')
            });
        }
    }
}
