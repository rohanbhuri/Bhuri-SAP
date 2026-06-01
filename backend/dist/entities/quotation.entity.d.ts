import { ObjectId } from 'typeorm';
export interface QuotationItemVariant {
    typeName: string;
    variantName: string;
    variantId: string;
    sku: string;
}
export interface QuotationItem {
    productId?: string;
    productName: string;
    designerName?: string;
    variationId?: string;
    variationName?: string;
    selectedVariants?: QuotationItemVariant[];
    quantity: number;
    originalPrice: number;
    unitPrice: number;
    total: number;
    description?: string;
}
export declare enum QuotationStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    SENT = "sent",
    ACCEPTED = "accepted",
    DECLINED = "declined",
    EXPIRED = "expired"
}
export declare class Quotation {
    _id: ObjectId;
    quotationNumber: string;
    clientId: string;
    enquiryId?: string;
    presentationId?: string;
    contactId?: string;
    clientName?: string;
    clientEmail?: string;
    declineReason?: string;
    items: QuotationItem[];
    subtotal: number;
    taxTotal: number;
    discountTotal: number;
    discount?: {
        type: 'fixed' | 'percentage';
        value: number;
    };
    grandTotal: number;
    currency: string;
    status: QuotationStatus;
    approvedBy?: string;
    approvedAt?: Date;
    sentAt?: Date;
    sentVia?: 'email' | 'whatsapp';
    organizationId: string;
    notes?: string;
    terms?: string;
    validUntil: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
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
