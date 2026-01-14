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
  selector: 'app-quotations-api-docs',
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
        <h1>Quotations API Documentation</h1>
        <p>RESTful API for managing quotations, enquiries, and presentations</p>
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
        <mat-tab label="Quotations">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of quotationEndpoints">
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

        <mat-tab label="Enquiries">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of enquiryEndpoints">
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

        <mat-tab label="Presentations">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of presentationEndpoints">
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
export class QuotationsApiDocsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  
  baseUrl = `${window.location.origin}/api/quotations`;

  quotationEndpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/', description: 'Get all quotations', response: '[{ "_id": "...", "quotationNumber": "QT-001", ... }]' },
    { method: 'GET', path: '/:id', description: 'Get quotation by ID', response: '{ "_id": "...", "quotationNumber": "QT-001", ... }' },
    { method: 'GET', path: '/client/:clientId', description: 'Get quotations by client', response: '[{ "_id": "...", ... }]' },
    { method: 'POST', path: '/', description: 'Create quotation', response: '{ "_id": "...", ... }' },
    { method: 'PUT', path: '/:id', description: 'Update quotation', response: '{ "_id": "...", ... }' },
    { method: 'POST', path: '/:id/send', description: 'Send quotation', response: '{ "message": "Quotation sent" }' },
    { method: 'DELETE', path: '/:id', description: 'Delete quotation', response: '{ "message": "Quotation deleted" }' }
  ];

  enquiryEndpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/enquiries/all', description: 'Get all enquiries', response: '[{ "_id": "...", "enquiryNumber": "ENQ-001", ... }]' },
    { method: 'GET', path: '/enquiries/:id', description: 'Get enquiry by ID', response: '{ "_id": "...", ... }' },
    { method: 'POST', path: '/enquiries', description: 'Create enquiry', response: '{ "_id": "...", ... }' },
    { method: 'POST', path: '/cart', description: 'Create enquiry from website cart', response: '{ "_id": "...", "enquiryNumber": "ENQ-...", ... }' },
    { method: 'PUT', path: '/enquiries/:id', description: 'Update enquiry', response: '{ "_id": "...", ... }' },
    { method: 'DELETE', path: '/enquiries/:id', description: 'Delete enquiry', response: '{ "message": "Enquiry deleted" }' }
  ];

  presentationEndpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/presentations/all', description: 'Get all presentations', response: '[{ "_id": "...", "title": "...", ... }]' },
    { method: 'GET', path: '/presentations/:id', description: 'Get presentation by ID', response: '{ "_id": "...", ... }' },
    { method: 'POST', path: '/presentations', description: 'Create presentation', response: '{ "_id": "...", ... }' },
    { method: 'PUT', path: '/presentations/:id', description: 'Update presentation', response: '{ "_id": "...", ... }' },
    { method: 'POST', path: '/presentations/:id/generate', description: 'Generate PPTX', response: 'Binary PPTX file' },
    { method: 'DELETE', path: '/presentations/:id', description: 'Delete presentation', response: '{ "message": "Presentation deleted" }' }
  ];

  copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    this.snackBar.open('URL copied to clipboard', 'Close', { duration: 2000 });
  }

  ngOnInit() {
    // Update baseUrl with current domain
    this.baseUrl = `${window.location.origin}/api/quotations`;
  }

  navigateToApiKeys() {
    this.router.navigate(['/settings/api-keys']);
  }
}
