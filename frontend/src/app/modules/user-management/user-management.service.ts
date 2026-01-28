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
  enableEmailNotifications?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getUsers(): Observable<any[]> {
    const url = `${this.apiUrl}/user-management/users`;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('API call failed:', error);
        throw error;
      })
    );
  }

  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-management/users?search=${encodeURIComponent(query)}`).pipe(
      catchError(() => of([]))
    );
  }

  searchRoles(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-management/roles?search=${encodeURIComponent(query)}`).pipe(
      catchError(() => of([]))
    );
  }

  searchPermissions(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-management/permissions?search=${encodeURIComponent(query)}`).pipe(
      catchError(() => of([]))
    );
  }

  createUser(userData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user-management/users`, userData)
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/user-management/users/${userId}`, userData)
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  deleteUser(userId: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/user-management/users/${userId}`)
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  toggleUserStatus(userId: string, isActive: boolean): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/user-management/users/${userId}/status`, {
        isActive,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getOrganizations(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/user-management/organizations`)
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

  createRole(roleData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user-management/roles`, roleData)
      .pipe(catchError(() => of({ success: false })));
  }

  updateRole(roleId: string, roleData: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/user-management/roles/${roleId}`, roleData)
      .pipe(catchError(() => of({ success: false })));
  }

  deleteRole(roleId: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/user-management/roles/${roleId}`)
      .pipe(catchError(() => of({ success: false })));
  }

  createPermission(permissionData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user-management/permissions`, permissionData)
      .pipe(catchError(() => of({ success: false })));
  }

  updatePermission(permissionId: string, permissionData: any): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/user-management/permissions/${permissionId}`,
        permissionData
      )
      .pipe(catchError(() => of({ success: false })));
  }

  deletePermission(permissionId: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/user-management/permissions/${permissionId}`)
      .pipe(catchError(() => of({ success: false })));
  }

  getAnalytics(): Observable<any> {
    return new Observable(observer => {
      import('rxjs').then(({ forkJoin }) => {
        forkJoin({
          users: this.getUsers(),
          roles: this.getRoles(),
          permissions: this.getPermissions()
        }).subscribe({
          next: ({ users, roles, permissions }) => {
            const activeUsers = users.filter(u => u.isActive);
            const mfaEnabled = users.filter(u => u.requireTwoFactor);
            
            // Calculate role distribution
            const rolesDistribution = roles.map(role => ({
              name: role.name || role,
              count: users.filter(u => u.roleIds?.includes(role._id) || u.roles?.includes(role.name)).length
            }));

            const analytics = {
              totalUsers: users.length,
              activeUsers: activeUsers.length,
              inactiveUsers: users.length - activeUsers.length,
              totalRoles: roles.length,
              totalPermissions: permissions.length,
              mfaAdoption: mfaEnabled.length,
              rolesDistribution: rolesDistribution.sort((a, b) => b.count - a.count),
              recentActivity: [
                { type: 'user_joined', message: 'New user registration', time: '2 mins ago', icon: 'person_add' },
                { type: 'role_update', message: 'Role "Editor" permissions updated', time: '1 hour ago', icon: 'admin_panel_settings' },
                { type: 'security', message: 'Security audit completed', time: '3 hours ago', icon: 'security' }
              ] // Mocked for now as we don't have an activity log endpoint
            };
            
            observer.next(analytics);
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          }
        });
      });
    });
  }
}
