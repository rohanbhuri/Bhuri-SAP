import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BrandConfigService } from './brand-config.service';

export interface UserPreferences {
  userId: string;
  theme: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  pinnedModules: string[];
  dashboardPreferences: {
    widgets?: {
      id: string;
      size: 's' | 'm' | 'l';
      position: number;
    }[];
  };
}

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  
  private pinnedModulesSubject = new BehaviorSubject<string[]>([]);
  public pinnedModules$ = this.pinnedModulesSubject.asObservable();

  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getUserPreferences(): Observable<UserPreferences | null> {
    return this.http.get<UserPreferences>(`${this.apiUrl}/preferences`);
  }

  saveUserPreferences(preferences: Partial<UserPreferences>): Observable<UserPreferences> {
    const payload: any = {};
    if (preferences.theme) payload.theme = preferences.theme;
    if (preferences.primaryColor) payload.primaryColor = preferences.primaryColor;
    if (preferences.accentColor) payload.accentColor = preferences.accentColor;
    if (preferences.secondaryColor) payload.secondaryColor = preferences.secondaryColor;
    if (preferences.pinnedModules) payload.pinnedModules = preferences.pinnedModules;
    if (preferences.dashboardPreferences) payload.dashboardPreferences = preferences.dashboardPreferences;
    
    return this.http.post<UserPreferences>(`${this.apiUrl}/preferences`, payload);
  }

  togglePinnedModule(moduleId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/preferences/toggle-pinned-module`, { moduleId });
  }

  saveDashboardPreferences(preferences: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/preferences/dashboard`, preferences);
  }

  updatePinnedModules(pinnedModules: string[]) {
    this.pinnedModulesSubject.next(pinnedModules);
  }
}