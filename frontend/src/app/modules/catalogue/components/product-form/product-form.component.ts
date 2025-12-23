import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CatalogueService } from '../../catalogue.service';
import { getBrandConfig } from '../../../../brand.config';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <div class="container mx-auto p-4 max-w-2xl">
      <h1 class="text-2xl font-bold mb-6">{{ productId ? 'Edit Product' : 'Create Product' }}</h1>
      
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Basic Info -->
        <div class="bg-white p-6 rounded shadow">
            <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Product Name</label>
                    <input formControlName="name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">SKU</label>
                    <input formControlName="sku" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Price</label>
                    <input formControlName="price" type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-700">Currency</label>
                    <input formControlName="currency" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                </div>
            </div>
            <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea formControlName="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"></textarea>
            </div>
        </div>

        <!-- Media -->
        <div class="bg-white p-6 rounded shadow">
            <h2 class="text-lg font-semibold mb-4">Media</h2>
            
            <!-- 3D Model Upload -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">3D Model (.glb)</label>
                <div class="flex items-center space-x-4">
                    <input type="file" (change)="onFileSelected($event, 'model3d')" accept=".glb,.gltf" class="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-purple-50 file:text-purple-700
                        hover:file:bg-purple-100
                    "/>
                    <span *ngIf="uploading3d" class="text-blue-500 text-sm">Uploading...</span>
                </div>
                <div *ngIf="productForm.get('model3d')?.value" class="mt-2">
                    <div class="text-green-600 text-sm mb-2">✅ 3D Model Linked</div>
                    <div class="border rounded p-2 bg-gray-50" style="height: 400px; min-height: 400px;">
                         <model-viewer
                            [src]="getFullUrl(productForm.get('model3d')?.value)"
                            alt="3D Model"
                            auto-rotate
                            camera-controls
                            style="width: 100%; height: 100%; display: block;"
                         ></model-viewer>
                    </div>
                </div>
            </div>

            <!-- Image Upload -->
             <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <input type="file" (change)="onFileSelected($event, 'image')" accept="image/*" class="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                "/>
                 <div *ngIf="productForm.get('images')?.value?.length" class="mt-2 text-green-600 text-sm">
                    ✅ {{ productForm.get('images')?.value?.length }} Image(s) Linked
                </div>
            </div>
        </div>

        <div class="flex justify-end space-x-4">
            <button type="button" routerLink=".." class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" [disabled]="productForm.invalid || uploading3d" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                {{ productId ? 'Update Product' : 'Save Product' }}
            </button>
        </div>
      </form>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
    productForm: FormGroup;
    uploading3d = false;
    productId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private catalogueService: CatalogueService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.productForm = this.fb.group({
            name: ['', Validators.required],
            sku: ['', Validators.required],
            price: [0, Validators.required],
            currency: ['USD', Validators.required],
            description: [''],
            images: [[]],
            model3d: [''],
            isPublished: [true]
        });
    }

    ngOnInit() {
        // Get product ID from route if editing
        this.productId = this.route.snapshot.paramMap.get('id');
        if (this.productId) {
            this.loadProduct(this.productId);
        }
    }

    loadProduct(id: string) {
        this.catalogueService.getProduct(id).subscribe({
            next: (product) => {
                this.productForm.patchValue({
                    name: product.name,
                    sku: product.sku,
                    price: product.price,
                    currency: product.currency || 'USD',
                    description: product.description,
                    images: product.images || [],
                    model3d: product.model3d || '',
                    isPublished: product.isPublished !== false
                });
            },
            error: (err) => {
                console.error('Failed to load product', err);
                alert('Failed to load product');
            }
        });
    }

    onFileSelected(event: any, type: 'model3d' | 'image') {
        const file: File = event.target.files[0];
        if (file) {
            if (type === 'model3d') this.uploading3d = true;

            this.catalogueService.uploadMedia(file).subscribe({
                next: (res) => {
                    if (type === 'model3d') {
                        this.productForm.patchValue({ model3d: res.url });
                        this.uploading3d = false;
                    } else {
                        const currentImages = this.productForm.get('images')?.value || [];
                        this.productForm.patchValue({ images: [...currentImages, res.url] });
                    }
                },
                error: (err) => {
                    console.error('Upload failed', err);
                    this.uploading3d = false;
                    alert('Upload failed');
                }
            });
        }
    }

    getFullUrl(path: string): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const apiBase = getBrandConfig().app.apiUrl.replace('/api', '');
        return `${apiBase}${path}`;
    }


    onSubmit() {
        if (this.productForm.valid) {
            const operation = this.productId
                ? this.catalogueService.updateProduct(this.productId, this.productForm.value)
                : this.catalogueService.createProduct(this.productForm.value);

            operation.subscribe({
                next: () => this.router.navigate(['/modules/catalogue']),
                error: (err) => alert(`Failed to ${this.productId ? 'update' : 'create'} product`)
            });
        }
    }
}
