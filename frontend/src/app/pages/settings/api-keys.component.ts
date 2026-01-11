import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

interface ApiKey {
  _id: string;
  name: string;
  token: string;
  expiresAt: Date;
  isActive: boolean;
  allowedDomains: string[];
  usageCount: number;
  createdAt: Date;
  lastUsedAt: Date;
}

@Component({
  selector: 'app-api-keys',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSnackBarModule,
    NavbarComponent,
    BottomNavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <div>
          <h1>API Keys</h1>
          <p>Manage API keys for external integrations</p>
        </div>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Create API Key
        </button>
      </div>

      <mat-card *ngFor="let key of apiKeys()">
        <mat-card-header>
          <mat-icon mat-card-avatar>vpn_key</mat-icon>
          <mat-card-title>{{ key.name }}</mat-card-title>
          <mat-card-subtitle>
            Created: {{ key.createdAt | date:'short' }} | 
            Expires: {{ key.expiresAt | date:'short' }} |
            Used: {{ key.usageCount }} times
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="token-display">
            <code>{{ key.token }}</code>
            <button mat-icon-button (click)="copyToken(key.token)">
              <mat-icon>content_copy</mat-icon>
            </button>
          </div>
          <div class="domains" *ngIf="key.allowedDomains?.length">
            <strong>Allowed Domains:</strong>
            <mat-chip-set>
              <mat-chip *ngFor="let domain of key.allowedDomains">{{ domain }}</mat-chip>
            </mat-chip-set>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="warn" (click)="deleteKey(key._id)">
            <mat-icon>delete</mat-icon>
            Delete
          </button>
          <button mat-button (click)="toggleActive(key)">
            <mat-icon>{{ key.isActive ? 'block' : 'check_circle' }}</mat-icon>
            {{ key.isActive ? 'Deactivate' : 'Activate' }}
          </button>
        </mat-card-actions>
      </mat-card>

      <div *ngIf="!apiKeys().length" class="empty-state">
        <mat-icon>vpn_key</mat-icon>
        <h3>No API Keys</h3>
        <p>Create an API key to integrate with external applications</p>
      </div>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .page { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { margin: 0; }
    .page-header p { margin: 4px 0 0; color: #666; }
    mat-card { margin-bottom: 16px; }
    .token-display { display: flex; align-items: center; gap: 8px; margin: 16px 0; }
    .token-display code { flex: 1; padding: 12px; background: #f5f5f5; border-radius: 4px; font-family: monospace; }
    .domains { margin-top: 16px; }
    .empty-state { text-align: center; padding: 60px 20px; color: #999; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; }
  `]
})
export class ApiKeysComponent implements OnInit {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  apiKeys = signal<ApiKey[]>([]);

  ngOnInit() {
    this.loadApiKeys();
  }

  loadApiKeys() {
    this.http.get<ApiKey[]>(`${environment.apiUrl}/api-keys`).subscribe({
      next: (keys) => this.apiKeys.set(keys),
      error: (err) => {
        console.error('Failed to load API keys:', err);
        this.snackBar.open('Failed to load API keys', 'Close', { duration: 3000 });
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateApiKeyDialog, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post<ApiKey>(`${environment.apiUrl}/api-keys`, result).subscribe({
          next: () => {
            this.loadApiKeys();
            this.snackBar.open('API Key created successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            console.error('Failed to create API key:', err);
            this.snackBar.open(`Failed to create API key: ${err.error?.message || err.message}`, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  copyToken(token: string) {
    navigator.clipboard.writeText(token);
    this.snackBar.open('Token copied to clipboard', 'Close', { duration: 2000 });
  }

  deleteKey(id: string) {
    if (confirm('Are you sure you want to delete this API key?')) {
      this.http.delete(`${environment.apiUrl}/api-keys/${id}`).subscribe({
        next: () => {
          this.loadApiKeys();
          this.snackBar.open('API Key deleted', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Failed to delete API key', 'Close', { duration: 3000 })
      });
    }
  }

  toggleActive(key: ApiKey) {
    this.http.put(`${environment.apiUrl}/api-keys/${key._id}`, { isActive: !key.isActive }).subscribe({
      next: () => {
        this.loadApiKeys();
        this.snackBar.open(`API Key ${key.isActive ? 'deactivated' : 'activated'}`, 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to update API key', 'Close', { duration: 3000 })
    });
  }
}

@Component({
  selector: 'create-api-key-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Create API Key</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Name</mat-label>
        <input matInput [(ngModel)]="name" placeholder="My Integration">
      </mat-form-field>
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Expiry Date</mat-label>
        <input matInput [matDatepicker]="picker" [(ngModel)]="expiresAt">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Allowed Domains (comma separated)</mat-label>
        <input matInput [(ngModel)]="domainsInput" placeholder="example.com, app.example.com">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="create()" [disabled]="!name || !expiresAt">Create</button>
    </mat-dialog-actions>
  `
})
export class CreateApiKeyDialog {
  name = '';
  expiresAt: Date | null = null;
  domainsInput = '';

  constructor(public dialogRef: MatDialogRef<CreateApiKeyDialog>) {}

  create() {
    const allowedDomains = this.domainsInput.split(',').map(d => d.trim()).filter(d => d);
    this.dialogRef.close({ name: this.name, expiresAt: this.expiresAt, allowedDomains });
  }
}
