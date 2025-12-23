import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getBrandConfig } from '../../brand.config';

@Injectable({
    providedIn: 'root'
})
export class CmsService {
    private get apiUrl() {
        return `${getBrandConfig().app.apiUrl}/cms`;
    }

    constructor(private http: HttpClient) { }

    // ===== PAGES =====
    getPages(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/pages`);
    }

    getPage(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/pages/${id}`);
    }

    createPage(page: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/pages`, page);
    }

    updatePage(id: string, page: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/pages/${id}`, page);
    }

    deletePage(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/pages/${id}`);
    }

    // ===== BLOGS =====
    getBlogs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/blogs`);
    }

    getBlog(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/blogs/${id}`);
    }

    getBlogBySlug(slug: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/blog/slug/${slug}`);
    }

    createBlog(blog: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/blogs`, blog);
    }

    updateBlog(id: string, blog: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/blogs/${id}`, blog);
    }

    deleteBlog(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/blogs/${id}`);
    }

    // ===== MENUS =====
    getMenus(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/menus`);
    }

    getMenu(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/menus/${id}`);
    }

    getMenuByLocation(location: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/menu/location/${location}`);
    }

    createMenu(menu: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/menus`, menu);
    }

    updateMenu(id: string, menu: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/menus/${id}`, menu);
    }

    deleteMenu(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/menus/${id}`);
    }
}
