import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

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

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid'
}

export enum DeliveryStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered'
}

export enum OrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity('order_status_history')
export class OrderStatusHistory {
  @ObjectIdColumn()
  _id: ObjectId;

  @ObjectIdColumn()
  orderId: ObjectId;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @ObjectIdColumn()
  updatedBy: ObjectId;

  @Column({ nullable: true })
  notes?: string;

  @Column()
  timestamp: Date;

  constructor() {
    this.timestamp = new Date();
  }
}

@Entity('orders')
export class Order {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  orderNumber: string;

  @ObjectIdColumn()
  quotationId?: ObjectId;

  @ObjectIdColumn()
  contactId?: ObjectId;

  @ObjectIdColumn()
  customerId?: ObjectId;

  @ObjectIdColumn()
  enquiryId?: ObjectId;

  @Column()
  clientName?: string;

  @Column()
  clientEmail?: string;

  @Column({ nullable: true })
  clientPhone?: string;

  @Column('array')
  items: OrderItem[];

  @Column({ type: 'double' })
  subtotal?: number;

  @Column({ type: 'double', default: 0 })
  taxTotal?: number;

  @Column({ type: 'double', default: 0 })
  discountTotal?: number;

  @Column({ type: 'double' })
  totalAmount: number;

  @Column({ default: 'USD' })
  currency?: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus?: PaymentStatus;

  @Column({ type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.PENDING })
  deliveryStatus?: DeliveryStatus;

  @Column({ type: 'enum', enum: OrderPriority, default: OrderPriority.MEDIUM })
  priority?: OrderPriority;

  @Column()
  organizationId: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  shippingAddress?: string | any;

  @Column({ nullable: true })
  billingAddress?: string | any;

  @Column({ nullable: true })
  orderDate?: Date;

  @Column({ nullable: true })
  expectedDeliveryDate?: Date;

  @Column({ nullable: true })
  actualDeliveryDate?: Date;

  @Column({ nullable: true })
  deliveredAt?: Date;

  @ObjectIdColumn()
  assignedToId?: ObjectId;

  @ObjectIdColumn()
  assignedTo?: ObjectId;

  @ObjectIdColumn()
  createdBy?: ObjectId;

  @Column('array')
  tags?: string[];

  @Column({ nullable: true })
  customFields?: any;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date;

  constructor() {
    this.items = [];
    this.status = OrderStatus.PENDING;
    this.paymentStatus = PaymentStatus.PENDING;
    this.deliveryStatus = DeliveryStatus.PENDING;
    this.priority = OrderPriority.MEDIUM;
    this.currency = 'USD';
    this.tags = [];
    this.createdAt = new Date();
  }
}
