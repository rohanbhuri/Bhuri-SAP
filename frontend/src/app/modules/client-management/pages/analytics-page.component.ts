import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientManagementService } from '../services/client-management.service';

@Component({
  selector: 'app-client-analytics-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="analytics-container">
      <div class="analytics-header">
        <h2>Client & Engagement Analytics</h2>
        <div class="export-actions">
          <button mat-raised-button color="primary" (click)="exportAll()" [disabled]="exporting()">
            <mat-icon>download</mat-icon>
            {{ exporting() ? 'Exporting...' : 'Export All Client Data' }}
          </button>
        </div>
      </div>

      <div class="stats-grid" *ngIf="!loading()">
        <!-- Overview Stats -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon requests">
              <mat-icon>person_add</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalRequests }}</h3>
              <p>Login Requests</p>
              <span class="stat-detail">{{ analytics().pendingRequests }} pending, {{ analytics().convertedRequests }} converted</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="exportRequests()">
              <mat-icon>download</mat-icon>
              Export
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon clients">
              <mat-icon>business</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalClients }}</h3>
              <p>Total Clients</p>
              <span class="stat-detail">{{ analytics().activeClients }} active accounts</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="exportClients()">
              <mat-icon>download</mat-icon>
              Export
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon contact">
              <mat-icon>mail</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalContact }}</h3>
              <p>Contact Inquiries</p>
              <span class="stat-detail">{{ analytics().unreadContact }} unread messages</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="exportContactMessages()">
              <mat-icon>download</mat-icon>
              Export
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon conversion">
              <mat-icon>speed</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().avgConversionTime }}</h3>
              <p>Avg. Conversion Time</p>
              <span class="stat-detail">Request to account creation</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon response">
              <mat-icon>message</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().avgReadTime }}</h3>
              <p>Avg. Read Time</p>
              <span class="stat-detail">Contact inquiry response time</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Trends -->
      <div class="changes-section" *ngIf="!loading()">
        <h3>Recent Activity (Last 7 Days)</h3>
        <div class="changes-grid">
          <mat-card class="change-card">
            <mat-card-content>
              <div class="change-header">
                <mat-icon class="change-icon requests">person_add</mat-icon>
                <div>
                  <h4>New Requests</h4>
                  <p class="change-count">{{ analytics().recentChanges.requests || 0 }} new submissions</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="change-card">
            <mat-card-content>
              <div class="change-header">
                <mat-icon class="change-icon clients">business</mat-icon>
                <div>
                  <h4>New Clients</h4>
                  <p class="change-count">{{ analytics().recentChanges.clients || 0 }} new accounts</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="change-card">
            <mat-card-content>
              <div class="change-header">
                <mat-icon class="change-icon contact">mail</mat-icon>
                <div>
                  <h4>New Inquiries</h4>
                  <p class="change-count">{{ analytics().recentChanges.contactMessages || 0 }} new messages</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Detailed Breakdown -->
      <div class="detailed-analytics" *ngIf="!loading()">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Requests by Country</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="category-breakdown">
              <div *ngFor="let country of analytics().requestsByCountry" class="breakdown-item">
                <span class="label">{{ country.name }}</span>
                <div class="bar-container">
                  <div class="bar bar-request" [style.width.%]="(country.count / (analytics().totalRequests || 1)) * 100"></div>
                </div>
                <span class="count">{{ country.count }}</span>
              </div>
              <div *ngIf="analytics().requestsByCountry.length === 0" class="empty-state">
                <p>No regional data available.</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Requests by Industry</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="category-breakdown">
              <div *ngFor="let ind of analytics().requestsByIndustry" class="breakdown-item">
                <span class="label">{{ ind.name }}</span>
                <div class="bar-container">
                  <div class="bar bar-request" [style.width.%]="(ind.count / (analytics().totalRequests || 1)) * 100"></div>
                </div>
                <span class="count">{{ ind.count }}</span>
              </div>
              <div *ngIf="analytics().requestsByIndustry.length === 0" class="empty-state">
                <p>No industry data available for requests.</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Clients by Industry</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="category-breakdown">
              <div *ngFor="let industry of analytics().clientsByIndustry" class="breakdown-item">
                <span class="label">{{ industry.name }}</span>
                <div class="bar-container">
                  <div class="bar bar-client" [style.width.%]="(industry.count / (analytics().totalClients || 1)) * 100"></div>
                </div>
                <span class="count">{{ industry.count }}</span>
              </div>
              <div *ngIf="analytics().clientsByIndustry.length === 0" class="empty-state">
                <p>No industry data available.</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Company Size Distribution</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="category-breakdown">
              <div *ngFor="let size of analytics().requestsByCompanySize" class="breakdown-item">
                <span class="label">{{ size.name }}</span>
                <div class="bar-container">
                  <div class="bar bar-response" [style.width.%]="(size.count / (analytics().totalRequests || 1)) * 100"></div>
                </div>
                <span class="count">{{ size.count }}</span>
              </div>
              <div *ngIf="analytics().requestsByCompanySize.length === 0" class="empty-state">
                <p>No company size data available.</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="loading-state" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading client analytics...</p>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .analytics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .analytics-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .stat-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px !important;
    }
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon mat-icon {
      font-size: 1.2rem;
      width: 28px;
      height: 28px;
      color: white;
    }
    .stat-icon.requests { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.clients { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.contact { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.conversion { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
    .stat-icon.response { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    
    .stat-info {
      flex: 1;
      min-width: 0;
    }
    .stat-info h3 {
      margin: 0 0 4px 0;
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1;
    }
    .stat-info p {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
    .stat-detail {
      font-size: 12px;
      color: #999;
    }
    .stat-card mat-card-actions {
      padding: 12px 20px !important;
      border-top: 1px solid #f0f0f0;
      margin: 0 !important;
    }
    .changes-section {
      margin-bottom: 32px;
    }
    .changes-section h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .changes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }
    .change-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .change-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .change-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }
    .change-icon.requests { background: rgba(102, 126, 234, 0.1); color: #667eea; }
    .change-icon.clients { background: rgba(240, 147, 251, 0.1); color: #f093fb; }
    .change-icon.contact { background: rgba(79, 172, 254, 0.1); color: #4facfe; }
    
    .change-header h4 {
      margin: 0 0 4px 0;
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }
    .change-count {
      margin: 0;
      font-size: 13px;
      color: #666;
    }
    .detailed-analytics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-top: 32px;
    }
    .detailed-analytics mat-card {
      height: 100%;
    }
    .detailed-analytics mat-card-header {
      padding: 20px 20px 16px !important;
    }
    .category-breakdown {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 0 20px 20px;
    }
    .breakdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .breakdown-item .label {
      min-width: 140px;
      font-size: 13px;
      font-weight: 500;
      color: #333;
    }
    .bar-container {
      flex: 1;
      height: 12px;
      background: #f5f5f5;
      border-radius: 6px;
      overflow: hidden;
    }
    .bar {
      height: 100%;
      transition: width 0.3s;
      border-radius: 6px;
    }
    .bar-request { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); }
    .bar-client { background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%); }
    .bar-response { background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%); }
    
    .breakdown-item .count {
      min-width: 40px;
      text-align: right;
      font-weight: 600;
      font-size: 14px;
      color: #667eea;
    }
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px;
      gap: 16px;
    }
    .empty-state {
      padding: 20px;
      text-align: center;
      color: #999;
    }
  `]
})
export class AnalyticsPageComponent implements OnInit {
  private clientService = inject(ClientManagementService);
  
  loading = signal(true);
  exporting = signal(false);
  analytics = signal({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    convertedRequests: 0,
    totalClients: 0,
    activeClients: 0,
    totalContact: 0,
    unreadContact: 0,
    avgReadTime: '0h',
    avgConversionTime: '0h',
    recentChanges: { requests: 0, clients: 0, contactMessages: 0 },
    requestsByCountry: [] as any[],
    requestsByIndustry: [] as any[],
    requestsByCompanySize: [] as any[],
    clientsByIndustry: [] as any[]
  });

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading.set(true);
    this.clientService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  exportRequests() {
    this.clientService.exportRequests().subscribe(blob => {
      this.downloadFile(blob, 'login-requests.csv');
    });
  }

  exportClients() {
    this.clientService.exportClients().subscribe(blob => {
      this.downloadFile(blob, 'clients.csv');
    });
  }

  exportContactMessages() {
    this.clientService.exportContactMessages().subscribe(blob => {
      this.downloadFile(blob, 'contact-inquiries.csv');
    });
  }

  exportAll() {
    this.exporting.set(true);
    // In a real scenario, you might want to zip these, but for now we'll just download them sequentially or provided a combined export
    // Since I didn't implement a ZIP export on backend for client management yet, I'll just trigger all three
    this.exportRequests();
    this.exportClients();
    this.exportContactMessages();
    setTimeout(() => this.exporting.set(false), 2000);
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
