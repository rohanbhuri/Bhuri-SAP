import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from '../../services/brand-config.service';

export interface OrganizationInfo {
  id: string;
  name: string;
  code: string;
  activeModuleIds: string[];
  createdAt: Date;
  userCount?: number;
}

export interface OrganizationRequest {
  id: string;
  userId: string;
  organizationId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  user?: any;
  organization?: any;
}

@Injectable({ providedIn: 'root' })
export class OrganizationManagementService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getOrganizations(): Observable<OrganizationInfo[]> {
    return this.http.get<OrganizationInfo[]>(`${this.apiUrl}/organization-management/organizations`).pipe(
      catchError((error) => {
        console.error('API call failed:', error);
        throw error;
      })
    );
  }

  createOrganization(orgData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/organization-management/organizations`, orgData).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  updateOrganization(orgId: string, orgData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/organization-management/organizations/${orgId}`, orgData).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  deleteOrganization(orgId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/organization-management/organizations/${orgId}`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  getOrganizationRequests(): Observable<OrganizationRequest[]> {
    return this.http.get<OrganizationRequest[]>(`${this.apiUrl}/organization-management/requests`).pipe(
      catchError(() => of([]))
    );
  }

  approveRequest(requestId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/organization-management/requests/${requestId}/approve`, {}).pipe(
      catchError(() => of({ success: false }))
    );
  }

  rejectRequest(requestId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/organization-management/requests/${requestId}/reject`, {}).pipe(
      catchError(() => of({ success: false }))
    );
  }

  requestToJoinOrganization(organizationId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/organization-management/requests`, { organizationId }).pipe(
      catchError(() => of({ success: false }))
    );
  }

  getAvailableModules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/modules`).pipe(
      catchError(() => of([]))
    );
  }

  getAvailableOrganizations(): Observable<OrganizationInfo[]> {
    return this.http.get<OrganizationInfo[]>(`${this.apiUrl}/organizations`).pipe(
      catchError(() => of([]))
    );
  }

  switchOrganization(organizationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/organization-management/switch-organization/${organizationId}`, {}).pipe(
      catchError(() => of({ success: false }))
    );
  }

  updateOrganizationModules(orgId: string, moduleIds: string[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/organization-management/organizations/${orgId}/modules`, { moduleIds }).pipe(
      catchError(() => of({ success: false }))
    );
  }
}