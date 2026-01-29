import { OrderManagementService, CreateOrderDto, UpdateOrderDto } from './order-management.service';
import { OrderStatus } from '../entities/order.entity';
export declare class OrderManagementController {
    private readonly orderManagementService;
    constructor(orderManagementService: OrderManagementService);
    getDashboardStats(req: any): Promise<import("./order-management.service").OrderStats>;
    getAllOrders(req: any, page?: number, limit?: number): Promise<{
        orders: import("../entities/order.entity").Order[];
        total: number;
    }>;
    getOrderById(req: any, id: string): Promise<import("../entities/order.entity").Order>;
    createOrder(req: any, createOrderDto: CreateOrderDto): Promise<import("../entities/order.entity").Order>;
    updateOrder(req: any, id: string, updateOrderDto: UpdateOrderDto): Promise<import("../entities/order.entity").Order>;
    deleteOrder(req: any, id: string): Promise<boolean>;
    getOrderStatusHistory(req: any, id: string): Promise<import("../entities/order.entity").OrderStatusHistory[]>;
    updateOrderStatus(req: any, id: string, body: {
        status: OrderStatus;
        notes?: string;
    }): Promise<import("../entities/order.entity").Order>;
    getOrdersByStatus(req: any, status: OrderStatus): Promise<import("../entities/order.entity").Order[]>;
    getOrdersByCustomer(req: any, customerId: string): Promise<import("../entities/order.entity").Order[]>;
    searchOrders(req: any, query: string): Promise<import("../entities/order.entity").Order[]>;
}
