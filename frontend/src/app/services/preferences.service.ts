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

  getUserPreferences(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(`${this.apiUrl}/preferences`);
  }

  saveUserPreferences(preferences: Partial<UserPreferences>): Observable<UserPreferences> {
    return this.http.post<UserPreferences>(`${this.apiUrl}/preferences`, preferences);
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