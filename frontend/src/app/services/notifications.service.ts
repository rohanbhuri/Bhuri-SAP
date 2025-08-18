import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrandConfigService } from './brand-config.service';

export interface Notification {
  _id: string;
  type: 'module_request' | 'module_approved' | 'module_rejected' | 'system' | 'message';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  
  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  getNotifications(): Observable<Notification[]> {
    return this.http
      .get<Notification[]>(`${this.apiUrl}/notifications`)
      .pipe(catchError(() => of([])));
  }

  markAsRead(id: string): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/notifications/${id}/read`, {})
      .pipe(catchError(() => of({ success: true })));
  }


}