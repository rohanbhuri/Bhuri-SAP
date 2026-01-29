import { ObjectId } from 'typeorm';
export declare class Message {
    _id: ObjectId;
    conversationId: ObjectId;
    organizationId: ObjectId;
    senderId: ObjectId;
    content: string;
    readBy: ObjectId[];
    reactions?: {
        userId: ObjectId;
        emoji: string;
        createdAt: Date;
    }[];
    createdAt: Date;
    constructor();
}
