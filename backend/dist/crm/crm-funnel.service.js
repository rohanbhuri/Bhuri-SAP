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
exports.CrmFunnelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const client_request_entity_1 = require("../entities/client-request.entity");
const contact_entity_1 = require("../entities/contact.entity");
const enquiry_entity_1 = require("../entities/enquiry.entity");
const presentation_entity_1 = require("../entities/presentation.entity");
const quotation_entity_1 = require("../entities/quotation.entity");
const order_entity_1 = require("../entities/order.entity");
const invoice_entity_1 = require("../entities/invoice.entity");
const user_entity_1 = require("../entities/user.entity");
let CrmFunnelService = class CrmFunnelService {
    constructor(clientRequestRepository, contactRepository, enquiryRepository, presentationRepository, quotationRepository, orderRepository, invoiceRepository, userRepository) {
        this.clientRequestRepository = clientRequestRepository;
        this.contactRepository = contactRepository;
        this.enquiryRepository = enquiryRepository;
        this.presentationRepository = presentationRepository;
        this.quotationRepository = quotationRepository;
        this.orderRepository = orderRepository;
        this.invoiceRepository = invoiceRepository;
        this.userRepository = userRepository;
    }
    async getFunnelDashboard(organizationId) {
        const orgId = new mongodb_1.ObjectId(organizationId);
        const [requests, contacts, enquiries, presentations, quotations, orders] = await Promise.all([
            this.clientRequestRepository.find({ where: { status: client_request_entity_1.ClientRequestStatus.PENDING } }),
            this.contactRepository.find({ where: { organizationId: orgId } }),
            this.enquiryRepository.find({ where: { organizationId } }),
            this.presentationRepository.find({ where: { organizationId } }),
            this.quotationRepository.find({ where: { organizationId } }),
            this.orderRepository.find({ where: { organizationId } }),
        ]);
        const activeEnquiries = enquiries.filter(e => [enquiry_entity_1.EnquiryStatus.NEW, enquiry_entity_1.EnquiryStatus.PROCESSING, enquiry_entity_1.EnquiryStatus.PRESENTATION_SENT].includes(e.status));
        const activeQuotations = quotations.filter(q => [quotation_entity_1.QuotationStatus.DRAFT, quotation_entity_1.QuotationStatus.SENT, quotation_entity_1.QuotationStatus.PENDING_APPROVAL].includes(q.status));
        const wonOrders = orders.filter(o => o.status === order_entity_1.OrderStatus.COMPLETED);
        const lostEnquiries = enquiries.filter(e => e.status === enquiry_entity_1.EnquiryStatus.LOST);
        const totalRevenue = wonOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const pipelineValue = activeQuotations.reduce((sum, q) => sum + q.grandTotal, 0);
        return {
            funnel: {
                requests: requests.length,
                contacts: contacts.length,
                enquiries: enquiries.length,
                presentations: presentations.length,
                quotations: quotations.length,
                orders: orders.length,
            },
            active: {
                enquiries: activeEnquiries.length,
                quotations: activeQuotations.length,
            },
            conversion: {
                requestToContact: requests.length > 0 ? (contacts.length / requests.length * 100).toFixed(2) : 0,
                contactToEnquiry: contacts.length > 0 ? (enquiries.length / contacts.length * 100).toFixed(2) : 0,
                enquiryToQuotation: enquiries.length > 0 ? (quotations.length / enquiries.length * 100).toFixed(2) : 0,
                quotationToOrder: quotations.length > 0 ? (orders.length / quotations.length * 100).toFixed(2) : 0,
            },
            revenue: {
                total: totalRevenue,
                pipeline: pipelineValue,
                won: wonOrders.length,
                lost: lostEnquiries.length,
            }
        };
    }
    async getPipeline(organizationId) {
        const enquiries = await this.enquiryRepository.find({ where: { organizationId } });
        const pipeline = {
            new: enquiries.filter(e => e.status === enquiry_entity_1.EnquiryStatus.NEW),
            processing: enquiries.filter(e => e.status === enquiry_entity_1.EnquiryStatus.PROCESSING),
            presentationSent: enquiries.filter(e => e.status === enquiry_entity_1.EnquiryStatus.PRESENTATION_SENT),
            quoted: enquiries.filter(e => e.status === enquiry_entity_1.EnquiryStatus.QUOTED),
            converted: enquiries.filter(e => e.status === enquiry_entity_1.EnquiryStatus.CONVERTED),
            lost: enquiries.filter(e => e.status === enquiry_entity_1.EnquiryStatus.LOST),
            onHold: enquiries.filter(e => e.status === enquiry_entity_1.EnquiryStatus.ON_HOLD),
        };
        return pipeline;
    }
    async getContactWithHistory(contactId, organizationId) {
        const contact = await this.contactRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(contactId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        if (!contact) {
            throw new common_1.NotFoundException('Contact not found');
        }
        const [enquiries, presentations, quotations, orders] = await Promise.all([
            this.enquiryRepository.find({ where: { clientId: contactId } }),
            this.presentationRepository.find({ where: { contactId } }),
            this.quotationRepository.find({ where: { contactId } }),
            this.orderRepository.find({ where: { contactId: new mongodb_1.ObjectId(contactId) } }),
        ]);
        return {
            contact,
            history: {
                enquiries,
                presentations,
                quotations,
                orders,
            },
            stats: {
                totalEnquiries: enquiries.length,
                totalQuotations: quotations.length,
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
            }
        };
    }
    async createEnquiryFromContact(contactId, enquiryData, organizationId) {
        const contact = await this.contactRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(contactId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        if (!contact) {
            throw new common_1.NotFoundException('Contact not found');
        }
        const enquiryNumber = `ENQ-${Date.now()}`;
        const enquiry = this.enquiryRepository.create({
            enquiryNumber,
            clientId: contactId,
            customerName: `${contact.firstName} ${contact.lastName}`,
            customerEmail: contact.email,
            customerPhone: contact.phone,
            company: contact.company,
            items: enquiryData.items || [],
            source: enquiryData.source || 'manual',
            status: enquiry_entity_1.EnquiryStatus.NEW,
            message: enquiryData.message,
            organizationId,
            assignedToId: contact.assignedToId?.toString(),
            createdAt: new Date(),
        });
        return this.enquiryRepository.save(enquiry);
    }
    async markEnquiryLost(enquiryId, reason, organizationId) {
        const enquiry = await this.enquiryRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(enquiryId), organizationId }
        });
        if (!enquiry) {
            throw new common_1.NotFoundException('Enquiry not found');
        }
        enquiry.status = enquiry_entity_1.EnquiryStatus.LOST;
        enquiry.lostReason = reason;
        enquiry.updatedAt = new Date();
        return this.enquiryRepository.save(enquiry);
    }
    async markEnquiryOnHold(enquiryId, followUpDate, organizationId) {
        const enquiry = await this.enquiryRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(enquiryId), organizationId }
        });
        if (!enquiry) {
            throw new common_1.NotFoundException('Enquiry not found');
        }
        enquiry.status = enquiry_entity_1.EnquiryStatus.ON_HOLD;
        enquiry.followUpDate = followUpDate;
        enquiry.updatedAt = new Date();
        return this.enquiryRepository.save(enquiry);
    }
    async createPresentationFromEnquiry(enquiryId, presentationData, userId, organizationId) {
        const enquiry = await this.enquiryRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(enquiryId), organizationId }
        });
        if (!enquiry) {
            throw new common_1.NotFoundException('Enquiry not found');
        }
        const presentationNumber = `PRES-${Date.now()}`;
        const presentation = this.presentationRepository.create({
            presentationNumber,
            enquiryId,
            contactId: enquiry.clientId,
            clientId: enquiry.clientId,
            clientName: enquiry.customerName,
            title: presentationData.title || `Presentation for ${enquiry.customerName}`,
            slides: presentationData.slides || [],
            coverBackground: presentationData.coverBackground,
            overlayColor: presentationData.overlayColor,
            overlayTransparency: presentationData.overlayTransparency,
            textColor: presentationData.textColor,
            layoutImage: presentationData.layoutImage,
            status: presentation_entity_1.PresentationStatus.DRAFT,
            organizationId,
            createdBy: userId,
            createdAt: new Date(),
        });
        const savedPresentation = await this.presentationRepository.save(presentation);
        enquiry.presentationId = savedPresentation._id.toString();
        enquiry.status = enquiry_entity_1.EnquiryStatus.PRESENTATION_SENT;
        enquiry.updatedAt = new Date();
        await this.enquiryRepository.save(enquiry);
        return savedPresentation;
    }
    async sendPresentation(presentationId, organizationId) {
        const presentation = await this.presentationRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(presentationId), organizationId }
        });
        if (!presentation) {
            throw new common_1.NotFoundException('Presentation not found');
        }
        presentation.status = presentation_entity_1.PresentationStatus.SENT_TO_CLIENT;
        presentation.sentAt = new Date();
        presentation.updatedAt = new Date();
        return this.presentationRepository.save(presentation);
    }
    async createQuotationFromEnquiry(enquiryId, quotationData, organizationId) {
        const enquiry = await this.enquiryRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(enquiryId), organizationId }
        });
        if (!enquiry) {
            throw new common_1.NotFoundException('Enquiry not found');
        }
        const quotationNumber = `QUO-${Date.now()}`;
        const quotation = this.quotationRepository.create({
            quotationNumber,
            enquiryId,
            presentationId: enquiry.presentationId,
            contactId: enquiry.clientId,
            clientId: enquiry.clientId,
            clientName: enquiry.customerName,
            clientEmail: enquiry.customerEmail,
            items: quotationData.items || enquiry.items,
            subtotal: quotationData.subtotal,
            taxTotal: quotationData.taxTotal || 0,
            discountTotal: quotationData.discountTotal || 0,
            grandTotal: quotationData.grandTotal,
            currency: quotationData.currency || 'INR',
            status: quotation_entity_1.QuotationStatus.DRAFT,
            notes: quotationData.notes,
            terms: quotationData.terms,
            validUntil: quotationData.validUntil,
            organizationId,
            createdAt: new Date(),
        });
        const savedQuotation = await this.quotationRepository.save(quotation);
        enquiry.quotationId = savedQuotation._id.toString();
        enquiry.status = enquiry_entity_1.EnquiryStatus.QUOTED;
        enquiry.updatedAt = new Date();
        await this.enquiryRepository.save(enquiry);
        return savedQuotation;
    }
    async acceptQuotation(quotationId, organizationId) {
        const quotation = await this.quotationRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(quotationId), organizationId }
        });
        if (!quotation) {
            throw new common_1.NotFoundException('Quotation not found');
        }
        quotation.status = quotation_entity_1.QuotationStatus.ACCEPTED;
        quotation.updatedAt = new Date();
        await this.quotationRepository.save(quotation);
        const order = await this.createOrderFromQuotation(quotationId, organizationId);
        if (quotation.enquiryId) {
            await this.enquiryRepository.updateOne({ _id: new mongodb_1.ObjectId(quotation.enquiryId) }, { $set: { status: enquiry_entity_1.EnquiryStatus.CONVERTED, updatedAt: new Date() } });
        }
        return { quotation, order };
    }
    async declineQuotation(quotationId, reason, organizationId) {
        const quotation = await this.quotationRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(quotationId), organizationId }
        });
        if (!quotation) {
            throw new common_1.NotFoundException('Quotation not found');
        }
        quotation.status = quotation_entity_1.QuotationStatus.DECLINED;
        quotation.declineReason = reason;
        quotation.updatedAt = new Date();
        await this.quotationRepository.save(quotation);
        if (quotation.enquiryId) {
            await this.enquiryRepository.updateOne({ _id: new mongodb_1.ObjectId(quotation.enquiryId) }, { $set: { status: enquiry_entity_1.EnquiryStatus.LOST, lostReason: reason, updatedAt: new Date() } });
        }
        return quotation;
    }
    async createOrderFromQuotation(quotationId, organizationId) {
        const quotation = await this.quotationRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(quotationId), organizationId }
        });
        if (!quotation) {
            throw new common_1.NotFoundException('Quotation not found');
        }
        if (quotation.status !== quotation_entity_1.QuotationStatus.ACCEPTED) {
            throw new common_1.BadRequestException('Quotation must be accepted before creating order');
        }
        const orderNumber = `ORD-${Date.now()}`;
        const order = this.orderRepository.create({
            orderNumber,
            quotationId: new mongodb_1.ObjectId(quotationId),
            contactId: new mongodb_1.ObjectId(quotation.contactId),
            enquiryId: quotation.enquiryId ? new mongodb_1.ObjectId(quotation.enquiryId) : undefined,
            clientName: quotation.clientName,
            clientEmail: quotation.clientEmail,
            items: quotation.items,
            subtotal: quotation.subtotal,
            taxTotal: quotation.taxTotal,
            discountTotal: quotation.discountTotal,
            totalAmount: quotation.grandTotal,
            currency: quotation.currency,
            status: order_entity_1.OrderStatus.PENDING,
            paymentStatus: order_entity_1.PaymentStatus.PENDING,
            deliveryStatus: order_entity_1.DeliveryStatus.PENDING,
            organizationId,
            notes: quotation.notes,
            createdAt: new Date(),
        });
        return this.orderRepository.save(order);
    }
    async updateOrderPaymentStatus(orderId, paymentStatus, organizationId) {
        const order = await this.orderRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(orderId), organizationId }
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        order.paymentStatus = paymentStatus;
        order.updatedAt = new Date();
        return this.orderRepository.save(order);
    }
    async updateOrderDeliveryStatus(orderId, deliveryStatus, organizationId) {
        const order = await this.orderRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(orderId), organizationId }
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        order.deliveryStatus = deliveryStatus;
        if (deliveryStatus === order_entity_1.DeliveryStatus.DELIVERED) {
            order.deliveredAt = new Date();
            order.status = order_entity_1.OrderStatus.COMPLETED;
        }
        order.updatedAt = new Date();
        return this.orderRepository.save(order);
    }
    async getEnquiries(organizationId) {
        return this.enquiryRepository.find({ where: { organizationId }, order: { createdAt: -1 } });
    }
    async getPresentations(organizationId) {
        return this.presentationRepository.find({ where: { organizationId }, order: { createdAt: -1 } });
    }
    async getQuotations(organizationId) {
        return this.quotationRepository.find({ where: { organizationId }, order: { createdAt: -1 } });
    }
    async getOrders(organizationId) {
        return this.orderRepository.find({ where: { organizationId }, order: { createdAt: -1 } });
    }
};
exports.CrmFunnelService = CrmFunnelService;
exports.CrmFunnelService = CrmFunnelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_request_entity_1.ClientRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __param(2, (0, typeorm_1.InjectRepository)(enquiry_entity_1.Enquiry)),
    __param(3, (0, typeorm_1.InjectRepository)(presentation_entity_1.Presentation)),
    __param(4, (0, typeorm_1.InjectRepository)(quotation_entity_1.Quotation)),
    __param(5, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(6, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(7, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], CrmFunnelService);
//# sourceMappingURL=crm-funnel.service.js.map