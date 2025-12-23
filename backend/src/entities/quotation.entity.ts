import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export interface QuotationItem {
    productId?: string; // Optional if ad-hoc item
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    description?: string;
}

export enum QuotationStatus {
    DRAFT = 'draft',
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
    clientId?: string;

    @Column({ nullable: true })
    clientName?: string; // Snapshot or ad-hoc client name

    @Column({ nullable: true })
    clientEmail?: string;

    @Column('array')
    items: QuotationItem[];
    // ... (rest omitted, I need to match chunks)

    @Column({ type: 'double' })
    subtotal: number;

    @Column({ type: 'double', default: 0 })
    taxTotal: number;

    @Column({ type: 'double', default: 0 })
    discountTotal: number;

    @Column({ type: 'double' })
    grandTotal: number;

    @Column()
    currency: string;

    @Column({ type: 'enum', enum: QuotationStatus, default: QuotationStatus.DRAFT })
    status: QuotationStatus;

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

    constructor() {
        this.items = [];
        this.status = QuotationStatus.DRAFT;
        this.currency = 'USD';
        this.createdAt = new Date();
    }
}
