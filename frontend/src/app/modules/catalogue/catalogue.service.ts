import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getBrandConfig } from '../../brand.config';

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {
    private get apiUrl() {
        return `${getBrandConfig().app.apiUrl}/catalogue`;
    }

    constructor(private http: HttpClient) { }

    // Products
    getProducts(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products`);
    }

    getProduct(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/products/${id}`);
    }

    createProduct(product: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/products`, product);
    }

    updateProduct(id: string, product: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/products/${id}`, product);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
    }

    // Categories
    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/categories`);
    }

    getCategory(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/categories/${id}`);
    }

    createCategory(category: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/categories`, category);
    }

    updateCategory(id: string, category: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/categories/${id}`, category);
    }

    deleteCategory(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
    }

    // Collections
    getCollections(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/collections`);
    }

    getCollection(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/collections/${id}`);
    }

    createCollection(collection: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/collections`, collection);
    }

    updateCollection(id: string, collection: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/collections/${id}`, collection);
    }

    deleteCollection(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/collections/${id}`);
    }

    // Upload
    uploadMedia(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        const uploadUrl = `${getBrandConfig().app.apiUrl.replace('/catalogue', '')}/cms/media/upload`;
        return this.http.post<any>(uploadUrl, formData);
    }
}
