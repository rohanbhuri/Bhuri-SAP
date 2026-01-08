import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getBrandConfig } from '../../brand.config';

@Injectable({
    providedIn: 'root'
})
export class QuotationsService {
    private get apiUrl() {
        return `${getBrandConfig().app.apiUrl}/quotations`;
    }

    constructor(private http: HttpClient) { }

    // Quotations
    getQuotations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`);
    }

    getQuotation(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    getQuotationsByClient(clientId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/client/${clientId}`);
    }

    createQuotation(quote: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, quote);
    }

    createFromEnquiry(enquiryId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/from-enquiry/${enquiryId}`, {});
    }

    updateQuotation(id: string, quote: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, quote);
    }

    submitForApproval(id: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/submit-approval`, {});
    }

    approveQuotation(id: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/approve`, {});
    }

    sendQuotation(id: string, via: 'email' | 'whatsapp'): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/send`, { via });
    }

    deleteQuotation(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    // Enquiries
    getEnquiries(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/enquiries/all`);
    }

    getEnquiry(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/enquiries/${id}`);
    }

    createEnquiry(enquiry: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/enquiries`, enquiry);
    }

    updateEnquiry(id: string, enquiry: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/enquiries/${id}`, enquiry);
    }

    deleteEnquiry(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/enquiries/${id}`);
    }
}
