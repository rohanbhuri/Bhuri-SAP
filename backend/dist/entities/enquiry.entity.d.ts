import { ObjectId } from 'typeorm';
export interface EnquiryItemVariant {
    typeName: string;
    variantName: string;
    variantId: string;
    sku: string;
}
export interface EnquiryItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice?: number;
    specifications?: string;
    selectedVariants?: EnquiryItemVariant[];
}
export declare enum EnquiryStatus {
    NEW = "new",
    PROCESSING = "processing",
    PRESENTATION_SENT = "presentation_sent",
    QUOTED = "quoted",
    CONVERTED = "converted",
    LOST = "lost",
    ON_HOLD = "on_hold",
    CLOSED = "closed"
}
export declare enum EnquirySource {
    WEBSITE = "website",
    EMAIL = "email",
    PHONE = "phone",
    WALK_IN = "walk_in",
    REFERRAL = "referral"
}
export declare class Enquiry {
    _id: ObjectId;
    enquiryNumber: string;
    clientId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    company?: string;
    items: EnquiryItem[];
    source: EnquirySource;
    status: EnquiryStatus;
    message?: string;
    quotationId?: string;
    presentationId?: string;
    clientRequestId?: string;
    assignedToId?: string;
    lostReason?: string;
    followUpDate?: Date;
    leadId?: string;
    organizationId: string;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: string;
    changeLog: Array<{
        userId: string;
        action: string;
        timestamp: Date;
        details?: string;
    }>;
    constructor();
}
