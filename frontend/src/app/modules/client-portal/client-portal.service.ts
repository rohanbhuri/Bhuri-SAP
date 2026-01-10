import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { getBrandConfig } from '../../brand.config';

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  specifications?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ClientPortalService {
    private apiUrl = getBrandConfig().app.apiUrl;
    private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
    cart$ = this.cartSubject.asObservable();

    constructor(private http: HttpClient) { }

    // Cart Management
    private loadCart(): CartItem[] {
        const cart = localStorage.getItem('clientCart');
        return cart ? JSON.parse(cart) : [];
    }

    private saveCart(cart: CartItem[]): void {
        localStorage.setItem('clientCart', JSON.stringify(cart));
        this.cartSubject.next(cart);
    }

    addToCart(item: CartItem): void {
        const cart = this.loadCart();
        const existingIndex = cart.findIndex(i => i.productId === item.productId);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += item.quantity;
        } else {
            cart.push(item);
        }
        this.saveCart(cart);
    }

    removeFromCart(productId: string): void {
        const cart = this.loadCart().filter(i => i.productId !== productId);
        this.saveCart(cart);
    }

    updateCartItem(productId: string, quantity: number): void {
        const cart = this.loadCart();
        const item = cart.find(i => i.productId === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCart(cart);
        }
    }

    clearCart(): void {
        this.saveCart([]);
    }

    getCart(): CartItem[] {
        return this.loadCart();
    }

    // Submit enquiry from cart
    submitEnquiry(clientData: any): Observable<any> {
        const cart = this.loadCart();
        return this.http.post<any>(`${this.apiUrl}/quotations/enquiries`, {
            ...clientData,
            items: cart
        });
    }

    // Get quotations for current client
    getMyQuotations(clientId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/quotations/client/${clientId}`);
    }

    getQuotation(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/quotations/${id}`);
    }

    acceptQuotation(id: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/crm/funnel/quotations/${id}/accept`, {});
    }

    rejectQuotation(id: string, reason?: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/crm/funnel/quotations/${id}/decline`, { reason });
    }
}
