import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

export enum PresentationStatus {
    DRAFT = 'draft',
    FINAL = 'final',
    SENT_TO_CLIENT = 'sent_to_client'
}

export interface PresentationSlideProduct {
    productId: string;
    designerName?: string;  // Designer/creator of the product
    variantId?: string;     // If a specific variant is being presented
    variantName?: string;   // e.g. "Walnut Finish"
    sku?: string;           // Variant SKU
}

export interface PresentationSlide {
    slideNumber: number;
    productIds: string[];   // Kept for backward compatibility
    products?: PresentationSlideProduct[]; // Detailed product+variant info
    layout: 'single' | 'multiple';
    slideTitle?: string;
}

@Entity('presentations')
export class Presentation {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    presentationNumber: string;

    @Column()
    clientId: string;

    @Column()
    clientName: string;

    @Column({ nullable: true })
    enquiryId?: string;

    @Column({ nullable: true })
    contactId?: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    sentAt?: Date;

    @Column({ nullable: true })
    viewedAt?: Date;

    @Column({ nullable: true })
    coverBackground?: string;

    @Column({ nullable: true })
    overlayColor?: string;

    @Column({ nullable: true })
    overlayTransparency?: number;

    @Column({ nullable: true })
    textColor?: string;

    @Column({ nullable: true })
    layoutImage?: string;

    @Column({ nullable: true })
    quotationId?: string;

    @Column()
    organizationId: string;

    @Column()
    slides: PresentationSlide[];

    @Column({ default: PresentationStatus.DRAFT })
    status: PresentationStatus;

    @Column()
    createdBy: string;

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
}
