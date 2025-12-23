import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogueService } from '../../catalogue.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Product Catalogue</h1>
        <a routerLink="new" class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <span class="mr-2">+</span> New Product
        </a>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let product of products$ | async" class="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white">
          <div class="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
             <img *ngIf="product.images?.length" [src]="product.images[0]" class="object-cover h-full w-full" [alt]="product.name">
             <span *ngIf="!product.images?.length" class="text-gray-400 text-sm">No Image</span>
          </div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg text-gray-900 line-clamp-2">{{ product.name }}</h3>
              <span *ngIf="product.model3d" class="ml-2 flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                3D
              </span>
            </div>
            <p class="text-sm text-gray-500 mb-3">SKU: {{ product.sku }}</p>
            <div class="flex justify-between items-center">
               <span class="text-xl font-bold text-green-600">{{ product.price | currency }}</span>
               <a [routerLink]="[product._id, 'edit']" class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-200 transition-colors">
                 Edit
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent {
  products$: Observable<any[]>;

  constructor(private catalogueService: CatalogueService) {
    this.products$ = this.catalogueService.getProducts();
  }
}
