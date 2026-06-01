import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export interface QuotationItemVariant {
    typeName: string;       // e.g. "material", "size", "color"
    variantName: string;    // e.g. "Walnut Finish"
    variantId: string;      // MongoDB _id of the variant
    sku: string;            // Variant SKU code e.g. "BR_RAC_580_WN"
}

export interface QuotationItem {
    productId?: string; // Optional if ad-hoc item
    productName: string;
    designerName?: string; // Designer/creator of the product
    variationId?: string; // Product variation ID (legacy single-variant field)
    variationName?: string; // Variation name (e.g., "White Marble with Brass")
    selectedVariants?: QuotationItemVariant[]; // Multi-variant selection from website cart
    quantity: number;
    originalPrice: number; // Original product/variation price
    unitPrice: number; // Custom/revised price
    total: number;
    description?: string;
}

export enum QuotationStatus {
    DRAFT = 'draft',
    PENDING_APPROVAL = 'pending_approval',
    APPROVED = 'approved',
    SENT = 'sent',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    EXPIRED = 'expired'
}

@Entity('quotations')
export class Quotation {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    quotationNumber: string;

    @Column()
    clientId: string;

    @Column({ nullable: true })
    enquiryId?: string;

    @Column({ nullable: true })
    presentationId?: string;

    @Column({ nullable: true })
    contactId?: string;

    @Column({ nullable: true })
    clientName?: string; // Snapshot or ad-hoc client name

    @Column({ nullable: true })
    clientEmail?: string;

    @Column({ nullable: true })
    declineReason?: string;

    @Column('array')
    items: QuotationItem[];
    // ... (rest omitted, I need to match chunks)

    @Column({ type: 'double' })
    subtotal: number;

    @Column({ type: 'double', default: 0 })
    taxTotal: number;

    @Column({ type: 'double', default: 0 })
    discountTotal: number;

    @Column({ type: 'json', nullable: true })
    discount?: {
        type: 'fixed' | 'percentage';
        value: number;
    };

    @Column({ type: 'double' })
    grandTotal: number;

    @Column()
    currency: string;

    @Column({ type: 'enum', enum: QuotationStatus, default: QuotationStatus.DRAFT })
    status: QuotationStatus;

    @Column({ nullable: true })
    approvedBy?: string;

    @Column({ nullable: true })
    approvedAt?: Date;

    @Column({ nullable: true })
    sentAt?: Date;

    @Column({ nullable: true })
    sentVia?: 'email' | 'whatsapp';

    @Column()
    organizationId: string;

    @Column({ nullable: true })
    notes?: string;

    @Column({ nullable: true })
    terms?: string;

    @Column({ nullable: true })
    validUntil: Date;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @Column({ nullable: true })
    createdBy: string;

    @Column({ default: false })
    isDeleted: boolean;

    @Column({ nullable: true })
    deletedAt: Date;

    @Column({ nullable: true })
    deletedBy: string;

    @Column({ type: 'json', default: [] })
    changeLog: Array<{
        userId: string;
        action: string;
        timestamp: Date;
        details?: string;
    }>;

    constructor() {
        this.items = [];
        this.status = QuotationStatus.DRAFT;
        this.currency = 'INR';
        this.createdAt = new Date();
    }
}
