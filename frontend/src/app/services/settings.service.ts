import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BrandConfigService } from './brand-config.service';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  messageNotifications: boolean;
  taskNotifications: boolean;
  projectUpdates: boolean;
  organizationAnnouncements: boolean;
  weeklyDigest: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'organization' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  searchableProfile: boolean;
}

export interface OrganizationPrivacy {
  organizationId: string;
  organizationName: string;
  visibility: 'public' | 'members' | 'private';
  showRole: boolean;
  showJoinDate: boolean;
  allowMemberContact: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  deviceTrust: boolean;
  passwordChangeRequired: boolean;
  lastPasswordChange: Date;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  organizationPrivacy: OrganizationPrivacy[];
  accessibility: AccessibilitySettings;
  security: SecuritySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface SettingsState {
  loading: boolean;
  saving: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  
  private settingsState = signal<SettingsState>({ loading: false, saving: false, error: null });
  private userSettings = new BehaviorSubject<UserSettings | null>(null);

  getSettingsState = this.settingsState.asReadonly();
  getUserSettings = () => this.userSettings.asObservable();

  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  // Load all user settings
  loadUserSettings(): Observable<UserSettings> {
    this.settingsState.update(s => ({ ...s, loading: true, error: null }));
    return this.http.get<UserSettings>(`${this.apiUrl}/settings`);
  }

  // Save complete settings
  saveUserSettings(settings: Partial<UserSettings>): Observable<UserSettings> {
    this.settingsState.update(s => ({ ...s, saving: true, error: null }));
    return this.http.put<UserSettings>(`${this.apiUrl}/settings`, settings);
  }

  // Notification settings
  updateNotificationSettings(notifications: Partial<NotificationSettings>): Observable<UserSettings> {
    return this.http.patch<UserSettings>(`${this.apiUrl}/settings/notifications`, notifications);
  }

  // Privacy settings
  updatePrivacySettings(privacy: Partial<PrivacySettings>): Observable<UserSettings> {
    return this.http.patch<UserSettings>(`${this.apiUrl}/settings/privacy`, privacy);
  }

  updateOrganizationPrivacy(orgId: string, privacy: Partial<OrganizationPrivacy>): Observable<UserSettings> {
    return this.http.patch<UserSettings>(`${this.apiUrl}/settings/organization-privacy/${orgId}`, privacy);
  }

  // Accessibility settings
  updateAccessibilitySettings(accessibility: Partial<AccessibilitySettings>): Observable<UserSettings> {
    return this.http.patch<UserSettings>(`${this.apiUrl}/settings/accessibility`, accessibility);
  }

  // Security settings
  updateSecuritySettings(security: Partial<SecuritySettings>): Observable<UserSettings> {
    return this.http.patch<UserSettings>(`${this.apiUrl}/settings/security`, security);
  }

  enableTwoFactor(): Observable<{ qrCode: string; backupCodes: string[] }> {
    return this.http.post<{ qrCode: string; backupCodes: string[] }>(`${this.apiUrl}/settings/2fa/enable`, {});
  }

  verifyTwoFactor(code: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/settings/2fa/verify`, { code });
  }

  disableTwoFactor(password: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/settings/2fa/disable`, { password });
  }

  // Data export/import
  exportUserData(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/settings/export`, { responseType: 'blob' });
  }

  deleteAccount(password: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/settings/delete-account`, { password });
  }

  // Default settings
  getDefaultSettings(): UserSettings {
    return {
      userId: '',
      theme: 'auto',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateFormat: 'MM/dd/yyyy',
      timeFormat: '12h',
      notifications: {
        email: true,
        push: true,
        sms: false,
        inApp: true,
        messageNotifications: true,
        taskNotifications: true,
        projectUpdates: true,
        organizationAnnouncements: true,
        weeklyDigest: false,
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00'
        }
      },
      privacy: {
        profileVisibility: 'organization',
        showEmail: false,
        showPhone: false,
        showLocation: false,
        allowDirectMessages: true,
        showOnlineStatus: true,
        searchableProfile: true
      },
      organizationPrivacy: [],
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        fontSize: 'medium',
        screenReader: false,
        keyboardNavigation: false
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 30,
        loginNotifications: true,
        deviceTrust: false,
        passwordChangeRequired: false,
        lastPasswordChange: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}