import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Invoice, InvoiceStatus, Receipt, Payment, PaymentMethod, PaymentStatus } from '../entities/invoice.entity';
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

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: MongoRepository<Invoice>,
    @InjectRepository(Receipt)
    private receiptRepository: MongoRepository<Receipt>,
    @InjectRepository(Payment)
    private paymentRepository: MongoRepository<Payment>,
    @InjectRepository(Contact)
    private contactRepository: MongoRepository<Contact>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    @InjectRepository(Order)
    private orderRepository: MongoRepository<Order>,
  ) {}

  async getDashboardStats(organizationId: string): Promise<FinanceStats> {
    const invoices = await this.invoiceRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });

    const receipts = await this.receiptRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });

    const payments = await this.paymentRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });

    const totalInvoices = invoices.length;
    const draftInvoices = invoices.filter(i => i.status === InvoiceStatus.DRAFT).length;
    const sentInvoices = invoices.filter(i => i.status === InvoiceStatus.SENT).length;
    const paidInvoices = invoices.filter(i => i.status === InvoiceStatus.PAID).length;
    const overdueInvoices = invoices.filter(i => i.status === InvoiceStatus.OVERDUE).length;

    const totalRevenue = invoices
      .filter(i => i.status === InvoiceStatus.PAID)
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

    const outstandingAmount = invoices
      .filter(i => i.status === InvoiceStatus.SENT)
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

    const overdueAmount = invoices
      .filter(i => i.status === InvoiceStatus.OVERDUE)
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

    const averageInvoiceValue = totalInvoices > 0 ? 
      invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0) / totalInvoices : 0;

    return {
      totalInvoices,
      draftInvoices,
      sentInvoices,
      paidInvoices,
      overdueInvoices,
      totalRevenue,
      outstandingAmount,
      overdueAmount,
      averageInvoiceValue,
      totalReceipts: receipts.length,
      totalPayments: payments.length
    };
  }

  async getAllInvoices(organizationId: string, page: number = 1, limit: number = 10): Promise<{ invoices: Invoice[], total: number }> {
    const skip = (page - 1) * limit;
    
    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where: { organizationId: new ObjectId(organizationId) },
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return { invoices, total };
  }

  async getInvoiceById(id: string, organizationId: string): Promise<Invoice | null> {
    return await this.invoiceRepository.findOne({
      where: { 
        _id: new ObjectId(id),
        organizationId: new ObjectId(organizationId)
      }
    });
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto, organizationId: string, userId: string): Promise<Invoice> {
    const invoiceNumber = await this.generateInvoiceNumber(organizationId);
    
    // Calculate amounts
    const subtotal = createInvoiceDto.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const taxAmount = createInvoiceDto.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const taxRate = item.taxRate || 0;
      return sum + (itemTotal * taxRate / 100);
    }, 0);

    const totalAmount = subtotal + taxAmount;

    const invoice = new Invoice();
    invoice.invoiceNumber = invoiceNumber;
    invoice.organizationId = new ObjectId(organizationId);
    invoice.customerId = new ObjectId(createInvoiceDto.customerId);
    invoice.orderId = createInvoiceDto.orderId ? new ObjectId(createInvoiceDto.orderId) : null;
    invoice.status = createInvoiceDto.status || InvoiceStatus.DRAFT;
    invoice.issueDate = new Date();
    invoice.dueDate = createInvoiceDto.dueDate;
    invoice.subtotal = subtotal;
    invoice.taxAmount = taxAmount;
    invoice.totalAmount = totalAmount;
    invoice.items = createInvoiceDto.items.map(item => ({
      productId: item.productId ? new ObjectId(item.productId) : null,
      productName: item.productName,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.quantity * item.unitPrice,
      taxRate: item.taxRate || 0,
      taxAmount: (item.quantity * item.unitPrice) * (item.taxRate || 0) / 100
    }));
    invoice.paymentTerms = createInvoiceDto.paymentTerms;
    invoice.notes = createInvoiceDto.notes;
    invoice.createdBy = new ObjectId(userId);
    invoice.tags = createInvoiceDto.tags || [];
    invoice.customFields = createInvoiceDto.customFields || {};

    return await this.invoiceRepository.save(invoice);
  }

  async updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto, organizationId: string, userId: string): Promise<Invoice | null> {
    const invoice = await this.getInvoiceById(id, organizationId);
    if (!invoice) {
      return null;
    }

    // Update invoice fields
    if (updateInvoiceDto.status !== undefined) invoice.status = updateInvoiceDto.status;
    if (updateInvoiceDto.dueDate !== undefined) invoice.dueDate = updateInvoiceDto.dueDate;
    if (updateInvoiceDto.paidDate !== undefined) invoice.paidDate = updateInvoiceDto.paidDate;
    if (updateInvoiceDto.items !== undefined) {
      invoice.items = updateInvoiceDto.items.map(item => ({
        productId: item.productId ? new ObjectId(item.productId) : null,
        productName: item.productName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        taxRate: item.taxRate || 0,
        taxAmount: (item.quantity * item.unitPrice) * (item.taxRate || 0) / 100
      }));
      // Recalculate amounts
      invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.totalPrice, 0);
      invoice.taxAmount = invoice.items.reduce((sum, item) => sum + item.taxAmount, 0);
      invoice.totalAmount = invoice.subtotal + invoice.taxAmount;
    }
    if (updateInvoiceDto.paymentTerms !== undefined) invoice.paymentTerms = updateInvoiceDto.paymentTerms;
    if (updateInvoiceDto.notes !== undefined) invoice.notes = updateInvoiceDto.notes;
    if (updateInvoiceDto.tags !== undefined) invoice.tags = updateInvoiceDto.tags;
    if (updateInvoiceDto.customFields !== undefined) invoice.customFields = updateInvoiceDto.customFields;

    invoice.updatedAt = new Date();

    return await this.invoiceRepository.save(invoice);
  }

  async deleteInvoice(id: string, organizationId: string): Promise<boolean> {
    const result = await this.invoiceRepository.delete({
      _id: new ObjectId(id),
      organizationId: new ObjectId(organizationId)
    });
    return result.affected > 0;
  }

  async createReceipt(createReceiptDto: CreateReceiptDto, organizationId: string, userId: string): Promise<Receipt> {
    const receiptNumber = await this.generateReceiptNumber(organizationId);

    const receipt = new Receipt();
    receipt.receiptNumber = receiptNumber;
    receipt.organizationId = new ObjectId(organizationId);
    receipt.invoiceId = new ObjectId(createReceiptDto.invoiceId);
    receipt.paymentMethod = createReceiptDto.paymentMethod;
    receipt.amount = createReceiptDto.amount;
    receipt.paymentDate = createReceiptDto.paymentDate;
    receipt.reference = createReceiptDto.reference;
    receipt.notes = createReceiptDto.notes;
    receipt.attachments = createReceiptDto.attachments || [];
    receipt.createdBy = new ObjectId(userId);

    return await this.receiptRepository.save(receipt);
  }

  async createPayment(createPaymentDto: CreatePaymentDto, organizationId: string, userId: string): Promise<Payment> {
    const payment = new Payment();
    payment.invoiceId = new ObjectId(createPaymentDto.invoiceId);
    payment.amount = createPaymentDto.amount;
    payment.paymentMethod = createPaymentDto.paymentMethod;
    payment.paymentDate = createPaymentDto.paymentDate;
    payment.reference = createPaymentDto.reference;
    payment.status = PaymentStatus.COMPLETED;
    payment.organizationId = new ObjectId(organizationId);
    payment.createdBy = new ObjectId(userId);

    const savedPayment = await this.paymentRepository.save(payment);

    // Update invoice status if fully paid
    await this.updateInvoicePaymentStatus(createPaymentDto.invoiceId, organizationId);

    return savedPayment;
  }

  async getAllReceipts(organizationId: string, page: number = 1, limit: number = 10): Promise<{ receipts: Receipt[], total: number }> {
    const skip = (page - 1) * limit;
    
    const [receipts, total] = await this.receiptRepository.findAndCount({
      where: { organizationId: new ObjectId(organizationId) },
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return { receipts, total };
  }

  async getAllPayments(organizationId: string, page: number = 1, limit: number = 10): Promise<{ payments: Payment[], total: number }> {
    const skip = (page - 1) * limit;
    
    const [payments, total] = await this.paymentRepository.findAndCount({
      where: { organizationId: new ObjectId(organizationId) },
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return { payments, total };
  }

  async getInvoicesByStatus(status: InvoiceStatus, organizationId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { 
        status,
        organizationId: new ObjectId(organizationId)
      },
      order: { createdAt: 'DESC' }
    });
  }

  async getInvoicesByCustomer(customerId: string, organizationId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { 
        customerId: new ObjectId(customerId),
        organizationId: new ObjectId(organizationId)
      },
      order: { createdAt: 'DESC' }
    });
  }

  async searchInvoices(query: string, organizationId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: {
        organizationId: new ObjectId(organizationId),
        $or: [
          { invoiceNumber: { $regex: query, $options: 'i' } },
          { 'items.productName': { $regex: query, $options: 'i' } },
          { notes: { $regex: query, $options: 'i' } }
        ]
      },
      order: { createdAt: 'DESC' }
    });
  }

  private async updateInvoicePaymentStatus(invoiceId: string, organizationId: string): Promise<void> {
    const invoice = await this.getInvoiceById(invoiceId, organizationId);
    if (!invoice) return;

    const totalPaid = await this.getTotalPaidAmount(invoiceId);
    
    if (totalPaid >= invoice.totalAmount) {
      invoice.status = InvoiceStatus.PAID;
      invoice.paidDate = new Date();
      await this.invoiceRepository.save(invoice);
    }
  }

  private async getTotalPaidAmount(invoiceId: string): Promise<number> {
    const payments = await this.paymentRepository.find({
      where: { 
        invoiceId: new ObjectId(invoiceId),
        status: PaymentStatus.COMPLETED
      }
    });

    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  }

  private async generateInvoiceNumber(organizationId: string): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const prefix = `INV-${year}${month}${day}`;
    
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const count = await this.invoiceRepository.count({
      where: {
        organizationId: new ObjectId(organizationId),
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }
    });
    
    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}-${sequence}`;
  }

  private async generateReceiptNumber(organizationId: string): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const prefix = `RCP-${year}${month}${day}`;
    
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const count = await this.receiptRepository.count({
      where: {
        organizationId: new ObjectId(organizationId),
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }
    });
    
    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}-${sequence}`;
  }
}
