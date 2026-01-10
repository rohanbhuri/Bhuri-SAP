import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CrmFunnelService } from '../crm-funnel.service';
import { NavbarComponent } from '../../../components/navbar.component';
import { BottomNavbarComponent } from '../../../components/bottom-navbar.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatSelectModule, MatFormFieldModule, NavbarComponent, BottomNavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <div class="text-sm text-gray-500 mb-2">Modules > CRM > Orders</div>
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-4xl font-light text-gray-900 dark:text-white mb-2">Orders</h1>
              <p class="text-gray-600 dark:text-gray-400">Track order fulfillment and delivery</p>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order #</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delivery</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr *ngFor="let row of orders" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{row.orderNumber}}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{row.clientName}}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{row.clientEmail}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">\${{row.totalAmount}}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(row.status)" class="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full">
                    {{row.status}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select (change)="updatePayment(row._id, $event)" [value]="row.paymentStatus" 
                          class="text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select (change)="updateDelivery(row._id, $event)" [value]="row.deliveryStatus"
                          class="text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{row.createdAt | date:'short'}}</td>
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
export class OrdersListComponent implements OnInit {
  private funnelService = inject(CrmFunnelService);
  orders: any[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.funnelService.getOrders().subscribe(data => {
      this.orders = data;
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  updatePayment(orderId: string, event: any) {
    const status = event.target.value;
    this.funnelService.updateOrderPaymentStatus(orderId, status).subscribe(() => {
      alert('Payment status updated');
      this.loadOrders();
    });
  }

  updateDelivery(orderId: string, event: any) {
    const status = event.target.value;
    this.funnelService.updateOrderDeliveryStatus(orderId, status).subscribe(() => {
      alert('Delivery status updated');
      this.loadOrders();
    });
  }
}
