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
}

export interface Lead {
  _id: string;
  title: string;
  description?: string;
  status: string;
  estimatedValue?: number;
  source?: string;
  expectedCloseDate?: Date;
  contact?: Contact;
}

export interface Deal {
  _id: string;
  title: string;
  description?: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate?: Date;
  contact?: Contact;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date;
  type: string;
  contact?: Contact;
  lead?: Lead;
  deal?: Deal;
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
}