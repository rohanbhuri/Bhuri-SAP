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
  selector: 'app-user-management-api-docs',
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
        <h1>User Management API Documentation</h1>
        <p>RESTful API for managing users, roles, permissions, and organizations</p>
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

        <mat-tab label="Users">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of userEndpoints">
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
                  <div class="response">
                    <h4>Response</h4>
                    <pre><code>{{ endpoint.response }}</code></pre>
                  </div>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </div>
        </mat-tab>

        <mat-tab label="Roles">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of roleEndpoints">
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

        <mat-tab label="Permissions">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel *ngFor="let endpoint of permissionEndpoints">
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
    .type { background: #e3f2fd; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    .required { color: #f44336; font-weight: 500; }
    .optional { color: #999; }
    .endpoint-details pre { background: #f5f5f5; padding: 16px; border-radius: 4px; overflow-x: auto; }
    .endpoint-details pre code { font-size: 13px; line-height: 1.6; }
  `]
})
export class UserManagementApiDocsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  
  baseUrl = '';

  ngOnInit() {
    this.baseUrl = `${window.location.origin}/api/user-management`;
  }

  authEndpoints: ApiEndpoint[] = [
    {
      method: 'POST',
      path: '/login',
      description: 'Login with email and password',
      body: '{ "email": "user@example.com", "password": "password123" }',
      response: '{ "access_token": "...", "user": {...}, "roles": [...] }'
    },
    {
      method: 'POST',
      path: '/logout',
      description: 'Logout user',
      body: '{ "userId": "..." }',
      response: '{ "success": true, "message": "Logged out successfully" }'
    },
    {
      method: 'POST',
      path: '/forgot-password',
      description: 'Request password reset link via email',
      body: '{ "email": "user@example.com" }',
      response: '{ "success": true, "message": "If the email exists in our system, a password reset link has been sent." }'
    },
    {
      method: 'POST',
      path: '/change-password',
      description: 'Reset password using token from email (one-time use)',
      body: '{ "token": "reset_token_from_email", "newPassword": "newPassword123" }',
      response: '{ "success": true, "message": "Password has been reset successfully. You can now login with your new password." }'
    }
  ];

  userEndpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/users',
      description: 'Get all users',
      response: '[{ "_id": "...", "firstName": "John", "email": "john@example.com", ... }]'
    },
    {
      method: 'GET',
      path: '/users/:userId',
      description: 'Get single user',
      params: [{ name: 'userId', type: 'string', required: true, description: 'User ID' }],
      response: '{ "_id": "...", "firstName": "John", "email": "john@example.com", ... }'
    },
    {
      method: 'POST',
      path: '/users',
      description: 'Create new user',
      response: '{ "_id": "...", "firstName": "John", ... }'
    },
    {
      method: 'PUT',
      path: '/users/:userId',
      description: 'Update user',
      response: '{ "_id": "...", "firstName": "Jane", ... }'
    },
    {
      method: 'DELETE',
      path: '/users/:userId',
      description: 'Delete user',
      response: '{ "success": true, "message": "User deleted successfully" }'
    }
  ];

  roleEndpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/roles',
      description: 'Get all roles',
      response: '[{ "_id": "...", "name": "Admin", "type": "admin", ... }]'
    },
    {
      method: 'POST',
      path: '/roles',
      description: 'Create new role',
      response: '{ "_id": "...", "name": "Manager", ... }'
    },
    {
      method: 'PUT',
      path: '/roles/:roleId',
      description: 'Update role',
      response: '{ "_id": "...", "name": "Manager", ... }'
    },
    {
      method: 'DELETE',
      path: '/roles/:roleId',
      description: 'Delete role',
      response: '{ "success": true, "message": "Role deleted successfully" }'
    }
  ];

  permissionEndpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/permissions',
      description: 'Get all permissions',
      response: '[{ "_id": "...", "module": "user-management", "action": "read", ... }]'
    },
    {
      method: 'POST',
      path: '/permissions',
      description: 'Create new permission',
      response: '{ "_id": "...", "module": "user-management", ... }'
    },
    {
      method: 'PUT',
      path: '/permissions/:permissionId',
      description: 'Update permission',
      response: '{ "_id": "...", "module": "user-management", ... }'
    },
    {
      method: 'DELETE',
      path: '/permissions/:permissionId',
      description: 'Delete permission',
      response: '{ "success": true, "message": "Permission deleted successfully" }'
    }
  ];

  copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    this.snackBar.open('URL copied to clipboard', 'Close', { duration: 2000 });
  }

  navigateToApiKeys() {
    this.router.navigate(['/settings/api-keys']);
  }
}
