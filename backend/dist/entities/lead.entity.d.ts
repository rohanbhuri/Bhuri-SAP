import { ObjectId } from 'mongodb';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Contact } from './contact.entity';
export declare class Lead {
    _id: ObjectId;
    title: string;
    description: string;
    status: string;
    estimatedValue: number;
    source: string;
    expectedCloseDate: Date;
    contact: Contact;
    contactId: ObjectId;
    organization: Organization;
    organizationId: ObjectId;
    assignedTo: User;
    assignedToId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
