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
  permissionType?: 'public' | 'require_permission';
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

  getAll(): Observable<AppModuleInfo[]> {
    return this.http
      .get<AppModuleInfo[]>(`${this.apiUrl}/modules`)
      .pipe(catchError(() => of([])));
  }

  getAvailable(): Observable<AppModuleInfo[]> {
    return this.http
      .get<AppModuleInfo[]>(`${this.apiUrl}/modules/available`)
      .pipe(catchError(() => of([])));
  }

  requestActivation(moduleId: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/modules/${moduleId}/request`, {})
      .pipe(catchError(() => of({ success: false })));
  }

  getPendingRequests(): Observable<ModuleRequest[]> {
    return this.http
      .get<ModuleRequest[]>(`${this.apiUrl}/modules/requests`)
      .pipe(catchError(() => of([])));
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
}
