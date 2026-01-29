import { Injectable, inject, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BrandConfigService } from './brand-config.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionTimeoutDialogComponent } from '../dialogs/session-timeout-dialog.component';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  currency?: string;
  currencySymbol?: string;
  isActive: boolean;
  createdAt: Date;
  roles: UserRole[];
  organizations: UserOrganization[];
  organizationId?: string;
  currentOrganization?: UserOrganization;
  allowApiAccess?: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  type: string;
}

export interface UserOrganization {
  id: string;
  name: string;
  code: string;
  description?: string;
  settings?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    theme?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationId?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Organization {
  id: string;
  _id?: string;
  name: string;
  code: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private brandConfig = inject(BrandConfigService);
  private dialog = inject(MatDialog);
  private injector = inject(Injector);
  private get apiUrl() { return this.brandConfig.getApiUrl(); }
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          const normalizedUser = this.normalizeUser(response.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
          }
          this.currentUserSubject.next(normalizedUser);
          this.connectWebSocketWithAuth(normalizedUser, response.access_token);
        })
      );
  }

  signup(userData: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup`, userData)
      .pipe(
        tap(response => {
          const normalizedUser = this.normalizeUser(response.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
          }
          this.currentUserSubject.next(normalizedUser);
          this.connectWebSocketWithAuth(normalizedUser, response.access_token);
        })
      );
  }

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/organizations`);
  }

  getMyOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/organizations/my-organizations`);
  }

  getPublicOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/organizations/public`);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.disconnectWebSocket();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private isSessionTimeoutDialogOpen = false;

  showSessionTimeout(): void {
    if (this.isSessionTimeoutDialogOpen) {
      return;
    }

    this.isSessionTimeoutDialogOpen = true;
    const dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
      disableClose: true,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isSessionTimeoutDialogOpen = false;
    });

    this.logout();
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateUserOrganization(organizationId: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/auth/update-organization`, { organizationId })
      .pipe(
        tap(updatedUser => {
          const normalizedUser = this.normalizeUser(updatedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(normalizedUser));
          }
          this.currentUserSubject.next(normalizedUser);
        })
      );
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.some(r => r.type === role) || false;
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/profile`);
  }

  updateProfile(profileData: UpdateProfileRequest): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/auth/profile`, profileData)
      .pipe(
        tap(updatedUser => {
          const normalizedUser = this.normalizeUser(updatedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(normalizedUser));
          }
          this.currentUserSubject.next(normalizedUser);
        })
      );
  }

  uploadAvatar(file: File): Observable<User> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.http.post<User>(`${this.apiUrl}/auth/profile/avatar`, formData)
      .pipe(
        tap(updatedUser => {
          const normalizedUser = this.normalizeUser(updatedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(normalizedUser));
          }
          this.currentUserSubject.next(normalizedUser);
        })
      );
  }

  getAvatarUrl(avatarPath?: string): string {
    if (!avatarPath) {
      return '/assets/default-avatar.svg';
    }
    return `${this.apiUrl}${avatarPath}`;
  }

  private connectWebSocket(): void {
    try {
      const wsService = this.injector.get(require('./websocket.service').WebSocketService) as any;
      const user = this.getCurrentUser();
      const token = this.getToken();
      wsService.connectWithAuth(user, token);
    } catch (e) {
      // WebSocketService not yet initialized
    }
  }

  private connectWebSocketWithAuth(user: User, token: string): void {
    console.log('connectWebSocketWithAuth called with user:', user?.id, 'token:', !!token);
    try {
      const wsService = this.injector.get(require('./websocket.service').WebSocketService) as any;
      console.log('Got wsService, calling connectWithAuth');
      wsService.connectWithAuth(user, token);
    } catch (e) {
      console.error('Error getting wsService:', e);
    }
  }

  private disconnectWebSocket(): void {
    try {
      const wsService = this.injector.get(require('./websocket.service').WebSocketService) as any;
      wsService.disconnect();
    } catch (e) {
      // WebSocketService not yet initialized
    }
  }

  private normalizeUser(user: any): User {
    if (!user) return user;
    return {
      ...user,
      id: user.id || user._id,
      organizations: user.organizations?.map((org: any) => ({
        ...org,
        id: org.id || org._id
      })) || []
    };
  }

  // Common module access methods
  private userAccessibleModules: any[] = [];

  async getUserAccessibleModules(modulesService: any): Promise<any[]> {
    const user = this.getCurrentUser();
    if (!user) return [];

    try {
      // Load modules based on context (personal vs organization)
      let modules: any[] = [];
      
      if (user.organizationId) {
        // Try organization modules first
        modules = await modulesService.getOrganizationModules(user.organizationId).toPromise();
      }
      
      // If no organization modules or no organization, fall back to personal
      if (!modules || modules.length === 0) {
        modules = await modulesService.getPersonalModules().toPromise();
      }

      // Cache the accessible modules for permission checks
      this.userAccessibleModules = modules || [];
      return modules || [];
    } catch (error) {
      console.error('Error loading user accessible modules:', error);
      return [];
    }
  }

  hasModuleAccess(moduleId: string): boolean {
    if (!moduleId) return false;
    return this.userAccessibleModules.some(m => 
      m.id === moduleId || m.name === moduleId
    );
  }
  filterModulesWithPermissions(modules: any[], brandKey: string, moduleRegistry: any[], allowedModules: any[]): any[] {
    if (!modules || modules.length === 0) return [];

    // Filter modules that have corresponding widget components using module registry
    const filtered = modules.filter(m => {
      const registryModule = this.getModuleFromRegistry(m.name || m.id, moduleRegistry);
      return registryModule && registryModule.widgetComponent;
    });

    // Filter modules based on brand configuration from module registry
    const brandFiltered = filtered.filter(m => {
      const moduleId = m.name || m.id;
      return allowedModules.some(am => am.id === moduleId || am.name === moduleId);
    });

    return brandFiltered;
  }

  getModuleFromRegistry(moduleId: string, moduleRegistry: any[]) {
    if (!moduleId) return undefined;

    const normalize = (s: string) =>
      (s || '')
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '');

    // 1) Exact id/name match (fast path)
    let module = moduleRegistry.find(
      (m) => m.id === moduleId || m.name === moduleId || m.displayName === moduleId
    );
    if (module) return module;

    // 2) Normalized match (case/space/punctuation insensitive)
    const target = normalize(moduleId);
    module = moduleRegistry.find(
      (m) => normalize(m.id) === target || normalize(m.name) === target || normalize(m.displayName) === target
    );
    if (module) return module;

    // 3) Kebab-case common fallback
    const kebabCase = moduleId.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    module = moduleRegistry.find((m) => m.name === kebabCase || m.id === kebabCase);
    if (module) return module;

    // 4) Loose contains match as last resort
    module = moduleRegistry.find(
      (m) => target.includes(normalize(m.name)) || normalize(m.name).includes(target) || target.includes(normalize(m.displayName))
    );
    if (module) return module;

    return undefined;
  }
}