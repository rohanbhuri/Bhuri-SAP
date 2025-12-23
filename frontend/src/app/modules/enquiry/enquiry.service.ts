import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getBrandConfig } from '../../brand.config';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private get apiUrl() {
    return `${getBrandConfig().app.apiUrl}/enquiries`;
  }

  constructor(private http: HttpClient) {}

  createEnquiry(enquiry: any): Observable<any> {
    return this.http.post(this.apiUrl, enquiry);
  }

  getEnquiries(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEnquiry(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }

  generateQuotation(id: string, approvedBy: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/generate-quotation`, { approvedBy });
  }
}