import { ObjectId } from 'mongodb';
export declare enum PresentationStatus {
    DRAFT = "draft",
    FINAL = "final",
    SENT_TO_CLIENT = "sent_to_client"
}
export interface PresentationSlide {
    slideNumber: number;
    productIds: string[];
    layout: 'single' | 'multiple';
    slideTitle?: string;
}
export declare class Presentation {
    _id: ObjectId;
    presentationNumber: string;
    clientId: string;
    clientName: string;
    enquiryId?: string;
    contactId?: string;
    title: string;
    sentAt?: Date;
    viewedAt?: Date;
    coverBackground?: string;
    overlayColor?: string;
    overlayTransparency?: number;
    textColor?: string;
    layoutImage?: string;
    quotationId?: string;
    organizationId: string;
    slides: PresentationSlide[];
    status: PresentationStatus;
    createdBy: string;
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
}
