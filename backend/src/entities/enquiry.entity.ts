import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export interface EnquiryItemVariant {
    typeName: string;       // e.g. "material", "size", "color"
    variantName: string;    // e.g. "Walnut Finish"
    variantId: string;      // MongoDB _id of the variant
    sku: string;            // Variant SKU code e.g. "BR_RAC_580_WN"
}

export interface EnquiryItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice?: number;
    specifications?: string;
    selectedVariants?: EnquiryItemVariant[];
}

export enum EnquiryStatus {
    NEW = 'new',
    PROCESSING = 'processing',
    PRESENTATION_SENT = 'presentation_sent',
    QUOTED = 'quoted',
    CONVERTED = 'converted',
    LOST = 'lost',
    ON_HOLD = 'on_hold',
    CLOSED = 'closed'
}

export enum EnquirySource {
    WEBSITE = 'website',
    EMAIL = 'email',
    PHONE = 'phone',
    WALK_IN = 'walk_in',
    REFERRAL = 'referral'
}

@Entity('enquiries')
export class Enquiry {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    enquiryNumber: string;

    @Column()
    clientId: string;

    @Column()
    customerName: string;

    @Column()
    customerEmail: string;

    @Column({ nullable: true })
    customerPhone?: string;

    @Column({ nullable: true })
    company?: string;

    @Column('array')
    items: EnquiryItem[];

    @Column({ type: 'enum', enum: EnquirySource, default: EnquirySource.WEBSITE })
    source: EnquirySource;

    @Column({ type: 'enum', enum: EnquiryStatus, default: EnquiryStatus.NEW })
    status: EnquiryStatus;

    @Column({ nullable: true })
    message?: string;

    @Column({ nullable: true })
    quotationId?: string;

    @Column({ nullable: true })
    presentationId?: string;

    @Column({ nullable: true })
    clientRequestId?: string;

    @Column({ nullable: true })
    assignedToId?: string;

    @Column({ nullable: true })
    lostReason?: string;

    @Column({ nullable: true })
    followUpDate?: Date;

    @Column({ nullable: true })
    leadId?: string;

    @Column()
    organizationId: string;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt?: Date;

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
        this.status = EnquiryStatus.NEW;
        this.source = EnquirySource.WEBSITE;
        this.createdAt = new Date();
    }
}