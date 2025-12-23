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

    getQuotations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`);
    }

    createQuotation(quote: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, quote);
    }

    updateQuotation(id: string, quote: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, quote);
    }
}
