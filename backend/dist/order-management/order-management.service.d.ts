import { MongoRepository } from 'typeorm';
import { Order, OrderStatus, OrderStatusHistory, OrderPriority } from '../entities/order.entity';
import { Contact } from '../entities/contact.entity';
import { User } from '../entities/user.entity';
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
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone?: string;
    };
    billingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone?: string;
    };
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
    shippingAddress?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone?: string;
    };
    billingAddress?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone?: string;
    };
    notes?: string;
    assignedTo?: string;
    tags?: string[];
    customFields?: any;
}
export declare class OrderManagementService {
    private orderRepository;
    private orderStatusHistoryRepository;
    private contactRepository;
    private userRepository;
    constructor(orderRepository: MongoRepository<Order>, orderStatusHistoryRepository: MongoRepository<OrderStatusHistory>, contactRepository: MongoRepository<Contact>, userRepository: MongoRepository<User>);
    getDashboardStats(organizationId: string): Promise<OrderStats>;
    getAllOrders(organizationId: string, page?: number, limit?: number): Promise<{
        orders: Order[];
        total: number;
    }>;
    getOrderById(id: string, organizationId: string): Promise<Order | null>;
    createOrder(createOrderDto: CreateOrderDto, organizationId: string, userId: string): Promise<Order>;
    updateOrder(id: string, updateOrderDto: UpdateOrderDto, organizationId: string, userId: string): Promise<Order | null>;
    deleteOrder(id: string, organizationId: string): Promise<boolean>;
    getOrderStatusHistory(orderId: string, organizationId: string): Promise<OrderStatusHistory[]>;
    updateOrderStatus(orderId: string, status: OrderStatus, organizationId: string, userId: string, notes?: string): Promise<Order | null>;
    private createStatusHistory;
    private generateOrderNumber;
    getOrdersByStatus(status: OrderStatus, organizationId: string): Promise<Order[]>;
    getOrdersByCustomer(customerId: string, organizationId: string): Promise<Order[]>;
    searchOrders(query: string, organizationId: string): Promise<Order[]>;
}
