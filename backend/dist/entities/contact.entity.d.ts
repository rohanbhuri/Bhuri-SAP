import { ObjectId } from 'mongodb';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Lead } from './lead.entity';
import { Deal } from './deal.entity';
import { Task } from './task.entity';
export declare class Contact {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    position: string;
    notes: string;
    status: string;
    customFields: Record<string, any>;
    clientRequestId?: ObjectId;
    source?: string;
    organization: Organization;
    organizationId: ObjectId;
    assignedTo: User;
    assignedToId: ObjectId;
    leads: Lead[];
    deals: Deal[];
    tasks: Task[];
    createdAt: Date;
    updatedAt: Date;
}
