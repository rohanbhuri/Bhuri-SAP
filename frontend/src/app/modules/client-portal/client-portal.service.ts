import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getBrandConfig } from '../../brand.config';

@Injectable({
    providedIn: 'root'
})
export class ClientPortalService {
    private apiUrl = getBrandConfig().app.apiUrl;

    constructor(private http: HttpClient) { }

    // Get quotations for current client (by email)
    getMyQuotations(): Observable<any[]> {
        // In real app, get email from auth service
        const userEmail = localStorage.getItem('userEmail') || '';
        return this.http.get<any[]>(`${this.apiUrl}/quotations/client/${userEmail}`);
    }

    // Get single quotation details
    getQuotation(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/quotations/${id}`);
    }

    // Accept quotation
    acceptQuotation(id: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/quotations/${id}/accept`, {});
    }

    // Reject quotation
    rejectQuotation(id: string, reason?: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/quotations/${id}/reject`, { reason });
    }

    // Get dashboard statistics
    getDashboardStats(): Observable<any> {
        const userEmail = localStorage.getItem('userEmail') || '';
        return this.http.get<any>(`${this.apiUrl}/quotations/client/${userEmail}/stats`);
    }
}
