import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from '../../../components/navbar.component';
import { BottomNavbarComponent } from '../../../components/bottom-navbar.component';

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  response: string;
}

@Component({
  selector: 'app-cms-api-docs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatExpansionModule,
    MatChipsModule,
    MatSnackBarModule,
    NavbarComponent,
    BottomNavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="api-docs">
      <div class="docs-header">
        <h1>CMS API Documentation</h1>
        <p>RESTful API for managing pages, blog posts, and menus</p>
        <div class="base-url">
          <strong>Base URL:</strong> <code>{{ baseUrl }}</code>
          <button mat-icon-button (click)="copyUrl(baseUrl)">
            <mat-icon>content_copy</mat-icon>
          </button>
        </div>
      </div>

      <mat-card class="auth-section">
        <mat-card-header>
          <mat-icon mat-card-avatar>security</mat-icon>
          <mat-card-title>Authentication</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>All API requests require an API key. Include it in the request header:</p>
          <pre><code>X-API-Key: your_api_key_here</code></pre>
          <p>Or as a query parameter:</p>
          <pre><code>?apiKey=your_api_key_here</code></pre>
          <button mat-raised-button color="primary" (click)="navigateToApiKeys()">
            <mat-icon>vpn_key</mat-icon>
            Manage API Keys
          </button>
        </mat-card-content>
      </mat-card>

      <mat-tab-group class="endpoints-tabs">
        <mat-tab label="Pages">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of pageEndpoints">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-chip [class]="'method-' + endpoint.method.toLowerCase()">{{ endpoint.method }}</mat-chip>
                    <code>{{ endpoint.path }}</code>
                  </mat-panel-title>
                  <mat-panel-description>{{ endpoint.description }}</mat-panel-description>
                </mat-expansion-panel-header>
                <div class="endpoint-details">
                  <div class="response">
                    <h4>Response</h4>
                    <pre><code>{{ endpoint.response }}</code></pre>
                  </div>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </div>
        </mat-tab>

        <mat-tab label="Blog Posts">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of blogEndpoints">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-chip [class]="'method-' + endpoint.method.toLowerCase()">{{ endpoint.method }}</mat-chip>
                    <code>{{ endpoint.path }}</code>
                  </mat-panel-title>
                  <mat-panel-description>{{ endpoint.description }}</mat-panel-description>
                </mat-expansion-panel-header>
                <div class="endpoint-details">
                  <div class="response">
                    <h4>Response</h4>
                    <pre><code>{{ endpoint.response }}</code></pre>
                  </div>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </div>
        </mat-tab>

        <mat-tab label="Menus">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of menuEndpoints">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-chip [class]="'method-' + endpoint.method.toLowerCase()">{{ endpoint.method }}</mat-chip>
                    <code>{{ endpoint.path }}</code>
                  </mat-panel-title>
                  <mat-panel-description>{{ endpoint.description }}</mat-panel-description>
                </mat-expansion-panel-header>
                <div class="endpoint-details">
                  <div class="response">
                    <h4>Response</h4>
                    <pre><code>{{ endpoint.response }}</code></pre>
                  </div>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .api-docs { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .docs-header { margin-bottom: 32px; }
    .docs-header h1 { margin: 0 0 8px; }
    .docs-header p { color: #666; margin: 0 0 16px; }
    .base-url { display: flex; align-items: center; gap: 8px; padding: 12px; background: #f5f5f5; border-radius: 4px; }
    .base-url code { flex: 1; font-size: 14px; }
    .auth-section { margin-bottom: 24px; }
    .auth-section pre { background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto; }
    .endpoints-tabs { margin-top: 24px; }
    .tab-content { padding: 24px 0; }
    mat-expansion-panel { margin-bottom: 8px; }
    mat-panel-title { display: flex; align-items: center; gap: 12px; }
    mat-panel-title code { font-size: 14px; }
    .method-get { background: #4caf50; color: white; }
    .method-post { background: #2196f3; color: white; }
    .method-put { background: #ff9800; color: white; }
    .method-delete { background: #f44336; color: white; }
    .endpoint-details { padding: 16px 0; }
    .endpoint-details h4 { margin: 16px 0 8px; }
    .endpoint-details pre { background: #f5f5f5; padding: 16px; border-radius: 4px; overflow-x: auto; }
    .endpoint-details pre code { font-size: 13px; line-height: 1.6; }
  `]
})
export class CmsApiDocsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  
  baseUrl = '';

  ngOnInit() {
    this.baseUrl = `${window.location.origin}/api/cms`;
  }

  pageEndpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/pages', description: 'Get all pages', response: '[{ "_id": "...", "title": "About Us", "slug": "about-us", ... }]' },
    { method: 'GET', path: '/pages/:id', description: 'Get page by ID', response: '{ "_id": "...", "title": "About Us", ... }' },
    { method: 'GET', path: '/slug/:slug', description: 'Get page by slug', response: '{ "_id": "...", "title": "About Us", ... }' },
    { method: 'POST', path: '/pages', description: 'Create page', response: '{ "_id": "...", ... }' },
    { method: 'PUT', path: '/pages/:id', description: 'Update page', response: '{ "_id": "...", ... }' },
    { method: 'DELETE', path: '/pages/:id', description: 'Delete page', response: '{ "message": "Page deleted" }' }
  ];

  blogEndpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/blogs', description: 'Get all blog posts', response: '[{ "_id": "...", "title": "Blog Title", "slug": "blog-title", ... }]' },
    { method: 'GET', path: '/blogs/:id', description: 'Get blog post by ID', response: '{ "_id": "...", "title": "Blog Title", ... }' },
    { method: 'GET', path: '/blog/slug/:slug', description: 'Get blog post by slug', response: '{ "_id": "...", "title": "Blog Title", ... }' },
    { method: 'POST', path: '/blogs', description: 'Create blog post', response: '{ "_id": "...", ... }' },
    { method: 'PUT', path: '/blogs/:id', description: 'Update blog post', response: '{ "_id": "...", ... }' },
    { method: 'DELETE', path: '/blogs/:id', description: 'Delete blog post', response: '{ "message": "Blog deleted" }' }
  ];

  menuEndpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/menus', description: 'Get all menus', response: '[{ "_id": "...", "name": "Main Navigation", "location": "header", ... }]' },
    { method: 'GET', path: '/menus/:id', description: 'Get menu by ID', response: '{ "_id": "...", "name": "Main Navigation", ... }' },
    { method: 'GET', path: '/menu/location/:location', description: 'Get menu by location', response: '{ "_id": "...", "name": "Main Navigation", ... }' },
    { method: 'POST', path: '/menus', description: 'Create menu', response: '{ "_id": "...", ... }' },
    { method: 'PUT', path: '/menus/:id', description: 'Update menu', response: '{ "_id": "...", ... }' },
    { method: 'DELETE', path: '/menus/:id', description: 'Delete menu', response: '{ "message": "Menu deleted" }' }
  ];

  copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    this.snackBar.open('URL copied to clipboard', 'Close', { duration: 2000 });
  }

  navigateToApiKeys() {
    this.router.navigate(['/settings/api-keys']);
  }
}
