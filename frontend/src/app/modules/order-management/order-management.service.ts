import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from '../../services/brand-config.service';

export interface OrderItem {
  _id?: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: any;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  organizationId: string;
  customerId: string;
  status: OrderStatus;
  priority: OrderPriority;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  createdBy: string;
  assignedTo?: string;
  tags: string[];
  customFields: any;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum OrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalValue: number;
  averageOrderValue: number;
  overdueOrders: number;
}

export interface CreateOrderDto {
  customerId: string;
  status?: OrderStatus;
  priority?: OrderPriority;
  expectedDeliveryDate?: Date;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    specifications?: any;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  assignedTo?: string;
  tags?: string[];
  customFields?: any;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  priority?: OrderPriority;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    specifications?: any;
  }>;
  shippingAddress?: Address;
  billingAddress?: Address;
  notes?: string;
  assignedTo?: string;
  tags?: string[];
  customFields?: any;
}

@Injectable({ providedIn: 'root' })
export class OrderManagementService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  
  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getDashboardStats(): Observable<OrderStats> {
    return this.http
      .get<OrderStats>(`${this.apiUrl}/order-management/dashboard`)
      .pipe(catchError(() => of({
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        totalValue: 0,
        averageOrderValue: 0,
        overdueOrders: 0
      })));
  }

  getAllOrders(page: number = 1, limit: number = 10): Observable<{ orders: Order[], total: number }> {
    return this.http
      .get<{ orders: Order[], total: number }>(`${this.apiUrl}/order-management/orders?page=${page}&limit=${limit}`)
      .pipe(catchError(() => of({ orders: [], total: 0 })));
  }

  getOrderById(id: string): Observable<Order | null> {
    return this.http
      .get<Order>(`${this.apiUrl}/order-management/orders/${id}`)
      .pipe(catchError(() => of(null)));
  }

  createOrder(order: CreateOrderDto): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/order-management/orders`, order);
  }

  updateOrder(id: string, order: UpdateOrderDto): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/order-management/orders/${id}`, order);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/order-management/orders/${id}`);
  }

  updateOrderStatus(id: string, status: OrderStatus, notes?: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/order-management/orders/${id}/status`, { status, notes });
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${this.apiUrl}/order-management/orders/status/${status}`)
      .pipe(catchError(() => of([])));
  }

  getOrdersByCustomer(customerId: string): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${this.apiUrl}/order-management/orders/customer/${customerId}`)
      .pipe(catchError(() => of([])));
  }

  searchOrders(query: string): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${this.apiUrl}/order-management/orders/search?q=${encodeURIComponent(query)}`)
      .pipe(catchError(() => of([])));
  }

  getOrderStatusHistory(orderId: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/order-management/orders/${orderId}/status-history`)
      .pipe(catchError(() => of([])));
  }
}
