import { ObjectId } from 'typeorm';
export declare enum InvoiceStatus {
    DRAFT = "draft",
    SENT = "sent",
    PAID = "paid",
    OVERDUE = "overdue",
    CANCELLED = "cancelled"
}
export declare enum PaymentMethod {
    CASH = "cash",
    CARD = "card",
    BANK_TRANSFER = "bank_transfer",
    CHECK = "check",
    CRYPTO = "crypto"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
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
export declare class Invoice {
    _id: ObjectId;
    invoiceNumber: string;
    organizationId: ObjectId;
    customerId: ObjectId;
    orderId: ObjectId;
    status: InvoiceStatus;
    issueDate: Date;
    dueDate: Date;
    paidDate: Date;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
    items: InvoiceItem[];
    paymentTerms: string;
    notes: string;
    createdBy: ObjectId;
    tags: string[];
    customFields: any;
    createdAt: Date;
    updatedAt: Date;
    constructor();
}
export declare class Receipt {
    _id: ObjectId;
    receiptNumber: string;
    organizationId: ObjectId;
    invoiceId: ObjectId;
    paymentMethod: PaymentMethod;
    amount: number;
    currency: string;
    paymentDate: Date;
    reference: string;
    notes: string;
    attachments: string[];
    createdBy: ObjectId;
    createdAt: Date;
    constructor();
}
export declare class Payment {
    _id: ObjectId;
    invoiceId: ObjectId;
    receiptId: ObjectId;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentDate: Date;
    reference: string;
    status: PaymentStatus;
    organizationId: ObjectId;
    createdBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    constructor();
}
