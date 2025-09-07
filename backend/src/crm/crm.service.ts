import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Contact } from '../entities/contact.entity';
import { Lead } from '../entities/lead.entity';
import { Deal } from '../entities/deal.entity';
import { Task } from '../entities/task.entity';

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
  ) {}

  // Contact methods
  async getContacts(organizationId: string) {
    return this.contactRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });
  }

  async createContact(contactData: any, organizationId: string) {
    const contact = this.contactRepository.create({
      ...contactData,
      organizationId: new ObjectId(organizationId)
    });
    return this.contactRepository.save(contact);
  }

  // Lead methods
  async getLeads(organizationId: string) {
    return this.leadRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });
  }

  async createLead(leadData: any, organizationId: string) {
    const lead = this.leadRepository.create({
      ...leadData,
      organizationId: new ObjectId(organizationId),
      contactId: leadData.contactId ? new ObjectId(leadData.contactId) : null
    });
    return this.leadRepository.save(lead);
  }

  // Deal methods
  async getDeals(organizationId: string) {
    return this.dealRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });
  }

  async createDeal(dealData: any, organizationId: string) {
    let contactId = null;
    
    // If leadId is provided, get the contactId from the lead
    if (dealData.leadId) {
      const lead = await this.leadRepository.findOne({
        where: { _id: new ObjectId(dealData.leadId), organizationId: new ObjectId(organizationId) }
      });
      if (lead) {
        contactId = lead.contactId;
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
      contactId: contactId
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
    const task = this.taskRepository.create({
      ...taskData,
      organizationId: new ObjectId(organizationId)
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
      status: 'new'
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
      stage: 'prospecting'
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
      status: 'pending'
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
    await this.contactRepository.updateOne(
      { _id: new ObjectId(id), organizationId: new ObjectId(organizationId) },
      { $set: contactData }
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
      contactId: leadData.contactId ? new ObjectId(leadData.contactId) : null
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
    await this.taskRepository.updateOne(
      { _id: new ObjectId(id), organizationId: new ObjectId(organizationId) },
      { $set: taskData }
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
}