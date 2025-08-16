import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from '../../services/brand-config.service';

export interface ProjectMilestone {
  _id: string;
  projectId: string;
  name: string;
  description: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
}

export interface ProjectTask {
  _id: string;
  projectId: string;
  milestoneId?: string;
  name: string;
  description: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  dueDate: Date;
  estimatedHours: number;
  actualHours?: number;
}

export interface ProjectProgress {
  _id: string;
  projectId: string;
  date: Date;
  overallProgress: number;
  milestonesCompleted: number;
  tasksCompleted: number;
  budgetSpent: number;
  notes?: string;
}

export interface TrackingStats {
  totalProjects: number;
  onTrack: number;
  atRisk: number;
  delayed: number;
  completedMilestones: number;
  pendingTasks: number;
}

@Injectable({ providedIn: 'root' })
export class ProjectTrackingService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);

  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getStats(): Observable<TrackingStats> {
    return this.http
      .get<TrackingStats>(`${this.apiUrl}/project-tracking/stats`)
      .pipe(
        catchError(() =>
          of({
            totalProjects: 0,
            onTrack: 0,
            atRisk: 0,
            delayed: 0,
            completedMilestones: 0,
            pendingTasks: 0,
          })
        )
      );
  }

  getMilestones(projectId?: string): Observable<ProjectMilestone[]> {
    const url = projectId 
      ? `${this.apiUrl}/project-tracking/milestones?projectId=${projectId}`
      : `${this.apiUrl}/project-tracking/milestones`;
    return this.http
      .get<ProjectMilestone[]>(url)
      .pipe(catchError(() => of([])));
  }

  getTasks(projectId?: string, milestoneId?: string): Observable<ProjectTask[]> {
    let url = `${this.apiUrl}/project-tracking/tasks`;
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (milestoneId) params.append('milestoneId', milestoneId);
    if (params.toString()) url += `?${params.toString()}`;
    
    return this.http
      .get<ProjectTask[]>(url)
      .pipe(catchError(() => of([])));
  }

  getProgress(projectId: string): Observable<ProjectProgress[]> {
    return this.http
      .get<ProjectProgress[]>(`${this.apiUrl}/project-tracking/progress/${projectId}`)
      .pipe(catchError(() => of([])));
  }

  createMilestone(milestone: Partial<ProjectMilestone>): Observable<ProjectMilestone> {
    return this.http.post<ProjectMilestone>(`${this.apiUrl}/project-tracking/milestones`, milestone);
  }

  updateMilestone(id: string, milestone: Partial<ProjectMilestone>): Observable<ProjectMilestone> {
    return this.http.put<ProjectMilestone>(`${this.apiUrl}/project-tracking/milestones/${id}`, milestone);
  }

  createTask(task: Partial<ProjectTask>): Observable<ProjectTask> {
    return this.http.post<ProjectTask>(`${this.apiUrl}/project-tracking/tasks`, task);
  }

  updateTask(id: string, task: Partial<ProjectTask>): Observable<ProjectTask> {
    return this.http.put<ProjectTask>(`${this.apiUrl}/project-tracking/tasks/${id}`, task);
  }

  recordProgress(progress: Partial<ProjectProgress>): Observable<ProjectProgress> {
    return this.http.post<ProjectProgress>(`${this.apiUrl}/project-tracking/progress`, progress);
  }
}