"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const invoice_entity_1 = require("../entities/invoice.entity");
const contact_entity_1 = require("../entities/contact.entity");
const user_entity_1 = require("../entities/user.entity");
const order_entity_1 = require("../entities/order.entity");
let FinanceService = class FinanceService {
    constructor(invoiceRepository, receiptRepository, paymentRepository, contactRepository, userRepository, orderRepository) {
        this.invoiceRepository = invoiceRepository;
        this.receiptRepository = receiptRepository;
        this.paymentRepository = paymentRepository;
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }
    async getDashboardStats(organizationId) {
        const invoices = await this.invoiceRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        const receipts = await this.receiptRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        const payments = await this.paymentRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        const totalInvoices = invoices.length;
        const draftInvoices = invoices.filter(i => i.status === invoice_entity_1.InvoiceStatus.DRAFT).length;
        const sentInvoices = invoices.filter(i => i.status === invoice_entity_1.InvoiceStatus.SENT).length;
        const paidInvoices = invoices.filter(i => i.status === invoice_entity_1.InvoiceStatus.PAID).length;
        const overdueInvoices = invoices.filter(i => i.status === invoice_entity_1.InvoiceStatus.OVERDUE).length;
        const totalRevenue = invoices
            .filter(i => i.status === invoice_entity_1.InvoiceStatus.PAID)
            .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
        const outstandingAmount = invoices
            .filter(i => i.status === invoice_entity_1.InvoiceStatus.SENT)
            .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
        const overdueAmount = invoices
            .filter(i => i.status === invoice_entity_1.InvoiceStatus.OVERDUE)
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
    async getAllInvoices(organizationId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [invoices, total] = await this.invoiceRepository.findAndCount({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) },
            skip,
            take: limit,
            order: { createdAt: 'DESC' }
        });
        return { invoices, total };
    }
    async getInvoiceById(id, organizationId) {
        return await this.invoiceRepository.findOne({
            where: {
                _id: new mongodb_1.ObjectId(id),
                organizationId: new mongodb_1.ObjectId(organizationId)
            }
        });
    }
    async createInvoice(createInvoiceDto, organizationId, userId) {
        const invoiceNumber = await this.generateInvoiceNumber(organizationId);
        const subtotal = createInvoiceDto.items.reduce((sum, item) => {
            return sum + (item.quantity * item.unitPrice);
        }, 0);
        const taxAmount = createInvoiceDto.items.reduce((sum, item) => {
            const itemTotal = item.quantity * item.unitPrice;
            const taxRate = item.taxRate || 0;
            return sum + (itemTotal * taxRate / 100);
        }, 0);
        const totalAmount = subtotal + taxAmount;
        const invoice = new invoice_entity_1.Invoice();
        invoice.invoiceNumber = invoiceNumber;
        invoice.organizationId = new mongodb_1.ObjectId(organizationId);
        invoice.customerId = new mongodb_1.ObjectId(createInvoiceDto.customerId);
        invoice.orderId = createInvoiceDto.orderId ? new mongodb_1.ObjectId(createInvoiceDto.orderId) : null;
        invoice.status = createInvoiceDto.status || invoice_entity_1.InvoiceStatus.DRAFT;
        invoice.issueDate = new Date();
        invoice.dueDate = createInvoiceDto.dueDate;
        invoice.subtotal = subtotal;
        invoice.taxAmount = taxAmount;
        invoice.totalAmount = totalAmount;
        invoice.items = createInvoiceDto.items.map(item => ({
            productId: item.productId ? new mongodb_1.ObjectId(item.productId) : null,
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
        invoice.createdBy = new mongodb_1.ObjectId(userId);
        invoice.tags = createInvoiceDto.tags || [];
        invoice.customFields = createInvoiceDto.customFields || {};
        return await this.invoiceRepository.save(invoice);
    }
    async updateInvoice(id, updateInvoiceDto, organizationId, userId) {
        const invoice = await this.getInvoiceById(id, organizationId);
        if (!invoice) {
            return null;
        }
        if (updateInvoiceDto.status !== undefined)
            invoice.status = updateInvoiceDto.status;
        if (updateInvoiceDto.dueDate !== undefined)
            invoice.dueDate = updateInvoiceDto.dueDate;
        if (updateInvoiceDto.paidDate !== undefined)
            invoice.paidDate = updateInvoiceDto.paidDate;
        if (updateInvoiceDto.items !== undefined) {
            invoice.items = updateInvoiceDto.items.map(item => ({
                productId: item.productId ? new mongodb_1.ObjectId(item.productId) : null,
                productName: item.productName,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.quantity * item.unitPrice,
                taxRate: item.taxRate || 0,
                taxAmount: (item.quantity * item.unitPrice) * (item.taxRate || 0) / 100
            }));
            invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.totalPrice, 0);
            invoice.taxAmount = invoice.items.reduce((sum, item) => sum + item.taxAmount, 0);
            invoice.totalAmount = invoice.subtotal + invoice.taxAmount;
        }
        if (updateInvoiceDto.paymentTerms !== undefined)
            invoice.paymentTerms = updateInvoiceDto.paymentTerms;
        if (updateInvoiceDto.notes !== undefined)
            invoice.notes = updateInvoiceDto.notes;
        if (updateInvoiceDto.tags !== undefined)
            invoice.tags = updateInvoiceDto.tags;
        if (updateInvoiceDto.customFields !== undefined)
            invoice.customFields = updateInvoiceDto.customFields;
        invoice.updatedAt = new Date();
        return await this.invoiceRepository.save(invoice);
    }
    async deleteInvoice(id, organizationId) {
        const result = await this.invoiceRepository.delete({
            _id: new mongodb_1.ObjectId(id),
            organizationId: new mongodb_1.ObjectId(organizationId)
        });
        return result.affected > 0;
    }
    async createReceipt(createReceiptDto, organizationId, userId) {
        const receiptNumber = await this.generateReceiptNumber(organizationId);
        const receipt = new invoice_entity_1.Receipt();
        receipt.receiptNumber = receiptNumber;
        receipt.organizationId = new mongodb_1.ObjectId(organizationId);
        receipt.invoiceId = new mongodb_1.ObjectId(createReceiptDto.invoiceId);
        receipt.paymentMethod = createReceiptDto.paymentMethod;
        receipt.amount = createReceiptDto.amount;
        receipt.paymentDate = createReceiptDto.paymentDate;
        receipt.reference = createReceiptDto.reference;
        receipt.notes = createReceiptDto.notes;
        receipt.attachments = createReceiptDto.attachments || [];
        receipt.createdBy = new mongodb_1.ObjectId(userId);
        return await this.receiptRepository.save(receipt);
    }
    async createPayment(createPaymentDto, organizationId, userId) {
        const payment = new invoice_entity_1.Payment();
        payment.invoiceId = new mongodb_1.ObjectId(createPaymentDto.invoiceId);
        payment.amount = createPaymentDto.amount;
        payment.paymentMethod = createPaymentDto.paymentMethod;
        payment.paymentDate = createPaymentDto.paymentDate;
        payment.reference = createPaymentDto.reference;
        payment.status = invoice_entity_1.PaymentStatus.COMPLETED;
        payment.organizationId = new mongodb_1.ObjectId(organizationId);
        payment.createdBy = new mongodb_1.ObjectId(userId);
        const savedPayment = await this.paymentRepository.save(payment);
        await this.updateInvoicePaymentStatus(createPaymentDto.invoiceId, organizationId);
        return savedPayment;
    }
    async getAllReceipts(organizationId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [receipts, total] = await this.receiptRepository.findAndCount({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) },
            skip,
            take: limit,
            order: { createdAt: 'DESC' }
        });
        return { receipts, total };
    }
    async getAllPayments(organizationId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [payments, total] = await this.paymentRepository.findAndCount({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) },
            skip,
            take: limit,
            order: { createdAt: 'DESC' }
        });
        return { payments, total };
    }
    async getInvoicesByStatus(status, organizationId) {
        return await this.invoiceRepository.find({
            where: {
                status,
                organizationId: new mongodb_1.ObjectId(organizationId)
            },
            order: { createdAt: 'DESC' }
        });
    }
    async getInvoicesByCustomer(customerId, organizationId) {
        return await this.invoiceRepository.find({
            where: {
                customerId: new mongodb_1.ObjectId(customerId),
                organizationId: new mongodb_1.ObjectId(organizationId)
            },
            order: { createdAt: 'DESC' }
        });
    }
    async searchInvoices(query, organizationId) {
        return await this.invoiceRepository.find({
            where: {
                organizationId: new mongodb_1.ObjectId(organizationId),
                $or: [
                    { invoiceNumber: { $regex: query, $options: 'i' } },
                    { 'items.productName': { $regex: query, $options: 'i' } },
                    { notes: { $regex: query, $options: 'i' } }
                ]
            },
            order: { createdAt: 'DESC' }
        });
    }
    async updateInvoicePaymentStatus(invoiceId, organizationId) {
        const invoice = await this.getInvoiceById(invoiceId, organizationId);
        if (!invoice)
            return;
        const totalPaid = await this.getTotalPaidAmount(invoiceId);
        if (totalPaid >= invoice.totalAmount) {
            invoice.status = invoice_entity_1.InvoiceStatus.PAID;
            invoice.paidDate = new Date();
            await this.invoiceRepository.save(invoice);
        }
    }
    async getTotalPaidAmount(invoiceId) {
        const payments = await this.paymentRepository.find({
            where: {
                invoiceId: new mongodb_1.ObjectId(invoiceId),
                status: invoice_entity_1.PaymentStatus.COMPLETED
            }
        });
        return payments.reduce((sum, payment) => sum + payment.amount, 0);
    }
    async generateInvoiceNumber(organizationId) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const prefix = `INV-${year}${month}${day}`;
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const count = await this.invoiceRepository.count({
            where: {
                organizationId: new mongodb_1.ObjectId(organizationId),
                createdAt: {
                    $gte: startOfDay,
                    $lt: endOfDay
                }
            }
        });
        const sequence = String(count + 1).padStart(4, '0');
        return `${prefix}-${sequence}`;
    }
    async generateReceiptNumber(organizationId) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const prefix = `RCP-${year}${month}${day}`;
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const count = await this.receiptRepository.count({
            where: {
                organizationId: new mongodb_1.ObjectId(organizationId),
                createdAt: {
                    $gte: startOfDay,
                    $lt: endOfDay
                }
            }
        });
        const sequence = String(count + 1).padStart(4, '0');
        return `${prefix}-${sequence}`;
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(invoice_entity_1.Receipt)),
    __param(2, (0, typeorm_1.InjectRepository)(invoice_entity_1.Payment)),
    __param(3, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], FinanceService);
//# sourceMappingURL=finance.service.js.map