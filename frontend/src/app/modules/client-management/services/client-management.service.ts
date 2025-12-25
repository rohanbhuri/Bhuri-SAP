import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrandConfigService } from '../../../services/brand-config.service';

@Injectable({
  providedIn: 'root'
})
export class ClientManagementService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  private get apiUrl() { return this.brandConfig.getApiUrl(); }

  createClientRequest(requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/client-management/requests`, requestData);
  }

  getAllClientRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/client-management/requests`);
  }

  getClientRequestById(requestId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/client-management/requests/${requestId}`);
  }

  updateClientRequest(requestId: string, updateData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/client-management/requests/${requestId}`, updateData);
  }

  convertToClient(requestId: string, conversionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/client-management/requests/${requestId}/convert`, conversionData);
  }

  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/client-management/clients`);
  }

  getClientById(clientId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/client-management/clients/${clientId}`);
  }

  updateClient(clientId: string, updateData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/client-management/clients/${clientId}`, updateData);
  }

  deleteClient(clientId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/client-management/clients/${clientId}`);
  }

  toggleClientStatus(clientId: string, isActive: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/client-management/clients/${clientId}/status`, { isActive });
  }
}
