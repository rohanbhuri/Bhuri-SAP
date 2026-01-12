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
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          this.currentUserSubject.next(response.user);
          this.connectWebSocketWithAuth(response.user, response.access_token);
        })
      );
  }

  signup(userData: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup`, userData)
      .pipe(
        tap(response => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          this.currentUserSubject.next(response.user);
          this.connectWebSocketWithAuth(response.user, response.access_token);
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

  showSessionTimeout(): void {
    this.dialog.open(SessionTimeoutDialogComponent, {
      disableClose: true,
      width: '400px'
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
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          this.currentUserSubject.next(updatedUser);
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
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          this.currentUserSubject.next(updatedUser);
        })
      );
  }

  uploadAvatar(file: File): Observable<User> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.http.post<User>(`${this.apiUrl}/auth/profile/avatar`, formData)
      .pipe(
        tap(updatedUser => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          this.currentUserSubject.next(updatedUser);
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
}