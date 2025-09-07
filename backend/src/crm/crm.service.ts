import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Contact } from '../entities/contact.entity';
import { Lead } from '../entities/lead.entity';
import { Deal } from '../entities/deal.entity';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: MongoRepository<Contact>,
    @InjectRepository(Lead)
    private leadRepository: MongoRepository<Lead>,
    @InjectRepository(Deal)
    private dealRepository: MongoRepository<Deal>,
    @InjectRepository(Task)
    private taskRepository: MongoRepository<Task>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {}

  // Contact methods
  async getContacts(organizationId: string) {
    const contacts = await this.contactRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });
    
    // Populate assignedTo user data
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

  async createContact(contactData: any, organizationId: string) {
    const contact = this.contactRepository.create({
      ...contactData,
      organizationId: new ObjectId(organizationId),
      assignedToId: contactData.assignedToId ? new ObjectId(contactData.assignedToId) : null
    });
    return this.contactRepository.save(contact);
  }

  // Lead methods
  async getLeads(organizationId: string) {
    const leads = await this.leadRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });
    
    // Populate assignedTo user data
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

  async createLead(leadData: any, organizationId: string) {
    // If converting from contact, inherit assignment
    let assignedToId = leadData.assignedToId ? new ObjectId(leadData.assignedToId) : null;
    if (leadData.contactId && !assignedToId) {
      const contact = await this.contactRepository.findOne({
        where: { _id: new ObjectId(leadData.contactId) }
      });
      if (contact?.assignedToId) {
        assignedToId = contact.assignedToId;
      }
    }

    const lead = this.leadRepository.create({
      ...leadData,
      organizationId: new ObjectId(organizationId),
      contactId: leadData.contactId ? new ObjectId(leadData.contactId) : null,
      assignedToId
    });
    return this.leadRepository.save(lead);
  }

  // Deal methods
  async getDeals(organizationId: string) {
    const deals = await this.dealRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });
    
    // Populate assignedTo user data
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

  async createDeal(dealData: any, organizationId: string) {
    let contactId = null;
    let assignedToId = dealData.assignedToId ? new ObjectId(dealData.assignedToId) : null;
    
    // If leadId is provided, get the contactId and assignment from the lead
    if (dealData.leadId) {
      const lead = await this.leadRepository.findOne({
        where: { _id: new ObjectId(dealData.leadId), organizationId: new ObjectId(organizationId) }
      });
      if (lead) {
        contactId = lead.contactId;
        // Inherit assignment if not explicitly set
        if (!assignedToId && lead.assignedToId) {
          assignedToId = lead.assignedToId;
        }
        // Update lead status to converted
        await this.leadRepository.updateOne(
          { _id: new ObjectId(dealData.leadId) },
          { $set: { status: 'converted' } }
        );
      }
    }

    const deal = this.dealRepository.create({
      ...dealData,
      organizationId: new ObjectId(organizationId),
      leadId: dealData.leadId ? new ObjectId(dealData.leadId) : null,
      contactId: contactId,
      assignedToId
    });
    return this.dealRepository.save(deal);
  }

  // Task methods
  async getTasks(organizationId: string) {
    return this.taskRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });
  }

  async createTask(taskData: any, organizationId: string) {
    let assignedToId = taskData.assignedToId ? new ObjectId(taskData.assignedToId) : null;
    
    // Inherit assignment from related entities if not explicitly set
    if (!assignedToId) {
      if (taskData.dealId) {
        const deal = await this.dealRepository.findOne({
          where: { _id: new ObjectId(taskData.dealId) }
        });
        if (deal?.assignedToId) assignedToId = deal.assignedToId;
      } else if (taskData.leadId) {
        const lead = await this.leadRepository.findOne({
          where: { _id: new ObjectId(taskData.leadId) }
        });
        if (lead?.assignedToId) assignedToId = lead.assignedToId;
      } else if (taskData.contactId) {
        const contact = await this.contactRepository.findOne({
          where: { _id: new ObjectId(taskData.contactId) }
        });
        if (contact?.assignedToId) assignedToId = contact.assignedToId;
      }
    }

    const task = this.taskRepository.create({
      ...taskData,
      organizationId: new ObjectId(organizationId),
      contactId: taskData.contactId ? new ObjectId(taskData.contactId) : null,
      leadId: taskData.leadId ? new ObjectId(taskData.leadId) : null,
      dealId: taskData.dealId ? new ObjectId(taskData.dealId) : null,
      assignedToId
    });
    return this.taskRepository.save(task);
  }

  // Conversion methods - enforcing proper CRM flow
  async convertContactToLead(contactId: string, leadData: any, organizationId: string) {
    const contact = await this.contactRepository.findOne({
      where: { _id: new ObjectId(contactId), organizationId: new ObjectId(organizationId) }
    });
    
    if (!contact) {
      throw new Error('Contact not found');
    }

    const lead = this.leadRepository.create({
      ...leadData,
      contactId: new ObjectId(contactId),
      organizationId: new ObjectId(organizationId),
      status: 'new',
      // Inherit assignment from contact
      assignedToId: contact.assignedToId
    });
    
    return this.leadRepository.save(lead);
  }

  async convertLeadToDeal(leadId: string, dealData: any, organizationId: string) {
    const lead = await this.leadRepository.findOne({
      where: { _id: new ObjectId(leadId), organizationId: new ObjectId(organizationId) }
    });
    
    if (!lead) {
      throw new Error('Lead not found');
    }

    // Update lead status to converted
    await this.leadRepository.updateOne(
      { _id: new ObjectId(leadId) },
      { $set: { status: 'converted' } }
    );

    const deal = this.dealRepository.create({
      ...dealData,
      leadId: new ObjectId(leadId),
      contactId: lead.contactId,
      organizationId: new ObjectId(organizationId),
      stage: 'prospecting',
      // Inherit assignment from lead
      assignedToId: lead.assignedToId
    });
    
    return this.dealRepository.save(deal);
  }

  async createTaskForDeal(dealId: string, taskData: any, organizationId: string) {
    const deal = await this.dealRepository.findOne({
      where: { _id: new ObjectId(dealId), organizationId: new ObjectId(organizationId) }
    });
    
    if (!deal) {
      throw new Error('Deal not found');
    }

    const task = this.taskRepository.create({
      ...taskData,
      dealId: new ObjectId(dealId),
      leadId: deal.leadId,
      contactId: deal.contactId,
      organizationId: new ObjectId(organizationId),
      status: 'pending',
      // Inherit assignment from deal
      assignedToId: deal.assignedToId
    });
    
    return this.taskRepository.save(task);
  }

  // Enhanced methods with relationship data
  async getContactsWithLeads(organizationId: string) {
    return this.contactRepository.find({
      where: { organizationId: new ObjectId(organizationId) },
      relations: ['leads']
    });
  }

  async getLeadsWithDeals(organizationId: string) {
    return this.leadRepository.find({
      where: { organizationId: new ObjectId(organizationId) },
      relations: ['contact']
    });
  }

  async getDealsWithTasks(organizationId: string) {
    return this.dealRepository.find({
      where: { organizationId: new ObjectId(organizationId) },
      relations: ['contact', 'lead']
    });
  }

  async getTasksWithRelations(organizationId: string) {
    return this.taskRepository.find({
      where: { organizationId: new ObjectId(organizationId) },
      relations: ['contact', 'lead', 'deal']
    });
  }

  // Reporting methods
  async getConversionReport(organizationId: string) {
    const orgId = new ObjectId(organizationId);
    
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

  // Update and Delete methods
  async updateContact(id: string, contactData: any, organizationId: string) {
    const updateData = {
      ...contactData,
      assignedToId: contactData.assignedToId ? new ObjectId(contactData.assignedToId) : null
    };
    await this.contactRepository.updateOne(
      { _id: new ObjectId(id), organizationId: new ObjectId(organizationId) },
      { $set: updateData }
    );
    return this.contactRepository.findOne({
      where: { _id: new ObjectId(id), organizationId: new ObjectId(organizationId) }
    });
  }

  async deleteContact(id: string, organizationId: string) {
    return this.contactRepository.deleteOne({
      _id: new ObjectId(id),
      organizationId: new ObjectId(organizationId)
    });
  }

  async updateLead(id: string, leadData: any, organizationId: string) {
    const updateData = {
      ...leadData,
      contactId: leadData.contactId ? new ObjectId(leadData.contactId) : null,
      assignedToId: leadData.assignedToId ? new ObjectId(leadData.assignedToId) : null
    };
    await this.leadRepository.updateOne(
      { _id: new ObjectId(id), organizationId: new ObjectId(organizationId) },
      { $set: updateData }
    );
    return this.leadRepository.findOne({
      where: { _id: new ObjectId(id), organizationId: new ObjectId(organizationId) }
    });
  }

  async deleteLead(id: string, organizationId: string) {
    return this.leadRepository.deleteOne({
      _id: new ObjectId(id),
      organizationId: new ObjectId(organizationId)
    });
  }

  async updateDeal(id: string, dealData: any, organizationId: string) {
    let updateData = { ...dealData };
    
    // If leadId is being updated, get the contactId from the new lead
    if (dealData.leadId) {
      const lead = await this.leadRepository.findOne({
        where: { _id: new ObjectId(dealData.leadId), organizationId: new ObjectId(organizationId) }
      });
      if (lead) {
        updateData.contactId = lead.contactId;
        updateData.leadId = new ObjectId(dealData.leadId);
      }
    } else if (dealData.leadId === null || dealData.leadId === '') {
      updateData.leadId = null;
    }
    
    if (dealData.assignedToId) {
      updateData.assignedToId = new ObjectId(dealData.assignedToId);
    } else if (dealData.assignedToId === null || dealData.assignedToId === '') {
      updateData.assignedToId = null;
    }
    
    await this.dealRepository.updateOne(
      { _id: new ObjectId(id), organizationId: new ObjectId(organizationId) },
      { $set: updateData }
    );
    return this.dealRepository.findOne({
      where: { _id: new ObjectId(id), organizationId: new ObjectId(organizationId) }
    });
  }

  async deleteDeal(id: string, organizationId: string) {
    return this.dealRepository.deleteOne({
      _id: new ObjectId(id),
      organizationId: new ObjectId(organizationId)
    });
  }

  async updateTask(id: string, taskData: any, organizationId: string) {
    const updateData = {
      ...taskData,
      assignedToId: taskData.assignedToId ? new ObjectId(taskData.assignedToId) : null,
      contactId: taskData.contactId ? new ObjectId(taskData.contactId) : null,
      leadId: taskData.leadId ? new ObjectId(taskData.leadId) : null,
      dealId: taskData.dealId ? new ObjectId(taskData.dealId) : null
    };
    await this.taskRepository.updateOne(
      { _id: new ObjectId(id), organizationId: new ObjectId(organizationId) },
      { $set: updateData }
    );
    return this.taskRepository.findOne({
      where: { _id: new ObjectId(id), organizationId: new ObjectId(organizationId) }
    });
  }

  async deleteTask(id: string, organizationId: string) {
    return this.taskRepository.deleteOne({
      _id: new ObjectId(id),
      organizationId: new ObjectId(organizationId)
    });
  }

  // Dashboard stats
  async getDashboardStats(organizationId: string) {
    const orgId = new ObjectId(organizationId);
    
    const [contacts, leads, deals, tasks] = await Promise.all([
      this.contactRepository.find({ where: { organizationId: orgId } }),
      this.leadRepository.find({ where: { organizationId: orgId } }),
      this.dealRepository.find({ where: { organizationId: orgId } }),
      this.taskRepository.find({ where: { organizationId: orgId, status: 'pending' } })
    ]);

    const openDeals = deals.filter(deal => 
      ['prospecting', 'qualification', 'proposal', 'negotiation'].includes(deal.stage)
    );
    
    const pipelineValue = openDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

    return {
      contacts: contacts.length,
      leads: leads.length,
      deals: deals.length,
      pendingTasks: tasks.length,
      pipelineValue
    };
  }

  // Assignment Management Methods
  async getOrganizationUsers(organizationId: string) {
    return this.userRepository.find({
      where: { organizationId: new ObjectId(organizationId), isActive: true },
      select: ['_id', 'firstName', 'lastName', 'email']
    });
  }

  async assignContact(contactId: string, assignedToId: string, organizationId: string) {
    await this.contactRepository.updateOne(
      { _id: new ObjectId(contactId), organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: new ObjectId(assignedToId) } }
    );
    
    const contact = await this.contactRepository.findOne({
      where: { _id: new ObjectId(contactId), organizationId: new ObjectId(organizationId) }
    });
    
    // Populate assignedTo user data
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

  async unassignContact(contactId: string, organizationId: string) {
    await this.contactRepository.updateOne(
      { _id: new ObjectId(contactId), organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: null } }
    );
    
    const contact = await this.contactRepository.findOne({
      where: { _id: new ObjectId(contactId), organizationId: new ObjectId(organizationId) }
    });
    
    return contact;
  }

  async assignLead(leadId: string, assignedToId: string, organizationId: string) {
    await this.leadRepository.updateOne(
      { _id: new ObjectId(leadId), organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: new ObjectId(assignedToId) } }
    );
    return this.leadRepository.findOne({
      where: { _id: new ObjectId(leadId), organizationId: new ObjectId(organizationId) }
    });
  }

  async unassignLead(leadId: string, organizationId: string) {
    await this.leadRepository.updateOne(
      { _id: new ObjectId(leadId), organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: null } }
    );
    return this.leadRepository.findOne({
      where: { _id: new ObjectId(leadId), organizationId: new ObjectId(organizationId) }
    });
  }

  async assignDeal(dealId: string, assignedToId: string, organizationId: string) {
    await this.dealRepository.updateOne(
      { _id: new ObjectId(dealId), organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: new ObjectId(assignedToId) } }
    );
    return this.dealRepository.findOne({
      where: { _id: new ObjectId(dealId), organizationId: new ObjectId(organizationId) }
    });
  }

  async unassignDeal(dealId: string, organizationId: string) {
    await this.dealRepository.updateOne(
      { _id: new ObjectId(dealId), organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: null } }
    );
    return this.dealRepository.findOne({
      where: { _id: new ObjectId(dealId), organizationId: new ObjectId(organizationId) }
    });
  }

  async assignTask(taskId: string, assignedToId: string, organizationId: string) {
    await this.taskRepository.updateOne(
      { _id: new ObjectId(taskId), organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: new ObjectId(assignedToId) } }
    );
    return this.taskRepository.findOne({
      where: { _id: new ObjectId(taskId), organizationId: new ObjectId(organizationId) }
    });
  }

  async unassignTask(taskId: string, organizationId: string) {
    await this.taskRepository.updateOne(
      { _id: new ObjectId(taskId), organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: null } }
    );
    return this.taskRepository.findOne({
      where: { _id: new ObjectId(taskId), organizationId: new ObjectId(organizationId) }
    });
  }

  // Get assigned items for a user
  async getMyAssignments(userId: string, organizationId: string) {
    const userObjectId = new ObjectId(userId);
    const orgObjectId = new ObjectId(organizationId);

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

  // Bulk assignment operations
  async bulkAssignContacts(contactIds: string[], assignedToId: string, organizationId: string) {
    const objectIds = contactIds.map(id => new ObjectId(id));
    await this.contactRepository.updateMany(
      { _id: { $in: objectIds }, organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: new ObjectId(assignedToId) } }
    );
    return { success: true, updated: contactIds.length };
  }

  async bulkAssignLeads(leadIds: string[], assignedToId: string, organizationId: string) {
    const objectIds = leadIds.map(id => new ObjectId(id));
    await this.leadRepository.updateMany(
      { _id: { $in: objectIds }, organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: new ObjectId(assignedToId) } }
    );
    return { success: true, updated: leadIds.length };
  }

  async bulkAssignDeals(dealIds: string[], assignedToId: string, organizationId: string) {
    const objectIds = dealIds.map(id => new ObjectId(id));
    await this.dealRepository.updateMany(
      { _id: { $in: objectIds }, organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: new ObjectId(assignedToId) } }
    );
    return { success: true, updated: dealIds.length };
  }

  async bulkAssignTasks(taskIds: string[], assignedToId: string, organizationId: string) {
    const objectIds = taskIds.map(id => new ObjectId(id));
    await this.taskRepository.updateMany(
      { _id: { $in: objectIds }, organizationId: new ObjectId(organizationId) },
      { $set: { assignedToId: new ObjectId(assignedToId) } }
    );
    return { success: true, updated: taskIds.length };
  }
}