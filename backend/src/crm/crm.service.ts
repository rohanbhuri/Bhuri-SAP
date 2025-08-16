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
      organizationId: new ObjectId(organizationId)
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
    const deal = this.dealRepository.create({
      ...dealData,
      organizationId: new ObjectId(organizationId)
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

  // Dashboard stats
  async getDashboardStats(organizationId: string) {
    const orgId = new ObjectId(organizationId);
    
    const [contactsCount, leadsCount, dealsCount, tasksCount] = await Promise.all([
      this.contactRepository.count({ where: { organizationId: orgId } }),
      this.leadRepository.count({ where: { organizationId: orgId } }),
      this.dealRepository.count({ where: { organizationId: orgId } }),
      this.taskRepository.count({ where: { organizationId: orgId, status: 'pending' } })
    ]);

    const openDeals = await this.dealRepository.find({
      where: {
        organizationId: orgId,
        stage: { $in: ['prospecting', 'qualification', 'proposal', 'negotiation'] }
      }
    });
    
    const pipelineValue = openDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

    return {
      contacts: contactsCount,
      leads: leadsCount,
      deals: dealsCount,
      pendingTasks: tasksCount,
      pipelineValue
    };
  }
}