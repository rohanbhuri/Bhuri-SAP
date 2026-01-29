import { ObjectId } from 'mongodb';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Contact } from './contact.entity';
import { Lead } from './lead.entity';
import { Deal } from './deal.entity';
export declare class Task {
    _id: ObjectId;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: Date;
    reminderDate: Date;
    type: string;
    contact: Contact;
    contactId: ObjectId;
    lead: Lead;
    leadId: ObjectId;
    deal: Deal;
    dealId: ObjectId;
    organization: Organization;
    organizationId: ObjectId;
    assignedTo: User;
    assignedToId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
