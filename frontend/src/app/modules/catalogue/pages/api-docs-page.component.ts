import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  params?: { name: string; type: string; required: boolean; description: string }[];
  body?: string;
  response: string;
}

@Component({
  selector: 'app-catalogue-api-docs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
        <h1>Catalogue API Documentation</h1>
        <p>RESTful API for managing products, categories, collections, and designers</p>
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
        <mat-tab label="Products">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of productEndpoints">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-chip [class]="'method-' + endpoint.method.toLowerCase()">{{ endpoint.method }}</mat-chip>
                    <code>{{ endpoint.path }}</code>
                  </mat-panel-title>
                  <mat-panel-description>{{ endpoint.description }}</mat-panel-description>
                </mat-expansion-panel-header>
                <div class="endpoint-details">
                  <div *ngIf="endpoint.params?.length" class="params">
                    <h4>Parameters</h4>
                    <table>
                      <tr *ngFor="let param of endpoint.params">
                        <td><code>{{ param.name }}</code></td>
                        <td><span class="type">{{ param.type }}</span></td>
                        <td><span [class]="param.required ? 'required' : 'optional'">{{ param.required ? 'Required' : 'Optional' }}</span></td>
                        <td>{{ param.description }}</td>
                      </tr>
                    </table>
                  </div>
                  <div *ngIf="endpoint.body" class="body">
                    <h4>Request Body</h4>
                    <pre><code>{{ endpoint.body }}</code></pre>
                  </div>
                  <div class="response">
                    <h4>Response</h4>
                    <pre><code>{{ endpoint.response }}</code></pre>
                  </div>
                  <button mat-stroked-button (click)="copyExample(endpoint)">
                    <mat-icon>content_copy</mat-icon>
                    Copy cURL Example
                  </button>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </div>
        </mat-tab>

        <mat-tab label="Categories">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of categoryEndpoints">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-chip [class]="'method-' + endpoint.method.toLowerCase()">{{ endpoint.method }}</mat-chip>
                    <code>{{ endpoint.path }}</code>
                  </mat-panel-title>
                  <mat-panel-description>{{ endpoint.description }}</mat-panel-description>
                </mat-expansion-panel-header>
                <div class="endpoint-details">
                  <div *ngIf="endpoint.params?.length" class="params">
                    <h4>Parameters</h4>
                    <table>
                      <tr *ngFor="let param of endpoint.params">
                        <td><code>{{ param.name }}</code></td>
                        <td><span class="type">{{ param.type }}</span></td>
                        <td><span [class]="param.required ? 'required' : 'optional'">{{ param.required ? 'Required' : 'Optional' }}</span></td>
                        <td>{{ param.description }}</td>
                      </tr>
                    </table>
                  </div>
                  <div *ngIf="endpoint.body" class="body">
                    <h4>Request Body</h4>
                    <pre><code>{{ endpoint.body }}</code></pre>
                  </div>
                  <div class="response">
                    <h4>Response</h4>
                    <pre><code>{{ endpoint.response }}</code></pre>
                  </div>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </div>
        </mat-tab>

        <mat-tab label="Collections">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of collectionEndpoints">
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

        <mat-tab label="Designers">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of designerEndpoints">
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
    .endpoint-details table { width: 100%; border-collapse: collapse; }
    .endpoint-details table td { padding: 8px; border-bottom: 1px solid #eee; }
    .endpoint-details table td:first-child { width: 150px; }
    .endpoint-details table td:nth-child(2) { width: 100px; }
    .endpoint-details table td:nth-child(3) { width: 100px; }
    .type { background: #e3f2fd; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    .required { color: #f44336; font-weight: 500; }
    .optional { color: #999; }
    .endpoint-details pre { background: #f5f5f5; padding: 16px; border-radius: 4px; overflow-x: auto; }
    .endpoint-details pre code { font-size: 13px; line-height: 1.6; }
  `]
})
export class CatalogueApiDocsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  
  baseUrl = '';

  ngOnInit() {
    this.baseUrl = `${window.location.origin}/api/catalogue`;
  }

  productEndpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/products',
      description: 'Get all products',
      response: '[{ "_id": "...", "name": "Product Name", "productCode": "PRD001", "basePrice": 1000, ... }]'
    },
    {
      method: 'GET',
      path: '/products/:id',
      description: 'Get a single product by ID',
      params: [{ name: 'id', type: 'string', required: true, description: 'Product ID' }],
      response: '{ "_id": "...", "name": "Product Name", "productCode": "PRD001", ... }'
    },
    {
      method: 'POST',
      path: '/products',
      description: 'Create a new product',
      body: '{\n  "name": "Product Name",\n  "productCode": "PRD001",\n  "basePrice": 1000,\n  "currency": "USD",\n  "categoryId": "...",\n  "isPublished": true\n}',
      response: '{ "_id": "...", "name": "Product Name", ... }'
    },
    {
      method: 'PUT',
      path: '/products/:id',
      description: 'Update a product',
      params: [{ name: 'id', type: 'string', required: true, description: 'Product ID' }],
      body: '{ "name": "Updated Name", "basePrice": 1200 }',
      response: '{ "_id": "...", "name": "Updated Name", ... }'
    },
    {
      method: 'DELETE',
      path: '/products/:id',
      description: 'Delete a product',
      params: [{ name: 'id', type: 'string', required: true, description: 'Product ID' }],
      response: '{ "message": "Product deleted successfully" }'
    }
  ];

  categoryEndpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/categories',
      description: 'Get all categories',
      response: '[{ "_id": "...", "name": "Category Name", "slug": "category-name", ... }]'
    },
    {
      method: 'GET',
      path: '/categories/:id',
      description: 'Get a single category',
      params: [{ name: 'id', type: 'string', required: true, description: 'Category ID' }],
      response: '{ "_id": "...", "name": "Category Name", ... }'
    },
    {
      method: 'POST',
      path: '/categories',
      description: 'Create a new category',
      body: '{ "name": "Category Name", "slug": "category-name", "isActive": true }',
      response: '{ "_id": "...", "name": "Category Name", ... }'
    },
    {
      method: 'PUT',
      path: '/categories/:id',
      description: 'Update a category',
      response: '{ "_id": "...", "name": "Updated Category", ... }'
    },
    {
      method: 'DELETE',
      path: '/categories/:id',
      description: 'Delete a category',
      response: '{ "message": "Category deleted successfully" }'
    }
  ];

  collectionEndpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/collections',
      description: 'Get all collections',
      response: '[{ "_id": "...", "name": "Collection Name", ... }]'
    },
    {
      method: 'POST',
      path: '/collections',
      description: 'Create a new collection',
      response: '{ "_id": "...", "name": "Collection Name", ... }'
    }
  ];

  designerEndpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/designers',
      description: 'Get all designers',
      response: '[{ "_id": "...", "name": "Designer Name", ... }]'
    },
    {
      method: 'POST',
      path: '/designers',
      description: 'Create a new designer',
      response: '{ "_id": "...", "name": "Designer Name", ... }'
    }
  ];

  copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    this.snackBar.open('URL copied to clipboard', 'Close', { duration: 2000 });
  }

  copyExample(endpoint: ApiEndpoint) {
    const curl = `curl -X ${endpoint.method} "${this.baseUrl}${endpoint.path}" \\\n  -H "X-API-Key: your_api_key_here"${endpoint.body ? ` \\\n  -H "Content-Type: application/json" \\\n  -d '${endpoint.body.replace(/\n/g, '')}'` : ''}`;
    navigator.clipboard.writeText(curl);
    this.snackBar.open('cURL example copied', 'Close', { duration: 2000 });
  }

  navigateToApiKeys() {
    this.router.navigate(['/settings/api-keys']);
  }
}
