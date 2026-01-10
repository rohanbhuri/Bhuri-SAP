import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { CrmFunnelService } from '../crm-funnel.service';
import { NavbarComponent } from '../../../components/navbar.component';
import { BottomNavbarComponent } from '../../../components/bottom-navbar.component';

@Component({
  selector: 'app-funnel-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, RouterModule, NavbarComponent, BottomNavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <div class="text-sm text-gray-500 mb-2">Modules > CRM</div>
          <h1 class="text-4xl font-light text-gray-900 dark:text-white mb-2">CRM Funnel</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage your sales pipeline from lead to order</p>
        </div>

        <mat-tab-group class="mb-8" backgroundColor="primary">
          <mat-tab label="Dashboard">
            <div class="py-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-light text-gray-900 dark:text-white">Overview</h2>
                <button mat-stroked-button routerLink="../pipeline">
                  <mat-icon>view_kanban</mat-icon>
                  Pipeline View
                </button>
              </div>

              <div class="grid grid-cols-4 gap-4 mb-8">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Login Requests</span>
                    <mat-icon class="text-gray-400">person_add</mat-icon>
                  </div>
                  <div class="text-3xl font-light text-gray-900 dark:text-white">{{dashboard?.funnel?.requests || 0}}</div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Contacts</span>
                    <mat-icon class="text-gray-400">contacts</mat-icon>
                  </div>
                  <div class="text-3xl font-light text-gray-900 dark:text-white">{{dashboard?.funnel?.contacts || 0}}</div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Enquiries</span>
                    <mat-icon class="text-gray-400">question_answer</mat-icon>
                  </div>
                  <div class="text-3xl font-light text-gray-900 dark:text-white">{{dashboard?.funnel?.enquiries || 0}}</div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Orders</span>
                    <mat-icon class="text-gray-400">shopping_cart</mat-icon>
                  </div>
                  <div class="text-3xl font-light text-gray-900 dark:text-white">{{dashboard?.funnel?.orders || 0}}</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-light text-gray-900 dark:text-white">Conversion Rates</h3>
                  </div>
                  <div class="p-6">
                    <table class="w-full">
                      <tbody>
                        <tr class="border-b border-gray-100 dark:border-gray-700">
                          <td class="py-3 text-sm text-gray-600 dark:text-gray-400">Request → Contact</td>
                          <td class="py-3 text-right text-sm font-medium">{{dashboard?.conversion?.requestToContact || 0}}%</td>
                        </tr>
                        <tr class="border-b border-gray-100 dark:border-gray-700">
                          <td class="py-3 text-sm text-gray-600 dark:text-gray-400">Contact → Enquiry</td>
                          <td class="py-3 text-right text-sm font-medium">{{dashboard?.conversion?.contactToEnquiry || 0}}%</td>
                        </tr>
                        <tr class="border-b border-gray-100 dark:border-gray-700">
                          <td class="py-3 text-sm text-gray-600 dark:text-gray-400">Enquiry → Quotation</td>
                          <td class="py-3 text-right text-sm font-medium">{{dashboard?.conversion?.enquiryToQuotation || 0}}%</td>
                        </tr>
                        <tr>
                          <td class="py-3 text-sm text-gray-600 dark:text-gray-400">Quotation → Order</td>
                          <td class="py-3 text-right text-sm font-medium">{{dashboard?.conversion?.quotationToOrder || 0}}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-light text-gray-900 dark:text-white">Revenue Metrics</h3>
                  </div>
                  <div class="p-6">
                    <div class="mb-6">
                      <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Pipeline Value</div>
                      <div class="text-2xl font-light text-gray-900 dark:text-white">\${{dashboard?.revenue?.pipeline || 0}}</div>
                    </div>
                    <div class="mb-6">
                      <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Revenue</div>
                      <div class="text-2xl font-light text-gray-900 dark:text-white">\${{dashboard?.revenue?.total || 0}}</div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Won Orders</div>
                        <div class="text-xl font-light">{{dashboard?.revenue?.won || 0}}</div>
                      </div>
                      <div>
                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Lost Enquiries</div>
                        <div class="text-xl font-light">{{dashboard?.revenue?.lost || 0}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Enquiries">
            <div class="py-6">
              <div class="flex justify-end mb-4">
                <button mat-flat-button color="primary" routerLink="../enquiries">
                  <mat-icon>list</mat-icon>
                  View All Enquiries
                </button>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Orders">
            <div class="py-6">
              <div class="flex justify-end mb-4">
                <button mat-flat-button color="primary" routerLink="../orders">
                  <mat-icon>shopping_bag</mat-icon>
                  View All Orders
                </button>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Analytics">
            <div class="py-6">
              <p class="text-gray-500">Analytics coming soon...</p>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: []
})
export class FunnelDashboardComponent implements OnInit {
  private funnelService = inject(CrmFunnelService);
  dashboard: any;

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.funnelService.getDashboard().subscribe(data => {
      this.dashboard = data;
    });
  }
}
