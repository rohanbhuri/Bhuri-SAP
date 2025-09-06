import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from '../../services/brand-config.service';

export interface InvoiceItem {
  _id?: string;
  productId?: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate?: number;
  taxAmount?: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  organizationId: string;
  customerId: string;
  orderId?: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  items: InvoiceItem[];
  paymentTerms?: string;
  notes?: string;
  createdBy: string;
  tags: string[];
  customFields: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Receipt {
  _id: string;
  receiptNumber: string;
  organizationId: string;
  invoiceId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  paymentDate: Date;
  reference?: string;
  notes?: string;
  attachments: string[];
  createdBy: string;
  createdAt: Date;
}

export interface Payment {
  _id: string;
  invoiceId: string;
  receiptId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  reference?: string;
  status: PaymentStatus;
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

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

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  
  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getDashboardStats(): Observable<FinanceStats> {
    return this.http
      .get<FinanceStats>(`${this.apiUrl}/finance/dashboard`)
      .pipe(catchError(() => of({
        totalInvoices: 0,
        draftInvoices: 0,
        sentInvoices: 0,
        paidInvoices: 0,
        overdueInvoices: 0,
        totalRevenue: 0,
        outstandingAmount: 0,
        overdueAmount: 0,
        averageInvoiceValue: 0,
        totalReceipts: 0,
        totalPayments: 0
      })));
  }

  // Invoice methods
  getAllInvoices(page: number = 1, limit: number = 10): Observable<{ invoices: Invoice[], total: number }> {
    return this.http
      .get<{ invoices: Invoice[], total: number }>(`${this.apiUrl}/finance/invoices?page=${page}&limit=${limit}`)
      .pipe(catchError(() => of({ invoices: [], total: 0 })));
  }

  getInvoiceById(id: string): Observable<Invoice | null> {
    return this.http
      .get<Invoice>(`${this.apiUrl}/finance/invoices/${id}`)
      .pipe(catchError(() => of(null)));
  }

  createInvoice(invoice: CreateInvoiceDto): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/finance/invoices`, invoice);
  }

  updateInvoice(id: string, invoice: UpdateInvoiceDto): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/finance/invoices/${id}`, invoice);
  }

  deleteInvoice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/finance/invoices/${id}`);
  }

  getInvoicesByStatus(status: InvoiceStatus): Observable<Invoice[]> {
    return this.http
      .get<Invoice[]>(`${this.apiUrl}/finance/invoices/status/${status}`)
      .pipe(catchError(() => of([])));
  }

  getInvoicesByCustomer(customerId: string): Observable<Invoice[]> {
    return this.http
      .get<Invoice[]>(`${this.apiUrl}/finance/invoices/customer/${customerId}`)
      .pipe(catchError(() => of([])));
  }

  searchInvoices(query: string): Observable<Invoice[]> {
    return this.http
      .get<Invoice[]>(`${this.apiUrl}/finance/invoices/search?q=${encodeURIComponent(query)}`)
      .pipe(catchError(() => of([])));
  }

  // Receipt methods
  getAllReceipts(page: number = 1, limit: number = 10): Observable<{ receipts: Receipt[], total: number }> {
    return this.http
      .get<{ receipts: Receipt[], total: number }>(`${this.apiUrl}/finance/receipts?page=${page}&limit=${limit}`)
      .pipe(catchError(() => of({ receipts: [], total: 0 })));
  }

  createReceipt(receipt: CreateReceiptDto): Observable<Receipt> {
    return this.http.post<Receipt>(`${this.apiUrl}/finance/receipts`, receipt);
  }

  // Payment methods
  getAllPayments(page: number = 1, limit: number = 10): Observable<{ payments: Payment[], total: number }> {
    return this.http
      .get<{ payments: Payment[], total: number }>(`${this.apiUrl}/finance/payments?page=${page}&limit=${limit}`)
      .pipe(catchError(() => of({ payments: [], total: 0 })));
  }

  createPayment(payment: CreatePaymentDto): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/finance/payments`, payment);
  }
}
