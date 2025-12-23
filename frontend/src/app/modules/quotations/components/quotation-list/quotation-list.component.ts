import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuotationsService } from '../../quotations.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quotation-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Quotations</h1>
        <a routerLink="new" class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <span class="mr-2">+</span> New Quote
        </a>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote #</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let quote of quotes$ | async" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">{{ quote.quotationNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ quote.clientName || 'Unknown' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ quote.grandTotal | currency:quote.currency }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                 <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                       [ngClass]="{
                         'bg-yellow-100 text-yellow-800': quote.status === 'DRAFT',
                         'bg-blue-100 text-blue-800': quote.status === 'SENT',
                         'bg-green-100 text-green-800': quote.status === 'ACCEPTED',
 'bg-red-100 text-red-800': quote.status === 'DECLINED'
                       }">
                   {{ quote.status }}
                 </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ quote.createdAt | date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <a [routerLink]="[quote._id]" class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors">
                  View
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class QuotationListComponent {
  quotes$: Observable<any[]>;

  constructor(private quotationsService: QuotationsService) {
    this.quotes$ = this.quotationsService.getQuotations();
  }
}
