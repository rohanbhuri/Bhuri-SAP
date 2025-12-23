import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientPortalService } from '../../client-portal.service';

@Component({
    selector: 'app-client-quotations',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Quotations</h1>
      </div>

      <div *ngIf="quotations.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-gray-500 text-lg">No quotations yet</p>
      </div>

      <div class="grid gap-6">
        <div *ngFor="let quote of quotations" 
             class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-1">
                Quotation #{{ quote._id?.toString().slice(-8).toUpperCase() }}
              </h3>
              <p class="text-sm text-gray-500">
                Created {{ quote.createdAt | date:'MMM d, y h:mm a' }}
              </p>
              <p *ngIf="quote.validUntil" class="text-sm text-gray-500">
                Valid until {{ quote.validUntil | date:'MMM d, y' }}
              </p>
            </div>
            <span [ngClass]="{
              'px-4 py-2 rounded-full text-sm font-medium': true,
              'bg-yellow-100 text-yellow-800': quote.status === 'SENT',
              'bg-green-100 text-green-800': quote.status === 'ACCEPTED',
              'bg-red-100 text-red-800': quote.status === 'DECLINED',
              'bg-gray-100 text-gray-800': quote.status === 'DRAFT'
            }">
              {{ quote.status }}
            </span>
          </div>

          <!-- Client Info -->
          <div class="mb-4 pb-4 border-b">
            <p class="text-sm text-gray-600">Client: <span class="font-medium text-gray-900">{{ quote.clientName }}</span></p>
            <p class="text-sm text-gray-600">Email: <span class="font-medium text-gray-900">{{ quote.clientEmail }}</span></p>
          </div>

          <!-- Items Summary -->
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Items ({{ quote.items?.length || 0 }}):</p>
            <div class="space-y-1">
              <div *ngFor="let item of quote.items?.slice(0, 3)" class="text-sm text-gray-700 flex justify-between">
                <span>{{ item.productName }} × {{ item.quantity }}</span>
                <span class="font-medium">{{ item.price * item.quantity | currency }}</span>
              </div>
              <p *ngIf="quote.items?.length > 3" class="text-sm text-gray-500">
                +{{ quote.items.length - 3 }} more items
              </p>
            </div>
          </div>

          <!-- Total -->
          <div class="flex justify-between items-center pt-4 border-t">
            <span class="text-lg font-semibold text-gray-700">Total Amount:</span>
            <span class="text-2xl font-bold text-indigo-600">{{ quote.totalAmount | currency }}</span>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex gap-3">
            <a [routerLink]="[quote._id]" 
               class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center font-medium">
              View Details
            </a>
            <button *ngIf="quote.status === 'SENT'" 
                    (click)="quickAccept(quote._id)"
                    class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class ClientQuotationsComponent implements OnInit {
    quotations: any[] = [];

    constructor(private clientPortalService: ClientPortalService) { }

    ngOnInit() {
        this.loadQuotations();
    }

    loadQuotations() {
        this.clientPortalService.getMyQuotations().subscribe({
            next: (data) => this.quotations = data,
            error: (err) => console.error('Failed to load quotations', err)
        });
    }

    quickAccept(id: string) {
        if (confirm('Are you sure you want to accept this quotation?')) {
            this.clientPortalService.acceptQuotation(id).subscribe({
                next: () => {
                    alert('Quotation accepted successfully!');
                    this.loadQuotations();
                },
                error: (err) => {
                    console.error('Failed to accept quotation', err);
                    alert('Failed to accept quotation');
                }
            });
        }
    }
}
