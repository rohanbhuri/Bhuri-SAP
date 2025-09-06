import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  CRYPTO = 'crypto'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface InvoiceItem {
  _id?: ObjectId;
  productId?: ObjectId;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate?: number;
  taxAmount?: number;
}

@Entity('invoices')
export class Invoice {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  invoiceNumber: string;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column({ type: String })
  customerId: ObjectId;

  @Column({ type: String, nullable: true })
  orderId: ObjectId;

  @Column()
  status: InvoiceStatus;

  @Column()
  issueDate: Date;

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  paidDate: Date;

  @Column()
  subtotal: number;

  @Column({ default: 0 })
  taxAmount: number;

  @Column({ default: 0 })
  discountAmount: number;

  @Column()
  totalAmount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column('array')
  items: InvoiceItem[];

  @Column({ nullable: true })
  paymentTerms: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: String })
  createdBy: ObjectId;

  @Column('array')
  tags: string[];

  @Column('simple-json')
  customFields: any;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor() {
    this.status = InvoiceStatus.DRAFT;
    this.currency = 'USD';
    this.items = [];
    this.tags = [];
    this.customFields = {};
    this.taxAmount = 0;
    this.discountAmount = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

@Entity('receipts')
export class Receipt {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  receiptNumber: string;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column({ type: String })
  invoiceId: ObjectId;

  @Column()
  paymentMethod: PaymentMethod;

  @Column()
  amount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column()
  paymentDate: Date;

  @Column({ nullable: true })
  reference: string;

  @Column({ nullable: true })
  notes: string;

  @Column('array')
  attachments: string[];

  @Column({ type: String })
  createdBy: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.currency = 'USD';
    this.attachments = [];
    this.createdAt = new Date();
  }
}

@Entity('payments')
export class Payment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: String })
  invoiceId: ObjectId;

  @Column({ type: String, nullable: true })
  receiptId: ObjectId;

  @Column()
  amount: number;

  @Column()
  paymentMethod: PaymentMethod;

  @Column()
  paymentDate: Date;

  @Column({ nullable: true })
  reference: string;

  @Column()
  status: PaymentStatus;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column({ type: String })
  createdBy: ObjectId;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor() {
    this.status = PaymentStatus.PENDING;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
