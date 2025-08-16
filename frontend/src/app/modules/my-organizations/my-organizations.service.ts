import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from '../../services/brand-config.service';

export interface PublicOrganization {
  id: string;
  _id?: string;
  name: string;
  code: string;
  description?: string;
  isPublic: boolean;
  memberCount: number;
  activeModuleIds: string[];
  createdAt: Date;
  isMember?: boolean;
}

@Injectable({ providedIn: 'root' })
export class MyOrganizationsService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  
  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getMyOrganizations(): Observable<PublicOrganization[]> {
    return this.http.get<PublicOrganization[]>(`${this.apiUrl}/organizations/my-organizations`).pipe(
      catchError(() => of([]))
    );
  }

  getPublicOrganizations(): Observable<PublicOrganization[]> {
    return this.http.get<PublicOrganization[]>(`${this.apiUrl}/organizations/public`).pipe(
      catchError(() => of([]))
    );
  }

  requestToJoin(organizationId: string): Observable<any> {
    if (!organizationId) {
      return of({ success: false, message: 'Organization ID is required' });
    }
    
    console.log('Sending request to join organization:', organizationId);
    console.log('API URL:', `${this.apiUrl}/organization-management/requests`);
    
    return this.http.post(`${this.apiUrl}/organization-management/requests`, { organizationId });
  }

  createOrganization(orgData: any): Observable<PublicOrganization> {
    return this.http.post<PublicOrganization>(`${this.apiUrl}/organizations/create`, orgData);
  }

  switchOrganization(organizationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/organization-management/switch-organization/${organizationId}`, {});
  }
}