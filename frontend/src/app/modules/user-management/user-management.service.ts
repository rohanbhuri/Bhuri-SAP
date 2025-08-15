import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from '../../services/brand-config.service';

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActive: boolean;
  organizationId: string;
}

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getUsers(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/user-management/users`)
      .pipe(catchError(() => of([])));
  }

  getRoles(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/user-management/roles`)
      .pipe(catchError(() => of([])));
  }

  getPermissions(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/user-management/permissions`)
      .pipe(catchError(() => of([])));
  }

  getModules(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/user-management/modules`)
      .pipe(catchError(() => of([])));
  }

  updateUserRoles(userId: string, roleIds: string[]): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/user-management/users/${userId}/roles`, { roleIds })
      .pipe(catchError(() => of({ success: false })));
  }

  updateUserPermissions(userId: string, permissionIds: string[]): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/user-management/users/${userId}/permissions`, { permissionIds })
      .pipe(catchError(() => of({ success: false })));
  }

  createRole(roleData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user-management/roles`, roleData)
      .pipe(catchError(() => of({ success: false })));
  }

  createPermission(permissionData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user-management/permissions`, permissionData)
      .pipe(catchError(() => of({ success: false })));
  }

  setupDefaults(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user-management/setup-defaults`, {})
      .pipe(catchError(() => of({ success: false })));
  }
}