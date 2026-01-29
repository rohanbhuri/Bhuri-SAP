import { ObjectId } from 'typeorm';
export type ConversationType = 'dm' | 'group';
export declare class Conversation {
    _id: ObjectId;
    organizationId: ObjectId;
    type: ConversationType;
    memberIds: ObjectId[];
    name?: string;
    lastMessagePreview: {
        senderId: ObjectId;
        content: string;
        at: Date;
    }[];
    createdAt: Date;
    constructor();
}
