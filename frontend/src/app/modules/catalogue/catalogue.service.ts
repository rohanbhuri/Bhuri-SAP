import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
    getProducts(params: any = {}): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/products`, { params }).pipe(
            map(res => {
                if (res && res.items && Array.isArray(res.items) && Object.keys(params).length === 0) {
                    return res.items;
                }
                return res;
            })
        );
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

    // Analytics
    getAnalytics(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/analytics`);
    }

    // Export
    exportProducts(params: any = {}): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export/products`, { params, responseType: 'blob' });
    }

    exportCategories(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export/categories`, { responseType: 'blob' });
    }

    exportCollections(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export/collections`, { responseType: 'blob' });
    }

    exportDesigners(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export/designers`, { responseType: 'blob' });
    }

    exportAll(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export/all`, { responseType: 'blob' });
    }

    // Designers
    getDesigners(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/designers`);
    }

    getDesigner(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/designers/${id}`);
    }

    createDesigner(designer: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/designers`, designer);
    }

    updateDesigner(id: string, designer: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/designers/${id}`, designer);
    }

    deleteDesigner(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/designers/${id}`);
    }

    uploadDesignerProfile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post<any>(`${this.apiUrl}/designers/upload-profile`, formData);
    }

    uploadDesignerPortfolio(files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        return this.http.post<any>(`${this.apiUrl}/designers/upload-portfolio`, formData);
    }

    // Product Media Upload
    uploadProductImages(files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        const url = `${this.apiUrl}/products/upload-images`;
        console.log('Uploading images to:', url);
        console.log('Files:', files.map(f => f.name));
        return this.http.post<any>(url, formData);
    }

    uploadProductVideo(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('video', file);
        const url = `${this.apiUrl}/products/upload-video`;
        console.log('Uploading video to:', url);
        return this.http.post<any>(url, formData);
    }

    uploadProduct3DModel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('model', file);
        const url = `${this.apiUrl}/products/upload-model`;
        console.log('Uploading 3D model to:', url);
        return this.http.post<any>(url, formData);
    }

    uploadProductTechnicalSheet(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('technicalSheet', file);
        const url = `${this.apiUrl}/products/upload-technical-sheet`;
        console.log('Uploading technical sheet to:', url);
        return this.http.post<any>(url, formData);
    }

    trackTechnicalSheetDownload(productId: string, email: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/products/${productId}/track-technical-sheet-download`, { email });
    }

    getTechnicalSheetDownloads(productId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products/${productId}/technical-sheet-downloads`);
    }

    getAllTechnicalSheetDownloads(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/technical-sheet-downloads`);
    }

    checkProductCodeExists(productCode: string, excludeId?: string): Observable<{ exists: boolean }> {
        let url = `${this.apiUrl}/products/check-code/${productCode}`;
        if (excludeId) {
            url += `?excludeId=${excludeId}`;
        }
        return this.http.get<{ exists: boolean }>(url);
    }

    // Import/Export
    downloadProductTemplate(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/template/products`, { responseType: 'blob' });
    }

    importProducts(file: File): Observable<{ success: number; failed: number; errors: string[] }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ success: number; failed: number; errors: string[] }>(`${this.apiUrl}/import/products`, formData);
    }

    validateProducts(file: File): Observable<{ totalRows: number; toAdd: number; toUpdate: number; errors: string[] }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ totalRows: number; toAdd: number; toUpdate: number; errors: string[] }>(`${this.apiUrl}/import/validate`, formData);
    }
}
