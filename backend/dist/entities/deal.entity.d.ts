import { ObjectId } from 'mongodb';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Contact } from './contact.entity';
import { Lead } from './lead.entity';
export declare class Deal {
    _id: ObjectId;
    title: string;
    description: string;
    value: number;
    stage: string;
    probability: number;
    expectedCloseDate: Date;
    actualCloseDate: Date;
    contact: Contact;
    contactId: ObjectId;
    lead: Lead;
    leadId: ObjectId;
    organization: Organization;
    organizationId: ObjectId;
    assignedTo: User;
    assignedToId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
