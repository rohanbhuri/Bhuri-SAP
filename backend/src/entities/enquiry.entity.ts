import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export interface EnquiryItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    specifications?: string;
}

export enum EnquiryStatus {
    NEW = 'new',
    PROCESSING = 'processing',
    QUOTED = 'quoted',
    CONVERTED = 'converted',
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
    leadId?: string;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    constructor() {
        this.items = [];
        this.status = EnquiryStatus.NEW;
        this.source = EnquirySource.WEBSITE;
        this.createdAt = new Date();
    }
}