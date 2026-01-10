import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrandConfigService } from '../../services/brand-config.service';

@Injectable({ providedIn: 'root' })
export class CrmFunnelService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  
  private get apiUrl() {
    return `${this.brandConfig.getApiUrl()}/crm/funnel`;
  }

  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getPipeline(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pipeline`);
  }

  getContactHistory(contactId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacts/${contactId}/history`);
  }

  getEnquiries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/enquiries`);
  }

  createEnquiryFromContact(contactId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/enquiries/from-contact/${contactId}`, data);
  }

  markEnquiryLost(enquiryId: string, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/enquiries/${enquiryId}/mark-lost`, { reason });
  }

  markEnquiryOnHold(enquiryId: string, followUpDate: Date): Observable<any> {
    return this.http.put(`${this.apiUrl}/enquiries/${enquiryId}/mark-on-hold`, { followUpDate });
  }

  getPresentations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/presentations`);
  }

  createPresentationFromEnquiry(enquiryId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/presentations/from-enquiry/${enquiryId}`, data);
  }

  sendPresentation(presentationId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/presentations/${presentationId}/send`, {});
  }

  getQuotations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/quotations`);
  }

  createQuotationFromEnquiry(enquiryId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/quotations/from-enquiry/${enquiryId}`, data);
  }

  acceptQuotation(quotationId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/quotations/${quotationId}/accept`, {});
  }

  declineQuotation(quotationId: string, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/quotations/${quotationId}/decline`, { reason });
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  updateOrderPaymentStatus(orderId: string, paymentStatus: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/payment-status`, { paymentStatus });
  }

  updateOrderDeliveryStatus(orderId: string, deliveryStatus: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/delivery-status`, { deliveryStatus });
  }
}
