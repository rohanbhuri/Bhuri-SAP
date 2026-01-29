"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const contact_entity_1 = require("../entities/contact.entity");
const lead_entity_1 = require("../entities/lead.entity");
const deal_entity_1 = require("../entities/deal.entity");
const task_entity_1 = require("../entities/task.entity");
const user_entity_1 = require("../entities/user.entity");
let CrmService = class CrmService {
    constructor(contactRepository, leadRepository, dealRepository, taskRepository, userRepository) {
        this.contactRepository = contactRepository;
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }
    async getContacts(organizationId) {
        const contacts = await this.contactRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        for (const contact of contacts) {
            if (contact.assignedToId) {
                const user = await this.userRepository.findOne({
                    where: { _id: contact.assignedToId },
                    select: ['_id', 'firstName', 'lastName', 'email']
                });
                if (user) {
                    contact.assignedTo = user;
                }
            }
        }
        return contacts;
    }
    async createContact(contactData, organizationId) {
        const contact = this.contactRepository.create({
            ...contactData,
            organizationId: new mongodb_1.ObjectId(organizationId),
            assignedToId: contactData.assignedToId ? new mongodb_1.ObjectId(contactData.assignedToId) : null
        });
        return this.contactRepository.save(contact);
    }
    async getLeads(organizationId) {
        const leads = await this.leadRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        for (const lead of leads) {
            if (lead.assignedToId) {
                const user = await this.userRepository.findOne({
                    where: { _id: lead.assignedToId },
                    select: ['_id', 'firstName', 'lastName', 'email']
                });
                if (user) {
                    lead.assignedTo = user;
                }
            }
        }
        return leads;
    }
    async createLead(leadData, organizationId) {
        let assignedToId = leadData.assignedToId ? new mongodb_1.ObjectId(leadData.assignedToId) : null;
        if (leadData.contactId && !assignedToId) {
            const contact = await this.contactRepository.findOne({
                where: { _id: new mongodb_1.ObjectId(leadData.contactId) }
            });
            if (contact?.assignedToId) {
                assignedToId = contact.assignedToId;
            }
        }
        const lead = this.leadRepository.create({
            ...leadData,
            organizationId: new mongodb_1.ObjectId(organizationId),
            contactId: leadData.contactId ? new mongodb_1.ObjectId(leadData.contactId) : null,
            assignedToId
        });
        return this.leadRepository.save(lead);
    }
    async getDeals(organizationId) {
        const deals = await this.dealRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        for (const deal of deals) {
            if (deal.assignedToId) {
                const user = await this.userRepository.findOne({
                    where: { _id: deal.assignedToId },
                    select: ['_id', 'firstName', 'lastName', 'email']
                });
                if (user) {
                    deal.assignedTo = user;
                }
            }
        }
        return deals;
    }
    async createDeal(dealData, organizationId) {
        let contactId = null;
        let assignedToId = dealData.assignedToId ? new mongodb_1.ObjectId(dealData.assignedToId) : null;
        if (dealData.leadId) {
            const lead = await this.leadRepository.findOne({
                where: { _id: new mongodb_1.ObjectId(dealData.leadId), organizationId: new mongodb_1.ObjectId(organizationId) }
            });
            if (lead) {
                contactId = lead.contactId;
                if (!assignedToId && lead.assignedToId) {
                    assignedToId = lead.assignedToId;
                }
                await this.leadRepository.updateOne({ _id: new mongodb_1.ObjectId(dealData.leadId) }, { $set: { status: 'converted' } });
            }
        }
        const deal = this.dealRepository.create({
            ...dealData,
            organizationId: new mongodb_1.ObjectId(organizationId),
            leadId: dealData.leadId ? new mongodb_1.ObjectId(dealData.leadId) : null,
            contactId: contactId,
            assignedToId
        });
        return this.dealRepository.save(deal);
    }
    async getTasks(organizationId) {
        return this.taskRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async createTask(taskData, organizationId) {
        let assignedToId = taskData.assignedToId ? new mongodb_1.ObjectId(taskData.assignedToId) : null;
        if (!assignedToId) {
            if (taskData.dealId) {
                const deal = await this.dealRepository.findOne({
                    where: { _id: new mongodb_1.ObjectId(taskData.dealId) }
                });
                if (deal?.assignedToId)
                    assignedToId = deal.assignedToId;
            }
            else if (taskData.leadId) {
                const lead = await this.leadRepository.findOne({
                    where: { _id: new mongodb_1.ObjectId(taskData.leadId) }
                });
                if (lead?.assignedToId)
                    assignedToId = lead.assignedToId;
            }
            else if (taskData.contactId) {
                const contact = await this.contactRepository.findOne({
                    where: { _id: new mongodb_1.ObjectId(taskData.contactId) }
                });
                if (contact?.assignedToId)
                    assignedToId = contact.assignedToId;
            }
        }
        const task = this.taskRepository.create({
            ...taskData,
            organizationId: new mongodb_1.ObjectId(organizationId),
            contactId: taskData.contactId ? new mongodb_1.ObjectId(taskData.contactId) : null,
            leadId: taskData.leadId ? new mongodb_1.ObjectId(taskData.leadId) : null,
            dealId: taskData.dealId ? new mongodb_1.ObjectId(taskData.dealId) : null,
            assignedToId
        });
        return this.taskRepository.save(task);
    }
    async convertContactToLead(contactId, leadData, organizationId) {
        const contact = await this.contactRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(contactId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        if (!contact) {
            throw new Error('Contact not found');
        }
        const lead = this.leadRepository.create({
            ...leadData,
            contactId: new mongodb_1.ObjectId(contactId),
            organizationId: new mongodb_1.ObjectId(organizationId),
            status: 'new',
            assignedToId: contact.assignedToId
        });
        return this.leadRepository.save(lead);
    }
    async convertLeadToDeal(leadId, dealData, organizationId) {
        const lead = await this.leadRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(leadId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        if (!lead) {
            throw new Error('Lead not found');
        }
        await this.leadRepository.updateOne({ _id: new mongodb_1.ObjectId(leadId) }, { $set: { status: 'converted' } });
        const deal = this.dealRepository.create({
            ...dealData,
            leadId: new mongodb_1.ObjectId(leadId),
            contactId: lead.contactId,
            organizationId: new mongodb_1.ObjectId(organizationId),
            stage: 'prospecting',
            assignedToId: lead.assignedToId
        });
        return this.dealRepository.save(deal);
    }
    async createTaskForDeal(dealId, taskData, organizationId) {
        const deal = await this.dealRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(dealId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        if (!deal) {
            throw new Error('Deal not found');
        }
        const task = this.taskRepository.create({
            ...taskData,
            dealId: new mongodb_1.ObjectId(dealId),
            leadId: deal.leadId,
            contactId: deal.contactId,
            organizationId: new mongodb_1.ObjectId(organizationId),
            status: 'pending',
            assignedToId: deal.assignedToId
        });
        return this.taskRepository.save(task);
    }
    async getContactsWithLeads(organizationId) {
        return this.contactRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) },
            relations: ['leads']
        });
    }
    async getLeadsWithDeals(organizationId) {
        return this.leadRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) },
            relations: ['contact']
        });
    }
    async getDealsWithTasks(organizationId) {
        return this.dealRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) },
            relations: ['contact', 'lead']
        });
    }
    async getTasksWithRelations(organizationId) {
        return this.taskRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) },
            relations: ['contact', 'lead', 'deal']
        });
    }
    async getConversionReport(organizationId) {
        const orgId = new mongodb_1.ObjectId(organizationId);
        const [contacts, leads, deals] = await Promise.all([
            this.contactRepository.find({ where: { organizationId: orgId } }),
            this.leadRepository.find({ where: { organizationId: orgId } }),
            this.dealRepository.find({ where: { organizationId: orgId } })
        ]);
        const totalContacts = contacts.length;
        const totalLeads = leads.length;
        const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
        const totalDeals = deals.length;
        const wonDeals = deals.filter(deal => deal.stage === 'closed-won').length;
        const contactToLeadRate = totalContacts > 0 ? (totalLeads / totalContacts * 100) : 0;
        const leadToDealRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100) : 0;
        const dealWinRate = totalDeals > 0 ? (wonDeals / totalDeals * 100) : 0;
        return {
            totalContacts,
            totalLeads,
            convertedLeads,
            totalDeals,
            wonDeals,
            contactToLeadRate: Math.round(contactToLeadRate * 100) / 100,
            leadToDealRate: Math.round(leadToDealRate * 100) / 100,
            dealWinRate: Math.round(dealWinRate * 100) / 100
        };
    }
    async updateContact(id, contactData, organizationId) {
        const updateData = {
            ...contactData,
            assignedToId: contactData.assignedToId ? new mongodb_1.ObjectId(contactData.assignedToId) : null
        };
        await this.contactRepository.updateOne({ _id: new mongodb_1.ObjectId(id), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: updateData });
        return this.contactRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async deleteContact(id, organizationId) {
        return this.contactRepository.deleteOne({
            _id: new mongodb_1.ObjectId(id),
            organizationId: new mongodb_1.ObjectId(organizationId)
        });
    }
    async updateLead(id, leadData, organizationId) {
        const updateData = {
            ...leadData,
            contactId: leadData.contactId ? new mongodb_1.ObjectId(leadData.contactId) : null,
            assignedToId: leadData.assignedToId ? new mongodb_1.ObjectId(leadData.assignedToId) : null
        };
        await this.leadRepository.updateOne({ _id: new mongodb_1.ObjectId(id), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: updateData });
        return this.leadRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async deleteLead(id, organizationId) {
        return this.leadRepository.deleteOne({
            _id: new mongodb_1.ObjectId(id),
            organizationId: new mongodb_1.ObjectId(organizationId)
        });
    }
    async updateDeal(id, dealData, organizationId) {
        let updateData = { ...dealData };
        if (dealData.leadId) {
            const lead = await this.leadRepository.findOne({
                where: { _id: new mongodb_1.ObjectId(dealData.leadId), organizationId: new mongodb_1.ObjectId(organizationId) }
            });
            if (lead) {
                updateData.contactId = lead.contactId;
                updateData.leadId = new mongodb_1.ObjectId(dealData.leadId);
            }
        }
        else if (dealData.leadId === null || dealData.leadId === '') {
            updateData.leadId = null;
        }
        if (dealData.assignedToId) {
            updateData.assignedToId = new mongodb_1.ObjectId(dealData.assignedToId);
        }
        else if (dealData.assignedToId === null || dealData.assignedToId === '') {
            updateData.assignedToId = null;
        }
        await this.dealRepository.updateOne({ _id: new mongodb_1.ObjectId(id), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: updateData });
        return this.dealRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async deleteDeal(id, organizationId) {
        return this.dealRepository.deleteOne({
            _id: new mongodb_1.ObjectId(id),
            organizationId: new mongodb_1.ObjectId(organizationId)
        });
    }
    async updateTask(id, taskData, organizationId) {
        const updateData = {
            ...taskData,
            assignedToId: taskData.assignedToId ? new mongodb_1.ObjectId(taskData.assignedToId) : null,
            contactId: taskData.contactId ? new mongodb_1.ObjectId(taskData.contactId) : null,
            leadId: taskData.leadId ? new mongodb_1.ObjectId(taskData.leadId) : null,
            dealId: taskData.dealId ? new mongodb_1.ObjectId(taskData.dealId) : null
        };
        await this.taskRepository.updateOne({ _id: new mongodb_1.ObjectId(id), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: updateData });
        return this.taskRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async deleteTask(id, organizationId) {
        return this.taskRepository.deleteOne({
            _id: new mongodb_1.ObjectId(id),
            organizationId: new mongodb_1.ObjectId(organizationId)
        });
    }
    async getDashboardStats(organizationId) {
        const orgId = new mongodb_1.ObjectId(organizationId);
        const [contacts, leads, deals, tasks] = await Promise.all([
            this.contactRepository.find({ where: { organizationId: orgId } }),
            this.leadRepository.find({ where: { organizationId: orgId } }),
            this.dealRepository.find({ where: { organizationId: orgId } }),
            this.taskRepository.find({ where: { organizationId: orgId, status: 'pending' } })
        ]);
        const openDeals = deals.filter(deal => ['prospecting', 'qualification', 'proposal', 'negotiation'].includes(deal.stage));
        const pipelineValue = openDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
        return {
            contacts: contacts.length,
            leads: leads.length,
            deals: deals.length,
            pendingTasks: tasks.length,
            pipelineValue
        };
    }
    async getOrganizationUsers(organizationId) {
        return this.userRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId), isActive: true },
            select: ['_id', 'firstName', 'lastName', 'email']
        });
    }
    async assignContact(contactId, assignedToId, organizationId) {
        await this.contactRepository.updateOne({ _id: new mongodb_1.ObjectId(contactId), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: new mongodb_1.ObjectId(assignedToId) } });
        const contact = await this.contactRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(contactId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        if (contact && contact.assignedToId) {
            const user = await this.userRepository.findOne({
                where: { _id: contact.assignedToId },
                select: ['_id', 'firstName', 'lastName', 'email']
            });
            if (user) {
                contact.assignedTo = user;
            }
        }
        return contact;
    }
    async unassignContact(contactId, organizationId) {
        await this.contactRepository.updateOne({ _id: new mongodb_1.ObjectId(contactId), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: null } });
        const contact = await this.contactRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(contactId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        return contact;
    }
    async assignLead(leadId, assignedToId, organizationId) {
        await this.leadRepository.updateOne({ _id: new mongodb_1.ObjectId(leadId), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: new mongodb_1.ObjectId(assignedToId) } });
        return this.leadRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(leadId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async unassignLead(leadId, organizationId) {
        await this.leadRepository.updateOne({ _id: new mongodb_1.ObjectId(leadId), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: null } });
        return this.leadRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(leadId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async assignDeal(dealId, assignedToId, organizationId) {
        await this.dealRepository.updateOne({ _id: new mongodb_1.ObjectId(dealId), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: new mongodb_1.ObjectId(assignedToId) } });
        return this.dealRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(dealId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async unassignDeal(dealId, organizationId) {
        await this.dealRepository.updateOne({ _id: new mongodb_1.ObjectId(dealId), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: null } });
        return this.dealRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(dealId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async assignTask(taskId, assignedToId, organizationId) {
        await this.taskRepository.updateOne({ _id: new mongodb_1.ObjectId(taskId), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: new mongodb_1.ObjectId(assignedToId) } });
        return this.taskRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(taskId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async unassignTask(taskId, organizationId) {
        await this.taskRepository.updateOne({ _id: new mongodb_1.ObjectId(taskId), organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: null } });
        return this.taskRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(taskId), organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async getMyAssignments(userId, organizationId) {
        const userObjectId = new mongodb_1.ObjectId(userId);
        const orgObjectId = new mongodb_1.ObjectId(organizationId);
        const [contacts, leads, deals, tasks] = await Promise.all([
            this.contactRepository.find({
                where: { assignedToId: userObjectId, organizationId: orgObjectId }
            }),
            this.leadRepository.find({
                where: { assignedToId: userObjectId, organizationId: orgObjectId }
            }),
            this.dealRepository.find({
                where: { assignedToId: userObjectId, organizationId: orgObjectId }
            }),
            this.taskRepository.find({
                where: { assignedToId: userObjectId, organizationId: orgObjectId }
            })
        ]);
        return {
            contacts,
            leads,
            deals,
            tasks,
            summary: {
                totalContacts: contacts.length,
                totalLeads: leads.length,
                totalDeals: deals.length,
                totalTasks: tasks.length,
                pendingTasks: tasks.filter(t => t.status === 'pending').length,
                activePipeline: deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage)).length
            }
        };
    }
    async bulkAssignContacts(contactIds, assignedToId, organizationId) {
        const objectIds = contactIds.map(id => new mongodb_1.ObjectId(id));
        await this.contactRepository.updateMany({ _id: { $in: objectIds }, organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: new mongodb_1.ObjectId(assignedToId) } });
        return { success: true, updated: contactIds.length };
    }
    async bulkAssignLeads(leadIds, assignedToId, organizationId) {
        const objectIds = leadIds.map(id => new mongodb_1.ObjectId(id));
        await this.leadRepository.updateMany({ _id: { $in: objectIds }, organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: new mongodb_1.ObjectId(assignedToId) } });
        return { success: true, updated: leadIds.length };
    }
    async bulkAssignDeals(dealIds, assignedToId, organizationId) {
        const objectIds = dealIds.map(id => new mongodb_1.ObjectId(id));
        await this.dealRepository.updateMany({ _id: { $in: objectIds }, organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: new mongodb_1.ObjectId(assignedToId) } });
        return { success: true, updated: dealIds.length };
    }
    async bulkAssignTasks(taskIds, assignedToId, organizationId) {
        const objectIds = taskIds.map(id => new mongodb_1.ObjectId(id));
        await this.taskRepository.updateMany({ _id: { $in: objectIds }, organizationId: new mongodb_1.ObjectId(organizationId) }, { $set: { assignedToId: new mongodb_1.ObjectId(assignedToId) } });
        return { success: true, updated: taskIds.length };
    }
};
exports.CrmService = CrmService;
exports.CrmService = CrmService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __param(1, (0, typeorm_1.InjectRepository)(lead_entity_1.Lead)),
    __param(2, (0, typeorm_1.InjectRepository)(deal_entity_1.Deal)),
    __param(3, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], CrmService);
//# sourceMappingURL=crm.service.js.map