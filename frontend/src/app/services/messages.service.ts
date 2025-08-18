import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrandConfigService } from './brand-config.service';

export interface OrgMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface OrgWithMembers {
  organizationId: string;
  organizationName: string;
  organizationCode: string;
  members: OrgMember[];
}

@Injectable({ providedIn: 'root' })
export class MessagesApiService {
  private http = inject(HttpClient);
  private brand = inject(BrandConfigService);
  private get api() {
    return this.brand.getApiUrl();
  }

  getOrganizationsWithMembers(): Observable<OrgWithMembers[]> {
    return this.http.get<OrgWithMembers[]>(`${this.api}/messages/org-members`);
  }

  getOrCreateDM(organizationId: string, otherUserId: string): Observable<any> {
    return this.http.post(
      `${this.api}/messages/dm/${organizationId}/${otherUserId}`,
      {}
    );
  }

  listConversations(organizationId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}/messages/conversations/${organizationId}`
    );
  }

  listMessages(
    conversationId: string,
    limit = 50,
    before?: string
  ): Observable<any[]> {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    if (before) params.set('before', before);
    return this.http.get<any[]>(
      `${this.api}/messages/chat/${conversationId}?${params.toString()}`
    );
  }

  sendMessage(conversationId: string, content: string): Observable<any> {
    return this.http.post(`${this.api}/messages/chat/${conversationId}`, {
      content,
    });
  }
}
