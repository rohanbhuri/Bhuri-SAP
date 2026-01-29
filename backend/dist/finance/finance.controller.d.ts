import { FinanceService, CreateInvoiceDto, UpdateInvoiceDto, CreateReceiptDto, CreatePaymentDto } from './finance.service';
import { InvoiceStatus } from '../entities/invoice.entity';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    getDashboardStats(req: any): Promise<import("./finance.service").FinanceStats>;
    getAllInvoices(req: any, page?: number, limit?: number): Promise<{
        invoices: import("../entities/invoice.entity").Invoice[];
        total: number;
    }>;
    getInvoiceById(req: any, id: string): Promise<import("../entities/invoice.entity").Invoice>;
    createInvoice(req: any, createInvoiceDto: CreateInvoiceDto): Promise<import("../entities/invoice.entity").Invoice>;
    updateInvoice(req: any, id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<import("../entities/invoice.entity").Invoice>;
    deleteInvoice(req: any, id: string): Promise<boolean>;
    getInvoicesByStatus(req: any, status: InvoiceStatus): Promise<import("../entities/invoice.entity").Invoice[]>;
    getInvoicesByCustomer(req: any, customerId: string): Promise<import("../entities/invoice.entity").Invoice[]>;
    searchInvoices(req: any, query: string): Promise<import("../entities/invoice.entity").Invoice[]>;
    getAllReceipts(req: any, page?: number, limit?: number): Promise<{
        receipts: import("../entities/invoice.entity").Receipt[];
        total: number;
    }>;
    createReceipt(req: any, createReceiptDto: CreateReceiptDto): Promise<import("../entities/invoice.entity").Receipt>;
    getAllPayments(req: any, page?: number, limit?: number): Promise<{
        payments: import("../entities/invoice.entity").Payment[];
        total: number;
    }>;
    createPayment(req: any, createPaymentDto: CreatePaymentDto): Promise<import("../entities/invoice.entity").Payment>;
}
