import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientPortalService } from '../../client-portal.service';

@Component({
    selector: 'app-quotation-view',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="container mx-auto p-6">
      <button (click)="goBack()" class="mb-6 flex items-center text-gray-600 hover:text-gray-900">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Back to Quotations
      </button>

      <div *ngIf="quotation" class="bg-white rounded-xl shadow-sm p-8">
        <!-- Header -->
        <div class="flex justify-between items-start mb-8 pb-6 border-b">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              Quotation #{{ quotation._id?.toString().slice(-8).toUpperCase() }}
            </h1>
            <p class="text-gray-600">Created {{ quotation.createdAt | date:'MMMM d, y' }}</p>
            <p *ngIf="quotation.validUntil" class="text-gray-600">Valid until {{ quotation.validUntil | date:'MMMM d, y' }}</p>
          </div>
          <span [ngClass]="{
            'px-4 py-2 rounded-full text-sm font-semibold': true,
            'bg-yellow-100 text-yellow-800': quotation.status === 'SENT',
            'bg-green-100 text-green-800': quotation.status === 'ACCEPTED',
            'bg-red-100 text-red-800': quotation.status === 'DECLINED',
            'bg-gray-100 text-gray-800': quotation.status === 'DRAFT'
          }">
            {{ quotation.status }}
          </span>
        </div>

        <!-- Client Information -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Client Information</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Name</p>
              <p class="text-gray-900 font-medium">{{ quotation.clientName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="text-gray-900 font-medium">{{ quotation.clientEmail }}</p>
            </div>
          </div>
        </div>

        <!-- Line Items -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Items</h2>
          <div class="overflow-hidden border rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let item of quotation.items">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.productName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.quantity }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.price | currency }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.price * item.quantity | currency }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Total -->
        <div class="flex justify-end mb-8">
          <div class="w-64 space-y-2">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>{{ quotation.totalAmount | currency }}</span>
            </div>
            <div class="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
              <span>Total:</span>
              <span class="text-indigo-600">{{ quotation.totalAmount | currency }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div *ngIf="quotation.status === 'SENT'" class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Respond to this Quotation</h3>
          
          <div class="flex gap-4">
            <button (click)="accept()" 
                    class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Accept Quotation
            </button>
            
            <button (click)="showRejectForm = !showRejectForm" 
                    class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Decline Quotation
            </button>
          </div>

          <!-- Reject Reason Form -->
          <div *ngIf="showRejectForm" class="mt-4 p-4 bg-white rounded border">
            <label class="block text-sm font-medium text-gray-700 mb-2">Reason for declining (optional)</label>
            <textarea [(ngModel)]="rejectReason" 
                      rows="3"
                      placeholder="Please provide a reason..."
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"></textarea>
            <div class="flex gap-2 mt-3">
              <button (click)="reject()" 
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                Confirm Decline
              </button>
              <button (click)="showRejectForm = false" 
                      class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Status Messages -->
        <div *ngIf="quotation.status === 'ACCEPTED'" class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-green-800 font-medium">You have accepted this quotation</span>
          </div>
        </div>

        <div *ngIf="quotation.status === 'DECLINED'" class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-red-800 font-medium">You have declined this quotation</span>
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
export class QuotationViewComponent implements OnInit {
    quotation: any = null;
    showRejectForm = false;
    rejectReason = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientPortalService: ClientPortalService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadQuotation(id);
        }
    }

    loadQuotation(id: string) {
        this.clientPortalService.getQuotation(id).subscribe({
            next: (data) => this.quotation = data,
            error: (err) => console.error('Failed to load quotation', err)
        });
    }

    accept() {
        if (!confirm('Are you sure you want to accept this quotation?')) return;

        this.clientPortalService.acceptQuotation(this.quotation._id).subscribe({
            next: () => {
                alert('Quotation accepted successfully!');
                this.loadQuotation(this.quotation._id);
            },
            error: (err) => {
                console.error('Failed to accept quotation', err);
                alert('Failed to accept quotation. Please try again.');
            }
        });
    }

    reject() {
        if (!confirm('Are you sure you want to decline this quotation?')) return;

        this.clientPortalService.rejectQuotation(this.quotation._id, this.rejectReason).subscribe({
            next: () => {
                alert('Quotation declined.');
                this.loadQuotation(this.quotation._id);
                this.showRejectForm = false;
                this.rejectReason = '';
            },
            error: (err) => {
                console.error('Failed to decline quotation', err);
                alert('Failed to decline quotation. Please try again.');
            }
        });
    }

    goBack() {
        this.router.navigate(['/client-portal/quotations']);
    }
}
