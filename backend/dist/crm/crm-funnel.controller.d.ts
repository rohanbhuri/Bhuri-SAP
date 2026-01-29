import { CrmFunnelService } from './crm-funnel.service';
import { PaymentStatus, DeliveryStatus } from '../entities/order.entity';
export declare class CrmFunnelController {
    private readonly crmFunnelService;
    constructor(crmFunnelService: CrmFunnelService);
    getFunnelDashboard(req: any): Promise<{
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
    getPipeline(req: any): Promise<{
        new: import("../entities/enquiry.entity").Enquiry[];
        processing: import("../entities/enquiry.entity").Enquiry[];
        presentationSent: import("../entities/enquiry.entity").Enquiry[];
        quoted: import("../entities/enquiry.entity").Enquiry[];
        converted: import("../entities/enquiry.entity").Enquiry[];
        lost: import("../entities/enquiry.entity").Enquiry[];
        onHold: import("../entities/enquiry.entity").Enquiry[];
    }>;
    getContactWithHistory(contactId: string, req: any): Promise<{
        contact: import("../entities/contact.entity").Contact;
        history: {
            enquiries: import("../entities/enquiry.entity").Enquiry[];
            presentations: import("../entities/presentation.entity").Presentation[];
            quotations: import("../entities/quotation.entity").Quotation[];
            orders: import("../entities/order.entity").Order[];
        };
        stats: {
            totalEnquiries: number;
            totalQuotations: number;
            totalOrders: number;
            totalRevenue: number;
        };
    }>;
    getEnquiries(req: any): Promise<import("../entities/enquiry.entity").Enquiry[]>;
    createEnquiryFromContact(contactId: string, enquiryData: any, req: any): Promise<import("../entities/enquiry.entity").Enquiry>;
    markEnquiryLost(enquiryId: string, body: {
        reason: string;
    }, req: any): Promise<import("../entities/enquiry.entity").Enquiry>;
    markEnquiryOnHold(enquiryId: string, body: {
        followUpDate: Date;
    }, req: any): Promise<import("../entities/enquiry.entity").Enquiry>;
    getPresentations(req: any): Promise<import("../entities/presentation.entity").Presentation[]>;
    createPresentationFromEnquiry(enquiryId: string, presentationData: any, req: any): Promise<import("../entities/presentation.entity").Presentation>;
    sendPresentation(presentationId: string, req: any): Promise<import("../entities/presentation.entity").Presentation>;
    getQuotations(req: any): Promise<import("../entities/quotation.entity").Quotation[]>;
    createQuotationFromEnquiry(enquiryId: string, quotationData: any, req: any): Promise<import("../entities/quotation.entity").Quotation>;
    acceptQuotation(quotationId: string, req: any): Promise<{
        quotation: import("../entities/quotation.entity").Quotation;
        order: import("../entities/order.entity").Order;
    }>;
    declineQuotation(quotationId: string, body: {
        reason: string;
    }, req: any): Promise<import("../entities/quotation.entity").Quotation>;
    getOrders(req: any): Promise<import("../entities/order.entity").Order[]>;
    createOrderFromQuotation(quotationId: string, req: any): Promise<import("../entities/order.entity").Order>;
    updateOrderPaymentStatus(orderId: string, body: {
        paymentStatus: PaymentStatus;
    }, req: any): Promise<import("../entities/order.entity").Order>;
    updateOrderDeliveryStatus(orderId: string, body: {
        deliveryStatus: DeliveryStatus;
    }, req: any): Promise<import("../entities/order.entity").Order>;
}
