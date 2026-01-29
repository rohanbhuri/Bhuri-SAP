import { ObjectId } from 'typeorm';
export interface OrderItem {
    productId: string | ObjectId;
    productName: string;
    variationId?: string;
    variationName?: string;
    quantity: number;
    unitPrice: number;
    total: number;
    totalPrice?: number;
    description?: string;
    specifications?: any;
}
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    SHIPPED = "shipped",
    DELIVERED = "delivered"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PARTIAL = "partial",
    PAID = "paid"
}
export declare enum DeliveryStatus {
    PENDING = "pending",
    SHIPPED = "shipped",
    DELIVERED = "delivered"
}
export declare enum OrderPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class OrderStatusHistory {
    _id: ObjectId;
    orderId: ObjectId;
    status: OrderStatus;
    updatedBy: ObjectId;
    notes?: string;
    timestamp: Date;
    constructor();
}
export declare class Order {
    _id: ObjectId;
    orderNumber: string;
    quotationId?: ObjectId;
    contactId?: ObjectId;
    customerId?: ObjectId;
    enquiryId?: ObjectId;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    items: OrderItem[];
    subtotal?: number;
    taxTotal?: number;
    discountTotal?: number;
    totalAmount: number;
    currency?: string;
    status: OrderStatus;
    paymentStatus?: PaymentStatus;
    deliveryStatus?: DeliveryStatus;
    priority?: OrderPriority;
    organizationId: string;
    notes?: string;
    shippingAddress?: string | any;
    billingAddress?: string | any;
    orderDate?: Date;
    expectedDeliveryDate?: Date;
    actualDeliveryDate?: Date;
    deliveredAt?: Date;
    assignedToId?: ObjectId;
    assignedTo?: ObjectId;
    createdBy?: ObjectId;
    tags?: string[];
    customFields?: any;
    createdAt: Date;
    updatedAt?: Date;
    constructor();
}
