import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

export enum PresentationStatus {
    DRAFT = 'draft',
    COMPLETED = 'completed'
}

export interface PresentationSlide {
    slideNumber: number;
    productIds: string[];
    layout: 'single' | 'multiple';
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

    @Column()
    title: string;

    @Column({ nullable: true })
    coverBackground?: string;

    @Column({ nullable: true })
    overlayColor?: string;

    @Column({ nullable: true })
    overlayTransparency?: number;

    @Column({ nullable: true })
    textColor?: string;

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
}
