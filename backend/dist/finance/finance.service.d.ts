import { MongoRepository } from 'typeorm';
import { Invoice, InvoiceStatus, Receipt, Payment, PaymentMethod } from '../entities/invoice.entity';
import { Contact } from '../entities/contact.entity';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
export interface FinanceStats {
    totalInvoices: number;
    draftInvoices: number;
    sentInvoices: number;
    paidInvoices: number;
    overdueInvoices: number;
    totalRevenue: number;
    outstandingAmount: number;
    overdueAmount: number;
    averageInvoiceValue: number;
    totalReceipts: number;
    totalPayments: number;
}
export interface CreateInvoiceDto {
    customerId: string;
    orderId?: string;
    status?: InvoiceStatus;
    dueDate: Date;
    items: Array<{
        productId?: string;
        productName: string;
        description?: string;
        quantity: number;
        unitPrice: number;
        taxRate?: number;
    }>;
    paymentTerms?: string;
    notes?: string;
    tags?: string[];
    customFields?: any;
}
export interface UpdateInvoiceDto {
    status?: InvoiceStatus;
    dueDate?: Date;
    paidDate?: Date;
    items?: Array<{
        productId?: string;
        productName: string;
        description?: string;
        quantity: number;
        unitPrice: number;
        taxRate?: number;
    }>;
    paymentTerms?: string;
    notes?: string;
    tags?: string[];
    customFields?: any;
}
export interface CreateReceiptDto {
    invoiceId: string;
    paymentMethod: PaymentMethod;
    amount: number;
    paymentDate: Date;
    reference?: string;
    notes?: string;
    attachments?: string[];
}
export interface CreatePaymentDto {
    invoiceId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentDate: Date;
    reference?: string;
}
export declare class FinanceService {
    private invoiceRepository;
    private receiptRepository;
    private paymentRepository;
    private contactRepository;
    private userRepository;
    private orderRepository;
    constructor(invoiceRepository: MongoRepository<Invoice>, receiptRepository: MongoRepository<Receipt>, paymentRepository: MongoRepository<Payment>, contactRepository: MongoRepository<Contact>, userRepository: MongoRepository<User>, orderRepository: MongoRepository<Order>);
    getDashboardStats(organizationId: string): Promise<FinanceStats>;
    getAllInvoices(organizationId: string, page?: number, limit?: number): Promise<{
        invoices: Invoice[];
        total: number;
    }>;
    getInvoiceById(id: string, organizationId: string): Promise<Invoice | null>;
    createInvoice(createInvoiceDto: CreateInvoiceDto, organizationId: string, userId: string): Promise<Invoice>;
    updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto, organizationId: string, userId: string): Promise<Invoice | null>;
    deleteInvoice(id: string, organizationId: string): Promise<boolean>;
    createReceipt(createReceiptDto: CreateReceiptDto, organizationId: string, userId: string): Promise<Receipt>;
    createPayment(createPaymentDto: CreatePaymentDto, organizationId: string, userId: string): Promise<Payment>;
    getAllReceipts(organizationId: string, page?: number, limit?: number): Promise<{
        receipts: Receipt[];
        total: number;
    }>;
    getAllPayments(organizationId: string, page?: number, limit?: number): Promise<{
        payments: Payment[];
        total: number;
    }>;
    getInvoicesByStatus(status: InvoiceStatus, organizationId: string): Promise<Invoice[]>;
    getInvoicesByCustomer(customerId: string, organizationId: string): Promise<Invoice[]>;
    searchInvoices(query: string, organizationId: string): Promise<Invoice[]>;
    private updateInvoicePaymentStatus;
    private getTotalPaidAmount;
    private generateInvoiceNumber;
    private generateReceiptNumber;
}
