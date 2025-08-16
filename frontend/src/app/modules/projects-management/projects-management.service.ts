import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from '../../services/brand-config.service';

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  managerId: string;
  teamMembers: string[];
  organizationId: string;
  progress: number;
  clientId?: string;
}

export interface Deliverable {
  _id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  dueDate: Date;
  assignedTo: string;
  progress: number;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  totalBudget: number;
  totalSpent: number;
  overdue: number;
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
            onHold: 0,
            totalBudget: 0,
            totalSpent: 0,
            overdue: 0,
          })
        )
      );
  }

  getProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${this.apiUrl}/projects-management/projects`)
      .pipe(catchError(() => of([])));
  }

  getDeliverables(projectId?: string): Observable<Deliverable[]> {
    const url = projectId 
      ? `${this.apiUrl}/projects-management/deliverables?projectId=${projectId}`
      : `${this.apiUrl}/projects-management/deliverables`;
    return this.http
      .get<Deliverable[]>(url)
      .pipe(catchError(() => of([])));
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects-management/projects`, project);
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects-management/projects/${id}`, project);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects-management/projects/${id}`);
  }

  createDeliverable(deliverable: Partial<Deliverable>): Observable<Deliverable> {
    return this.http.post<Deliverable>(`${this.apiUrl}/projects-management/deliverables`, deliverable);
  }

  updateDeliverable(id: string, deliverable: Partial<Deliverable>): Observable<Deliverable> {
    return this.http.put<Deliverable>(`${this.apiUrl}/projects-management/deliverables/${id}`, deliverable);
  }
}