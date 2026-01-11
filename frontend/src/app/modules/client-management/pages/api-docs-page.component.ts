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
  body?: string;
  response: string;
}

@Component({
  selector: 'app-client-management-api-docs',
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
        <h1>Client Management API Documentation</h1>
        <p>RESTful API for managing client requests and client accounts</p>
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
          <p><strong>Login/Logout:</strong> Use API key in header</p>
          <pre><code>X-API-Key: your_api_key_here</code></pre>
          <p><strong>Other Endpoints:</strong> Use JWT token from login response</p>
          <pre><code>Authorization: Bearer your_jwt_token_here</code></pre>
          <button mat-raised-button color="primary" (click)="navigateToApiKeys()">
            <mat-icon>vpn_key</mat-icon>
            Manage API Keys
          </button>
        </mat-card-content>
      </mat-card>

      <mat-tab-group class="endpoints-tabs">
        <mat-tab label="Authentication">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of authEndpoints">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-chip [class]="'method-' + endpoint.method.toLowerCase()">{{ endpoint.method }}</mat-chip>
                    <code>{{ endpoint.path }}</code>
                  </mat-panel-title>
                  <mat-panel-description>{{ endpoint.description }}</mat-panel-description>
                </mat-expansion-panel-header>
                <div class="endpoint-details">
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

        <mat-tab label="Requests">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of requestEndpoints">
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

        <mat-tab label="Clients">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of clientEndpoints">
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

        <mat-tab label="Security">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of securityEndpoints">
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
export class ClientManagementApiDocsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  
  baseUrl = '';

  ngOnInit() {
    this.baseUrl = `${window.location.origin}/api/client-management`;
  }

  authEndpoints: ApiEndpoint[] = [
    {
      method: 'POST',
      path: '/login',
      description: 'Login with email and password',
      body: '{ "email": "client@example.com", "password": "password123" }',
      response: '{ "access_token": "...", "user": {...}, "client": {...}, "roles": [...] }'
    },
    {
      method: 'POST',
      path: '/logout',
      description: 'Logout client',
      body: '{ "clientId": "..." }',
      response: '{ "success": true, "message": "Logged out successfully" }'
    }
  ];

  requestEndpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/requests', description: 'Get all client requests', response: '[{ "_id": "...", "clientName": "John", ... }]' },
    { method: 'GET', path: '/requests/:requestId', description: 'Get single client request', response: '{ "_id": "...", "clientName": "John", ... }' },
    { method: 'POST', path: '/requests', description: 'Create new client request', response: '{ "_id": "...", "clientName": "John", ... }' },
    { method: 'PUT', path: '/requests/:requestId', description: 'Update client request', response: '{ "_id": "...", "status": "in-progress", ... }' },
    { method: 'POST', path: '/requests/:requestId/convert', description: 'Convert request to client', response: '{ "message": "Request converted to client successfully", "clientId": "..." }' }
  ];

  clientEndpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/clients', description: 'Get all clients', response: '[{ "_id": "...", "companyName": "Acme Corp", ... }]' },
    { method: 'GET', path: '/clients/:clientId', description: 'Get single client', response: '{ "_id": "...", "companyName": "Acme Corp", ... }' },
    { method: 'PUT', path: '/clients/:clientId', description: 'Update client', response: '{ "_id": "...", "companyName": "Updated Corp", ... }' },
    { method: 'DELETE', path: '/clients/:clientId', description: 'Delete client', response: '{ "success": true, "message": "Client deleted successfully" }' },
    { method: 'PUT', path: '/clients/:clientId/status', description: 'Toggle client status', response: '{ "_id": "...", "isActive": false, ... }' }
  ];

  securityEndpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/clients/:clientId/security-settings', description: 'Get client security settings', response: '{ "requireTwoFactor": false, "sessionTimeout": 3600, ... }' },
    { method: 'PUT', path: '/clients/:clientId/security-settings', description: 'Update client security settings', response: '{ "requireTwoFactor": true, "sessionTimeout": 1800, ... }' },
    { method: 'POST', path: '/clients/:clientId/request-credentials', description: 'Request login credentials for client', response: '{ "success": true, "message": "Credentials request sent successfully", "credentials": {...} }' }
  ];

  copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    this.snackBar.open('URL copied to clipboard', 'Close', { duration: 2000 });
  }

  navigateToApiKeys() {
    this.router.navigate(['/settings/api-keys']);
  }
}
