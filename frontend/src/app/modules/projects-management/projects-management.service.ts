import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from '../../services/brand-config.service';

export interface Project {
  _id: string;
  name: string;
  description: string;
  code: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  stage: 'discovery' | 'planning' | 'execution' | 'delivery' | 'closure';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  currency: string;
  billingType: 'fixed' | 'hourly' | 'milestone';
  hourlyRate?: number;
  managerId: string;
  clientId?: string;
  teamMemberIds: string[];
  progress: number;
  health: 'green' | 'yellow' | 'red';
  tags: string[];
  convertedFromLead: boolean;
  leadId?: string;
}

export interface Deliverable {
  _id: string;
  projectId: string;
  name: string;
  description: string;
  type: 'document' | 'software' | 'design' | 'report';
  status: 'pending' | 'in-progress' | 'review' | 'completed' | 'rejected';
  progress: number;
  assignedTo?: string;
  reviewerId?: string;
  dueDate: Date;
  completedDate?: Date;
  dependencies: string[];
  billable: boolean;
  estimatedHours?: number;
  actualHours?: number;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  conversions: number;
}

export interface LeadConversionData {
  leadId: string;
  projectData: Partial<Project>;
}

@Injectable({ providedIn: 'root' })
export class ProjectsManagementService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);

  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getStats(): Observable<ProjectStats> {
    return this.http
      .get<ProjectStats>(`${this.apiUrl}/projects-management/stats`)
      .pipe(
        catchError(() =>
          of({
            total: 0,
            active: 0,
            completed: 0,
            conversions: 0,
          })
        )
      );
  }

  getProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${this.apiUrl}/projects-management/projects`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching projects:', error);
          return of([]);
        })
      );
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects-management/projects/${id}`);
  }

  getProjectDeliverables(projectId: string): Observable<Deliverable[]> {
    return this.http
      .get<Deliverable[]>(`${this.apiUrl}/projects-management/projects/${projectId}/deliverables`)
      .pipe(catchError(() => of([])));
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects-management/projects`, project)
      .pipe(
        catchError((error) => {
          console.error('Service error creating project:', error);
          throw error;
        })
      );
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects-management/projects/${id}`, project);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects-management/projects/${id}`);
  }

  convertLeadToProject(conversionData: LeadConversionData): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects-management/convert-lead`, conversionData);
  }

  assignUsersToProject(projectId: string, userIds: string[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/projects-management/projects/${projectId}/assign-users`, { userIds });
  }

  createDeliverable(projectId: string, deliverable: Partial<Deliverable>): Observable<Deliverable> {
    return this.http.post<Deliverable>(`${this.apiUrl}/projects-management/projects/${projectId}/deliverables`, deliverable);
  }

  updateDeliverable(id: string, deliverable: Partial<Deliverable>): Observable<Deliverable> {
    return this.http.put<Deliverable>(`${this.apiUrl}/projects-management/deliverables/${id}`, deliverable);
  }

  deleteDeliverable(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects-management/deliverables/${id}`);
  }
}