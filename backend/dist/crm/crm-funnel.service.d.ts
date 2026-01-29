import { MongoRepository } from 'typeorm';
import { ClientRequest } from '../entities/client-request.entity';
import { Contact } from '../entities/contact.entity';
import { Enquiry } from '../entities/enquiry.entity';
import { Presentation } from '../entities/presentation.entity';
import { Quotation } from '../entities/quotation.entity';
import { Order, PaymentStatus, DeliveryStatus } from '../entities/order.entity';
import { Invoice } from '../entities/invoice.entity';
import { User } from '../entities/user.entity';
export declare class CrmFunnelService {
    private clientRequestRepository;
    private contactRepository;
    private enquiryRepository;
    private presentationRepository;
    private quotationRepository;
    private orderRepository;
    private invoiceRepository;
    private userRepository;
    constructor(clientRequestRepository: MongoRepository<ClientRequest>, contactRepository: MongoRepository<Contact>, enquiryRepository: MongoRepository<Enquiry>, presentationRepository: MongoRepository<Presentation>, quotationRepository: MongoRepository<Quotation>, orderRepository: MongoRepository<Order>, invoiceRepository: MongoRepository<Invoice>, userRepository: MongoRepository<User>);
    getFunnelDashboard(organizationId: string): Promise<{
        funnel: {
            requests: number;
            contacts: number;
            enquiries: number;
            presentations: number;
            quotations: number;
            orders: number;
        };
        active: {
            enquiries: number;
            quotations: number;
        };
        conversion: {
            requestToContact: string | number;
            contactToEnquiry: string | number;
            enquiryToQuotation: string | number;
            quotationToOrder: string | number;
        };
        revenue: {
            total: number;
            pipeline: number;
            won: number;
            lost: number;
        };
    }>;
    getPipeline(organizationId: string): Promise<{
        new: Enquiry[];
        processing: Enquiry[];
        presentationSent: Enquiry[];
        quoted: Enquiry[];
        converted: Enquiry[];
        lost: Enquiry[];
        onHold: Enquiry[];
    }>;
    getContactWithHistory(contactId: string, organizationId: string): Promise<{
        contact: Contact;
        history: {
            enquiries: Enquiry[];
            presentations: Presentation[];
            quotations: Quotation[];
            orders: Order[];
        };
        stats: {
            totalEnquiries: number;
            totalQuotations: number;
            totalOrders: number;
            totalRevenue: number;
        };
    }>;
    createEnquiryFromContact(contactId: string, enquiryData: any, organizationId: string): Promise<Enquiry>;
    markEnquiryLost(enquiryId: string, reason: string, organizationId: string): Promise<Enquiry>;
    markEnquiryOnHold(enquiryId: string, followUpDate: Date, organizationId: string): Promise<Enquiry>;
    createPresentationFromEnquiry(enquiryId: string, presentationData: any, userId: string, organizationId: string): Promise<Presentation>;
    sendPresentation(presentationId: string, organizationId: string): Promise<Presentation>;
    createQuotationFromEnquiry(enquiryId: string, quotationData: any, organizationId: string): Promise<Quotation>;
    acceptQuotation(quotationId: string, organizationId: string): Promise<{
        quotation: Quotation;
        order: Order;
    }>;
    declineQuotation(quotationId: string, reason: string, organizationId: string): Promise<Quotation>;
    createOrderFromQuotation(quotationId: string, organizationId: string): Promise<Order>;
    updateOrderPaymentStatus(orderId: string, paymentStatus: PaymentStatus, organizationId: string): Promise<Order>;
    updateOrderDeliveryStatus(orderId: string, deliveryStatus: DeliveryStatus, organizationId: string): Promise<Order>;
    getEnquiries(organizationId: string): Promise<Enquiry[]>;
    getPresentations(organizationId: string): Promise<Presentation[]>;
    getQuotations(organizationId: string): Promise<Quotation[]>;
    getOrders(organizationId: string): Promise<Order[]>;
}
