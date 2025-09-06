import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

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

export interface OrderItem {
  _id?: ObjectId;
  productId: ObjectId;
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

@Entity('orders')
export class Order {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  orderNumber: string;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column({ type: String })
  customerId: ObjectId;

  @Column()
  status: OrderStatus;

  @Column()
  priority: OrderPriority;

  @Column()
  orderDate: Date;

  @Column({ nullable: true })
  expectedDeliveryDate: Date;

  @Column({ nullable: true })
  actualDeliveryDate: Date;

  @Column()
  totalAmount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column('array')
  items: OrderItem[];

  @Column('simple-json')
  shippingAddress: Address;

  @Column('simple-json')
  billingAddress: Address;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: String })
  createdBy: ObjectId;

  @Column({ type: String, nullable: true })
  assignedTo: ObjectId;

  @Column('array')
  tags: string[];

  @Column('simple-json')
  customFields: any;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor() {
    this.status = OrderStatus.PENDING;
    this.priority = OrderPriority.MEDIUM;
    this.currency = 'USD';
    this.items = [];
    this.tags = [];
    this.customFields = {};
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

@Entity('order-status-history')
export class OrderStatusHistory {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: String })
  orderId: ObjectId;

  @Column()
  status: OrderStatus;

  @Column()
  timestamp: Date;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: String })
  updatedBy: ObjectId;

  constructor() {
    this.timestamp = new Date();
  }
}
