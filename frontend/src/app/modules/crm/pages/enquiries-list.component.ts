import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { CrmFunnelService } from '../crm-funnel.service';
import { NavbarComponent } from '../../../components/navbar.component';
import { BottomNavbarComponent } from '../../../components/bottom-navbar.component';

@Component({
  selector: 'app-enquiries-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatMenuModule, NavbarComponent, BottomNavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <div class="text-sm text-gray-500 mb-2">Modules > CRM > Enquiries</div>
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-4xl font-light text-gray-900 dark:text-white mb-2">Enquiries</h1>
              <p class="text-gray-600 dark:text-gray-400">Manage customer enquiries and convert to quotations</p>
            </div>
            <button mat-stroked-button>
              <mat-icon>file_download</mat-icon>
              Export
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enquiry #</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr *ngFor="let row of enquiries" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{row.enquiryNumber}}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{row.customerName}}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{row.company}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{row.items?.length || 0}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{row.source}}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(row.status)" class="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full">
                    {{row.status}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{row.createdAt | date:'short'}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="createPresentation(row._id)">
                      <mat-icon>slideshow</mat-icon>
                      Create Presentation
                    </button>
                    <button mat-menu-item (click)="createQuotation(row._id)">
                      <mat-icon>description</mat-icon>
                      Create Quotation
                    </button>
                    <button mat-menu-item (click)="markLost(row._id)">
                      <mat-icon>close</mat-icon>
                      Mark as Lost
                    </button>
                    <button mat-menu-item (click)="markOnHold(row._id)">
                      <mat-icon>pause</mat-icon>
                      Mark as On Hold
                    </button>
                  </mat-menu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: []
})
export class EnquiriesListComponent implements OnInit {
  private funnelService = inject(CrmFunnelService);
  enquiries: any[] = [];

  ngOnInit() {
    this.loadEnquiries();
  }

  loadEnquiries() {
    this.funnelService.getEnquiries().subscribe(data => {
      this.enquiries = data;
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'new': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'processing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'presentation_sent': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'quoted': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'converted': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'lost': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'on_hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  createPresentation(enquiryId: string) {
    this.funnelService.createPresentationFromEnquiry(enquiryId, { title: 'New Presentation' })
      .subscribe(() => {
        alert('Presentation created successfully');
        this.loadEnquiries();
      });
  }

  createQuotation(enquiryId: string) {
    this.funnelService.createQuotationFromEnquiry(enquiryId, {})
      .subscribe(() => {
        alert('Quotation created successfully');
        this.loadEnquiries();
      });
  }

  markLost(enquiryId: string) {
    const reason = prompt('Reason for marking as lost:');
    if (reason) {
      this.funnelService.markEnquiryLost(enquiryId, reason).subscribe(() => {
        alert('Enquiry marked as lost');
        this.loadEnquiries();
      });
    }
  }

  markOnHold(enquiryId: string) {
    const days = prompt('Follow-up after how many days?', '7');
    if (days) {
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + parseInt(days));
      this.funnelService.markEnquiryOnHold(enquiryId, followUpDate).subscribe(() => {
        alert('Enquiry marked as on hold');
        this.loadEnquiries();
      });
    }
  }
}
