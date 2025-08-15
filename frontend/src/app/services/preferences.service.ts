import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserPreferences {
  theme: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getUserPreferences(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(`${this.apiUrl}/preferences`);
  }

  saveUserPreferences(preferences: UserPreferences): Observable<UserPreferences> {
    return this.http.post<UserPreferences>(`${this.apiUrl}/preferences`, preferences);
  }
}