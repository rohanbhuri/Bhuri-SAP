import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { OrderManagementService, Order, OrderStatus, OrderPriority } from '../order-management.service';
import { OrderDialogComponent } from '../dialogs/order-dialog.component';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule, MatMenuModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatPaginatorModule, FormsModule
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Orders</h2>
        <button mat-raised-button color="primary" (click)="openOrderDialog()">
          <mat-icon>add</mat-icon>
          Create Order
        </button>
      </div>
      
      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Search Orders</mat-label>
          <input matInput [(ngModel)]="searchQuery" (input)="applyFilters()" placeholder="Search by order number, product name...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(value)]="selectedStatus" (selectionChange)="applyFilters()">
            <mat-option value="">All Statuses</mat-option>
            <mat-option value="pending">Pending</mat-option>
            <mat-option value="confirmed">Confirmed</mat-option>
            <mat-option value="processing">Processing</mat-option>
            <mat-option value="shipped">Shipped</mat-option>
            <mat-option value="delivered">Delivered</mat-option>
            <mat-option value="cancelled">Cancelled</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Priority</mat-label>
          <mat-select [(value)]="selectedPriority" (selectionChange)="applyFilters()">
            <mat-option value="">All Priorities</mat-option>
            <mat-option value="low">Low</mat-option>
            <mat-option value="medium">Medium</mat-option>
            <mat-option value="high">High</mat-option>
            <mat-option value="urgent">Urgent</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="orders()" class="orders-table">
          <ng-container matColumnDef="orderNumber">
            <th mat-header-cell *matHeaderCellDef>Order #</th>
            <td mat-cell *matCellDef="let order">{{ order.orderNumber }}</td>
          </ng-container>
          
          <ng-container matColumnDef="customer">
            <th mat-header-cell *matHeaderCellDef>Customer</th>
            <td mat-cell *matCellDef="let order">
              <div class="customer-info">
                <div class="customer-avatar">{{ getInitials(order.customerId) }}</div>
                <div class="customer-details">
                  <div class="customer-name">{{ order.customerId }}</div>
                  <div class="customer-email">{{ order.shippingAddress.city }}, {{ order.shippingAddress.country }}</div>
                </div>
              </div>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="items">
            <th mat-header-cell *matHeaderCellDef>Items</th>
            <td mat-cell *matCellDef="let order">
              <div class="items-info">
                <div class="items-count">{{ order.items.length }} item(s)</div>
                <div class="items-preview">{{ order.items[0]?.productName || 'No items' }}</div>
              </div>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef>Total</th>
            <td mat-cell *matCellDef="let order">
              <div class="total-amount">
                <div class="amount">{{ order.currency }} {{ formatCurrency(order.totalAmount) }}</div>
                <div class="priority" [class]="'priority-' + order.priority">
                  {{ order.priority | titlecase }}
                </div>
              </div>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let order">
              <mat-chip [color]="getStatusColor(order.status)">
                {{ order.status | titlecase }}
              </mat-chip>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="dates">
            <th mat-header-cell *matHeaderCellDef>Dates</th>
            <td mat-cell *matCellDef="let order">
              <div class="dates-info">
                <div class="order-date">Ordered: {{ formatDate(order.orderDate) }}</div>
                <div class="expected-date" *ngIf="order.expectedDeliveryDate">
                  Expected: {{ formatDate(order.expectedDeliveryDate) }}
                </div>
              </div>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let order">
              <button mat-icon-button [matMenuTriggerFor]="orderMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #orderMenu="matMenu">
                <button mat-menu-item (click)="viewOrder(order)">
                  <mat-icon>visibility</mat-icon>
                  <span>View Details</span>
                </button>
                <button mat-menu-item (click)="editOrder(order)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="updateStatus(order)">
                  <mat-icon>update</mat-icon>
                  <span>Update Status</span>
                </button>
                <button mat-menu-item (click)="deleteOrder(order._id)" class="delete-action">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <mat-paginator
          [length]="totalOrders()"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: var(--theme-on-surface); }
    
    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    
    .filters mat-form-field {
      min-width: 200px;
    }
    
    .table-container { 
      background: var(--theme-surface); 
      border-radius: 8px; 
      overflow: hidden; 
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent); 
    }
    
    .orders-table { width: 100%; }
    
    .customer-info { display: flex; align-items: center; gap: 12px; }
    .customer-avatar { 
      width: 40px; height: 40px; border-radius: 50%; 
      background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent)); 
      color: white; display: flex; align-items: center; justify-content: center; 
      font-weight: 600; font-size: 14px; 
    }
    .customer-name { font-weight: 500; margin-bottom: 2px; }
    .customer-email { font-size: 12px; opacity: 0.7; }
    
    .items-info { }
    .items-count { font-weight: 500; margin-bottom: 2px; }
    .items-preview { font-size: 12px; opacity: 0.7; }
    
    .total-amount { }
    .amount { font-weight: 600; margin-bottom: 4px; }
    .priority { 
      font-size: 10px; padding: 2px 6px; border-radius: 4px; 
      font-weight: 500; text-transform: uppercase;
    }
    .priority-low { background: #e8f5e8; color: #2e7d32; }
    .priority-medium { background: #fff3e0; color: #f57c00; }
    .priority-high { background: #ffebee; color: #d32f2f; }
    .priority-urgent { background: #f3e5f5; color: #7b1fa2; }
    
    .dates-info { }
    .order-date { font-weight: 500; margin-bottom: 2px; }
    .expected-date { font-size: 12px; opacity: 0.7; }
    
    .delete-action { color: #f44336; }
    
    /* Dark theme adjustments */
    :host-context(body.dark-theme) .table-container {
      border-color: color-mix(in srgb, var(--theme-on-surface) 20%, transparent);
    }
    
    :host-context(body.dark-theme) .priority-low { background: #1b5e20; color: #a5d6a7; }
    :host-context(body.dark-theme) .priority-medium { background: #e65100; color: #ffcc02; }
    :host-context(body.dark-theme) .priority-high { background: #b71c1c; color: #ffcdd2; }
    :host-context(body.dark-theme) .priority-urgent { background: #4a148c; color: #e1bee7; }
  `]
})
export class OrdersPageComponent implements OnInit {
  private orderManagementService = inject(OrderManagementService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  orders = signal<Order[]>([]);
  totalOrders = signal(0);
  displayedColumns = ['orderNumber', 'customer', 'items', 'total', 'status', 'dates', 'actions'];
  
  searchQuery = '';
  selectedStatus = '';
  selectedPriority = '';
  currentPage = 1;
  pageSize = 10;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderManagementService.getAllOrders(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.orders.set(result.orders);
        this.totalOrders.set(result.total);
      },
      error: () => {
        this.snackBar.open('Error loading orders', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilters() {
    // In a real implementation, you would filter on the backend
    // For now, we'll just reload the data
    this.currentPage = 1;
    this.loadOrders();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  getInitials(customerId: string): string {
    return customerId.substring(0, 2).toUpperCase();
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING: return 'warn';
      case OrderStatus.CONFIRMED: return 'primary';
      case OrderStatus.PROCESSING: return 'accent';
      case OrderStatus.SHIPPED: return 'primary';
      case OrderStatus.DELIVERED: return 'primary';
      case OrderStatus.CANCELLED: return 'warn';
      default: return '';
    }
  }

  openOrderDialog(order?: Order) {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '800px',
      data: order || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOrders();
        this.snackBar.open(
          order ? 'Order updated successfully' : 'Order created successfully', 
          'Close', 
          { duration: 3000 }
        );
      }
    });
  }

  viewOrder(order: Order) {
    // Navigate to order details page
    console.log('View order:', order);
  }

  editOrder(order: Order) {
    this.openOrderDialog(order);
  }

  updateStatus(order: Order) {
    // Open status update dialog
    console.log('Update status for order:', order);
  }

  deleteOrder(id: string) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderManagementService.deleteOrder(id).subscribe({
        next: () => {
          this.loadOrders();
          this.snackBar.open('Order deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error deleting order', 'Close', { duration: 3000 })
      });
    }
  }
}
