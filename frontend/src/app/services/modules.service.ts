import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BrandConfigService } from './brand-config.service';

export interface AppModuleInfo {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isActive?: boolean;
  canActivate?: boolean;
  isPending?: boolean;
  permissionType?: 'public' | 'require_permission';
  category?: string;
  icon?: string;
  color?: string;
}

export interface ModuleRequest {
  _id: string;
  moduleId: string;
  userId: string;
  organizationId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  userName?: string;
  moduleName?: string;
  approverType?: 'org_admin' | 'super_admin' | 'system' | 'unknown';
  priority?: 'high' | 'normal';
  canApprove?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ModulesService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getActive(): Observable<AppModuleInfo[]> {
    return this.http
      .get<AppModuleInfo[]>(`${this.apiUrl}/modules/active`)
      .pipe(catchError(() => of([])));
  }

  getPersonalModules(): Observable<AppModuleInfo[]> {
    return this.http
      .get<AppModuleInfo[]>(`${this.apiUrl}/modules/personal`)
      .pipe(catchError(() => of([])));
  }

  getOrganizationModules(orgId: string): Observable<AppModuleInfo[]> {
    return this.http
      .get<AppModuleInfo[]>(`${this.apiUrl}/modules/organization/${orgId}`)
      .pipe(catchError(() => of([])));
  }

  getAll(): Observable<AppModuleInfo[]> {
    return this.http
      .get<AppModuleInfo[]>(`${this.apiUrl}/modules`)
      .pipe(catchError(() => of([])));
  }

  getAvailable(): Observable<AppModuleInfo[]> {
    return this.http
      .get<AppModuleInfo[]>(`${this.apiUrl}/modules/available`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching available modules:', error);
          return of([]);
        })
      );
  }

  requestActivation(moduleId: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/modules/${moduleId}/request`, {})
      .pipe(
        map((response: any) => ({
          success: response.success || false,
          message: response.message || '',
          approverType: response.approverType || 'unknown',
          requiresApproval: response.requiresApproval || false
        })),
        catchError(() => of({ success: false, message: 'Request failed', approverType: 'unknown' }))
      );
  }

  getPendingRequests(): Observable<ModuleRequest[]> {
    return this.http
      .get<ModuleRequest[]>(`${this.apiUrl}/modules/requests`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching pending requests:', error);
          return of([]);
        })
      );
  }

  approveRequest(requestId: string): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/modules/requests/${requestId}/approve`, {})
      .pipe(catchError(() => of({ success: false })));
  }

  rejectRequest(requestId: string): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/modules/requests/${requestId}/reject`, {})
      .pipe(catchError(() => of({ success: false })));
  }

  deactivateModule(moduleId: string): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/modules/${moduleId}/deactivate`, {})
      .pipe(catchError(() => of({ success: false })));
  }
}
