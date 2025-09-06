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
    return this.http.post<Lead>(`${this.apiUrl}/crm/leads`, lead);
  }

  createDeal(deal: Partial<Deal>): Observable<Deal> {
    return this.http.post<Deal>(`${this.apiUrl}/crm/deals`, deal);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/crm/tasks`, task);
  }

  updateContact(id: string, contact: Partial<Contact>): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/crm/contacts/${id}`, contact);
  }

  updateLead(id: string, lead: Partial<Lead>): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/crm/leads/${id}`, lead);
  }

  updateDeal(id: string, deal: Partial<Deal>): Observable<Deal> {
    return this.http.put<Deal>(`${this.apiUrl}/crm/deals/${id}`, deal);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/crm/tasks/${id}`, task);
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/crm/contacts/${id}`);
  }

  deleteLead(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/crm/leads/${id}`);
  }

  deleteDeal(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/crm/deals/${id}`);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/crm/tasks/${id}`);
  }
}