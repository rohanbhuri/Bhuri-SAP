import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ClientRequest, ClientRequestStatus } from '../entities/client-request.entity';
import { Contact } from '../entities/contact.entity';
import { Enquiry, EnquiryStatus } from '../entities/enquiry.entity';
import { Presentation, PresentationStatus } from '../entities/presentation.entity';
import { Quotation, QuotationStatus } from '../entities/quotation.entity';
import { Order, OrderStatus, PaymentStatus, DeliveryStatus } from '../entities/order.entity';
import { Invoice } from '../entities/invoice.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CrmFunnelService {
  constructor(
    @InjectRepository(ClientRequest)
    private clientRequestRepository: MongoRepository<ClientRequest>,
    @InjectRepository(Contact)
    private contactRepository: MongoRepository<Contact>,
    @InjectRepository(Enquiry)
    private enquiryRepository: MongoRepository<Enquiry>,
    @InjectRepository(Presentation)
    private presentationRepository: MongoRepository<Presentation>,
    @InjectRepository(Quotation)
    private quotationRepository: MongoRepository<Quotation>,
    @InjectRepository(Order)
    private orderRepository: MongoRepository<Order>,
    @InjectRepository(Invoice)
    private invoiceRepository: MongoRepository<Invoice>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {}

  // ==================== DASHBOARD ====================
  async getFunnelDashboard(organizationId: string) {
    const orgId = new ObjectId(organizationId);

    const [requests, contacts, enquiries, presentations, quotations, orders] = await Promise.all([
      this.clientRequestRepository.find({ where: { status: ClientRequestStatus.PENDING } }),
      this.contactRepository.find({ where: { organizationId: orgId } }),
      this.enquiryRepository.find({ where: { organizationId } }),
      this.presentationRepository.find({ where: { organizationId } }),
      this.quotationRepository.find({ where: { organizationId } }),
      this.orderRepository.find({ where: { organizationId } }),
    ]);

    const activeEnquiries = enquiries.filter(e => 
      [EnquiryStatus.NEW, EnquiryStatus.PROCESSING, EnquiryStatus.PRESENTATION_SENT].includes(e.status as EnquiryStatus)
    );

    const activeQuotations = quotations.filter(q => 
      [QuotationStatus.DRAFT, QuotationStatus.SENT, QuotationStatus.PENDING_APPROVAL].includes(q.status)
    );

    const wonOrders = orders.filter(o => o.status === OrderStatus.COMPLETED);
    const lostEnquiries = enquiries.filter(e => e.status === EnquiryStatus.LOST);

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

  async getPipeline(organizationId: string) {
    const enquiries = await this.enquiryRepository.find({ where: { organizationId } });

    const pipeline = {
      new: enquiries.filter(e => e.status === EnquiryStatus.NEW),
      processing: enquiries.filter(e => e.status === EnquiryStatus.PROCESSING),
      presentationSent: enquiries.filter(e => e.status === EnquiryStatus.PRESENTATION_SENT),
      quoted: enquiries.filter(e => e.status === EnquiryStatus.QUOTED),
      converted: enquiries.filter(e => e.status === EnquiryStatus.CONVERTED),
      lost: enquiries.filter(e => e.status === EnquiryStatus.LOST),
      onHold: enquiries.filter(e => e.status === EnquiryStatus.ON_HOLD),
    };

    return pipeline;
  }

  // ==================== CONTACT MANAGEMENT ====================
  async getContactWithHistory(contactId: string, organizationId: string) {
    const contact = await this.contactRepository.findOne({
      where: { _id: new ObjectId(contactId), organizationId: new ObjectId(organizationId) }
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const [enquiries, presentations, quotations, orders] = await Promise.all([
      this.enquiryRepository.find({ where: { clientId: contactId } }),
      this.presentationRepository.find({ where: { contactId } }),
      this.quotationRepository.find({ where: { contactId } }),
      this.orderRepository.find({ where: { contactId: new ObjectId(contactId) } }),
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

  // ==================== ENQUIRY MANAGEMENT ====================
  async createEnquiryFromContact(contactId: string, enquiryData: any, organizationId: string) {
    const contact = await this.contactRepository.findOne({
      where: { _id: new ObjectId(contactId), organizationId: new ObjectId(organizationId) }
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
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
      status: EnquiryStatus.NEW,
      message: enquiryData.message,
      organizationId,
      assignedToId: contact.assignedToId?.toString(),
      createdAt: new Date(),
    });

    return this.enquiryRepository.save(enquiry);
  }

  async markEnquiryLost(enquiryId: string, reason: string, organizationId: string) {
    const enquiry = await this.enquiryRepository.findOne({
      where: { _id: new ObjectId(enquiryId), organizationId }
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    enquiry.status = EnquiryStatus.LOST;
    enquiry.lostReason = reason;
    enquiry.updatedAt = new Date();

    return this.enquiryRepository.save(enquiry);
  }

  async markEnquiryOnHold(enquiryId: string, followUpDate: Date, organizationId: string) {
    const enquiry = await this.enquiryRepository.findOne({
      where: { _id: new ObjectId(enquiryId), organizationId }
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    enquiry.status = EnquiryStatus.ON_HOLD;
    enquiry.followUpDate = followUpDate;
    enquiry.updatedAt = new Date();

    return this.enquiryRepository.save(enquiry);
  }

  // ==================== PRESENTATION MANAGEMENT ====================
  async createPresentationFromEnquiry(enquiryId: string, presentationData: any, userId: string, organizationId: string) {
    const enquiry = await this.enquiryRepository.findOne({
      where: { _id: new ObjectId(enquiryId), organizationId }
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
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
      status: PresentationStatus.DRAFT,
      organizationId,
      createdBy: userId,
      createdAt: new Date(),
    });

    const savedPresentation = await this.presentationRepository.save(presentation);

    // Update enquiry
    enquiry.presentationId = savedPresentation._id.toString();
    enquiry.status = EnquiryStatus.PRESENTATION_SENT;
    enquiry.updatedAt = new Date();
    await this.enquiryRepository.save(enquiry);

    return savedPresentation;
  }

  async sendPresentation(presentationId: string, organizationId: string) {
    const presentation = await this.presentationRepository.findOne({
      where: { _id: new ObjectId(presentationId), organizationId }
    });

    if (!presentation) {
      throw new NotFoundException('Presentation not found');
    }

    presentation.status = PresentationStatus.SENT_TO_CLIENT;
    presentation.sentAt = new Date();
    presentation.updatedAt = new Date();

    return this.presentationRepository.save(presentation);
  }

  // ==================== QUOTATION MANAGEMENT ====================
  async createQuotationFromEnquiry(enquiryId: string, quotationData: any, organizationId: string) {
    const enquiry = await this.enquiryRepository.findOne({
      where: { _id: new ObjectId(enquiryId), organizationId }
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
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
      currency: quotationData.currency || 'USD',
      status: QuotationStatus.DRAFT,
      notes: quotationData.notes,
      terms: quotationData.terms,
      validUntil: quotationData.validUntil,
      organizationId,
      createdAt: new Date(),
    });

    const savedQuotation = await this.quotationRepository.save(quotation);

    // Update enquiry
    enquiry.quotationId = savedQuotation._id.toString();
    enquiry.status = EnquiryStatus.QUOTED;
    enquiry.updatedAt = new Date();
    await this.enquiryRepository.save(enquiry);

    return savedQuotation;
  }

  async acceptQuotation(quotationId: string, organizationId: string) {
    const quotation = await this.quotationRepository.findOne({
      where: { _id: new ObjectId(quotationId), organizationId }
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    quotation.status = QuotationStatus.ACCEPTED;
    quotation.updatedAt = new Date();
    await this.quotationRepository.save(quotation);

    // Create order
    const order = await this.createOrderFromQuotation(quotationId, organizationId);

    // Update enquiry
    if (quotation.enquiryId) {
      await this.enquiryRepository.updateOne(
        { _id: new ObjectId(quotation.enquiryId) },
        { $set: { status: EnquiryStatus.CONVERTED, updatedAt: new Date() } }
      );
    }

    return { quotation, order };
  }

  async declineQuotation(quotationId: string, reason: string, organizationId: string) {
    const quotation = await this.quotationRepository.findOne({
      where: { _id: new ObjectId(quotationId), organizationId }
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    quotation.status = QuotationStatus.DECLINED;
    quotation.declineReason = reason;
    quotation.updatedAt = new Date();
    await this.quotationRepository.save(quotation);

    // Update enquiry
    if (quotation.enquiryId) {
      await this.enquiryRepository.updateOne(
        { _id: new ObjectId(quotation.enquiryId) },
        { $set: { status: EnquiryStatus.LOST, lostReason: reason, updatedAt: new Date() } }
      );
    }

    return quotation;
  }

  // ==================== ORDER MANAGEMENT ====================
  async createOrderFromQuotation(quotationId: string, organizationId: string) {
    const quotation = await this.quotationRepository.findOne({
      where: { _id: new ObjectId(quotationId), organizationId }
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    if (quotation.status !== QuotationStatus.ACCEPTED) {
      throw new BadRequestException('Quotation must be accepted before creating order');
    }

    const orderNumber = `ORD-${Date.now()}`;

    const order = this.orderRepository.create({
      orderNumber,
      quotationId: new ObjectId(quotationId),
      contactId: new ObjectId(quotation.contactId),
      enquiryId: quotation.enquiryId ? new ObjectId(quotation.enquiryId) : undefined,
      clientName: quotation.clientName,
      clientEmail: quotation.clientEmail,
      items: quotation.items,
      subtotal: quotation.subtotal,
      taxTotal: quotation.taxTotal,
      discountTotal: quotation.discountTotal,
      totalAmount: quotation.grandTotal,
      currency: quotation.currency,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      deliveryStatus: DeliveryStatus.PENDING,
      organizationId,
      notes: quotation.notes,
      createdAt: new Date(),
    });

    return this.orderRepository.save(order);
  }

  async updateOrderPaymentStatus(orderId: string, paymentStatus: PaymentStatus, organizationId: string) {
    const order = await this.orderRepository.findOne({
      where: { _id: new ObjectId(orderId), organizationId }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date();

    return this.orderRepository.save(order);
  }

  async updateOrderDeliveryStatus(orderId: string, deliveryStatus: DeliveryStatus, organizationId: string) {
    const order = await this.orderRepository.findOne({
      where: { _id: new ObjectId(orderId), organizationId }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.deliveryStatus = deliveryStatus;
    if (deliveryStatus === DeliveryStatus.DELIVERED) {
      order.deliveredAt = new Date();
      order.status = OrderStatus.COMPLETED;
    }
    order.updatedAt = new Date();

    return this.orderRepository.save(order);
  }

  // ==================== GENERIC CRUD ====================
  async getEnquiries(organizationId: string) {
    return this.enquiryRepository.find({ where: { organizationId }, order: { createdAt: -1 } });
  }

  async getPresentations(organizationId: string) {
    return this.presentationRepository.find({ where: { organizationId }, order: { createdAt: -1 } });
  }

  async getQuotations(organizationId: string) {
    return this.quotationRepository.find({ where: { organizationId }, order: { createdAt: -1 } });
  }

  async getOrders(organizationId: string) {
    return this.orderRepository.find({ where: { organizationId }, order: { createdAt: -1 } });
  }
}
