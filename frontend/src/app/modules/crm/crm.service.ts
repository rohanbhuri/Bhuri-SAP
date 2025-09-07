import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from '../../services/brand-config.service';

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  status: string;
  customFields?: Record<string, any>;
  organizationId: string;
  assignedToId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Lead {
  _id: string;
  title: string;
  description?: string;
  status: string;
  estimatedValue?: number;
  source?: string;
  expectedCloseDate?: Date;
  contactId?: string;
  contact?: Contact;
  organizationId: string;
  assignedToId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Deal {
  _id: string;
  title: string;
  description?: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  contactId?: string;
  contact?: Contact;
  leadId?: string;
  lead?: Lead;
  organizationId: string;
  assignedToId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date;
  reminderDate?: Date;
  type: string;
  contactId?: string;
  contact?: Contact;
  leadId?: string;
  lead?: Lead;
  dealId?: string;
  deal?: Deal;
  organizationId: string;
  assignedToId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CrmStats {
  contacts: number;
  leads: number;
  deals: number;
  pendingTasks: number;
  pipelineValue: number;
}

export interface ConversionReport {
  totalContacts: number;
  totalLeads: number;
  convertedLeads: number;
  totalDeals: number;
  wonDeals: number;
  contactToLeadRate: number;
  leadToDealRate: number;
  dealWinRate: number;
}

@Injectable({ providedIn: 'root' })
export class CrmService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  
  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getDashboardStats(): Observable<CrmStats> {
    return this.http
      .get<CrmStats>(`${this.apiUrl}/crm/dashboard`)
      .pipe(catchError(() => of({
        contacts: 0,
        leads: 0,
        deals: 0,
        pendingTasks: 0,
        pipelineValue: 0
      })));
  }

  getContacts(): Observable<Contact[]> {
    return this.http
      .get<Contact[]>(`${this.apiUrl}/crm/contacts`)
      .pipe(catchError(() => of([])));
  }

  getLeads(): Observable<Lead[]> {
    return this.http
      .get<Lead[]>(`${this.apiUrl}/crm/leads`)
      .pipe(catchError(() => of([])));
  }

  getDeals(): Observable<Deal[]> {
    return this.http
      .get<Deal[]>(`${this.apiUrl}/crm/deals`)
      .pipe(catchError(() => of([])));
  }

  getTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.apiUrl}/crm/tasks`)
      .pipe(catchError(() => of([])));
  }

  createContact(contact: Partial<Contact>): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}/crm/contacts`, contact);
  }

  createLead(lead: Partial<Lead>): Observable<Lead> {
    const leadData = {
      ...lead,
      contactId: lead.contactId || null
    };
    return this.http.post<Lead>(`${this.apiUrl}/crm/leads`, leadData);
  }

  createDeal(deal: Partial<Deal>): Observable<Deal> {
    const dealData = {
      ...deal,
      leadId: deal.leadId || null
    };
    return this.http.post<Deal>(`${this.apiUrl}/crm/deals`, dealData);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/crm/tasks`, task);
  }

  updateContact(id: string, contact: Partial<Contact>): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/crm/contacts/${id}`, contact);
  }

  deleteContact(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/crm/contacts/${id}`);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/crm/tasks/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/crm/tasks/${id}`);
  }

  updateLead(id: string, lead: Partial<Lead>): Observable<Lead> {
    const leadData = {
      ...lead,
      contactId: lead.contactId || null
    };
    return this.http.put<Lead>(`${this.apiUrl}/crm/leads/${id}`, leadData);
  }

  deleteLead(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/crm/leads/${id}`);
  }

  updateDeal(id: string, deal: Partial<Deal>): Observable<Deal> {
    const dealData = {
      ...deal,
      leadId: deal.leadId || null
    };
    return this.http.put<Deal>(`${this.apiUrl}/crm/deals/${id}`, dealData);
  }

  deleteDeal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/crm/deals/${id}`);
  }

  // Conversion methods - enforcing proper CRM flow
  convertContactToLead(contactId: string, leadData: Partial<Lead>): Observable<Lead> {
    return this.http.post<Lead>(`${this.apiUrl}/crm/contacts/${contactId}/convert-to-lead`, leadData);
  }

  convertLeadToDeal(leadId: string, dealData: Partial<Deal>): Observable<Deal> {
    return this.http.post<Deal>(`${this.apiUrl}/crm/leads/${leadId}/convert-to-deal`, dealData);
  }

  createTaskForDeal(dealId: string, taskData: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/crm/deals/${dealId}/create-task`, taskData);
  }

  // Enhanced methods with relationship data
  getContactsWithLeads(): Observable<Contact[]> {
    return this.http
      .get<Contact[]>(`${this.apiUrl}/crm/contacts-with-leads`)
      .pipe(catchError(() => of([])));
  }

  getLeadsWithDeals(): Observable<Lead[]> {
    return this.http
      .get<Lead[]>(`${this.apiUrl}/crm/leads-with-deals`)
      .pipe(catchError(() => of([])));
  }

  getDealsWithTasks(): Observable<Deal[]> {
    return this.http
      .get<Deal[]>(`${this.apiUrl}/crm/deals-with-tasks`)
      .pipe(catchError(() => of([])));
  }

  getTasksWithRelations(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.apiUrl}/crm/tasks-with-relations`)
      .pipe(catchError(() => of([])));
  }

  // Reporting methods
  getConversionReport(): Observable<ConversionReport> {
    return this.http
      .get<ConversionReport>(`${this.apiUrl}/crm/conversion-report`)
      .pipe(catchError(() => of({
        totalContacts: 0,
        totalLeads: 0,
        convertedLeads: 0,
        totalDeals: 0,
        wonDeals: 0,
        contactToLeadRate: 0,
        leadToDealRate: 0,
        dealWinRate: 0
      })));
  }
}