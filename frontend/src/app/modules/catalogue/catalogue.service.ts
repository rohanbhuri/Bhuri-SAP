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

    // Upload
    uploadMedia(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        // Remove '/api' from apiUrl to get base host, then append /uploads endpoint or api endpoint
        // Adjusting to use full API path if needed, but backend serves uploads statically
        // Actually Upload is an API endpoint: CMS Media Controller
        // Path: /api/cms/media/upload

        // getBrandConfig().app.apiUrl is http://localhost:3002/api
        // So we can use that base.
        const uploadUrl = `${getBrandConfig().app.apiUrl.replace('/catalogue', '')}/cms/media/upload`;
        return this.http.post<any>(uploadUrl, formData);
    }
}
