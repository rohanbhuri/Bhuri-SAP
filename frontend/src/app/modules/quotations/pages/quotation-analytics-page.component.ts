import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { QuotationsService } from '../quotations.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-quotation-analytics-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="analytics-container">
      <div class="analytics-header">
        <div>
          <h2>Quotation Analytics & Overview</h2>
          <p class="last-updated" *ngIf="lastUpdated()">Last updated: {{ lastUpdated() | date:'short' }}</p>
        </div>
        <div class="header-actions">
           <button mat-icon-button (click)="refreshAnalytics()" [disabled]="loading()" matTooltip="Refresh Analytics">
            <mat-icon [class.spinning]="loading()">refresh</mat-icon>
          </button>
        </div>
      </div>

      <div class="stats-grid" *ngIf="!loading()">
        <!-- Enquiries Stat -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon enquiries">
              <mat-icon>inbox</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalEnquiries }}</h3>
              <p>Total Enquiries</p>
              <span class="stat-detail">{{ analytics().newEnquiries }} new waiting</span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Presentations Stat -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon presentations">
              <mat-icon>co_present</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalPresentations }}</h3>
              <p>Presentations</p>
              <span class="stat-detail">{{ analytics().sentPresentations }} sent to clients</span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Quotations Stat -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon quotations">
              <mat-icon>description</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalQuotations }}</h3>
              <p>Quotations</p>
              <span class="stat-detail">{{ analytics().approvedQuotations }} approved</span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Conversion Rate -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon conversion">
              <mat-icon>trending_up</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().conversionRate }}%</h3>
              <p>Conversion Rate</p>
              <span class="stat-detail">Enquiry to Quotation</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="detailed-analytics" *ngIf="!loading()">
        
        <!-- Funnel Analysis -->
        <mat-card class="funnel-card">
          <mat-card-header>
            <mat-card-title>Sales Funnel</mat-card-title>
          </mat-card-header>
          <mat-card-content>
             <div class="funnel-container">
                <div class="funnel-step">
                    <div class="step-label">Enquiries</div>
                    <div class="step-bar" style="width: 100%">
                        <span class="value">{{ analytics().totalEnquiries }}</span>
                    </div>
                </div>
                <div class="funnel-step">
                    <div class="step-label">Presentations</div>
                    <div class="step-barWrapper">
                         <div class="step-bar" [style.width.%]="getPercentage(analytics().totalPresentations, analytics().totalEnquiries)">
                            <span class="value">{{ analytics().totalPresentations }}</span>
                         </div>
                    </div>
                    <div class="conversion-label">{{ getPercentage(analytics().totalPresentations, analytics().totalEnquiries) }}% form previous</div>
                </div>
                 <div class="funnel-step">
                    <div class="step-label">Quotations</div>
                     <div class="step-barWrapper">
                        <div class="step-bar" [style.width.%]="getPercentage(analytics().totalQuotations, analytics().totalEnquiries)">
                            <span class="value">{{ analytics().totalQuotations }}</span>
                        </div>
                     </div>
                     <div class="conversion-label">{{ getPercentage(analytics().totalQuotations, analytics().totalPresentations) }}% from previous</div>
                </div>
                 <div class="funnel-step">
                    <div class="step-label">Approved</div>
                     <div class="step-barWrapper">
                        <div class="step-bar" [style.width.%]="getPercentage(analytics().approvedQuotations, analytics().totalEnquiries)">
                            <span class="value">{{ analytics().approvedQuotations }}</span>
                        </div>
                     </div>
                     <div class="conversion-label">{{ getPercentage(analytics().approvedQuotations, analytics().totalQuotations) }}% from previous</div>
                </div>
             </div>
          </mat-card-content>
        </mat-card>

        <!-- Status Breakdown -->
        <div class="breakdown-column">
             <mat-card>
                <mat-card-header>
                    <mat-card-title>Enquiry Status</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <div class="status-list">
                        <div class="status-item" *ngFor="let status of analytics().enquiryStatus">
                            <span class="status-name">{{ status.status | titlecase }}</span>
                            <div class="status-bar-bg">
                                <div class="status-bar-fill" [style.width.%]="(status.count / analytics().totalEnquiries) * 100"></div>
                            </div>
                            <span class="status-count">{{ status.count }}</span>
                        </div>
                    </div>
                </mat-card-content>
            </mat-card>

            <mat-card class="mt-4">
                <mat-card-header>
                    <mat-card-title>Quotation Status</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <div class="status-list">
                        <div class="status-item" *ngFor="let status of analytics().quotationStatus">
                            <span class="status-name">{{ status.status | titlecase }}</span>
                            <div class="status-bar-bg">
                                <div class="status-bar-fill quote-fill" [style.width.%]="(status.count / analytics().totalQuotations) * 100"></div>
                            </div>
                            <span class="status-count">{{ status.count }}</span>
                        </div>
                    </div>
                </mat-card-content>
            </mat-card>
        </div>

      </div>
      
      <div class="loading-state" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Crunching the numbers...</p>
      </div>

    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 24px;
      max-width: 1600px;
      margin: 0 auto;
    }
    .analytics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .analytics-header h2 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 600;
      color: var(--theme-on-surface);
    }
    .last-updated {
      margin: 0;
      font-size: 12px;
      color: #999;
    }
    .header-actions button {
      transition: transform 0.3s ease;
    }
    .header-actions button:active {
      transform: rotate(180deg);
    }
    .spinning {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .stat-card {
      transition: transform 0.2s, box-shadow 0.2s;
      border-radius: 16px;
      overflow: hidden;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.08);
    }
    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px !important;
    }
    
    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }
    
    .stat-icon.enquiries { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.presentations { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.quotations { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.conversion { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    
    .stat-info h3 {
      font-size: 32px;
      font-weight: 800;
      margin: 0;
      line-height: 1.1;
      color: var(--theme-on-surface);
    }
    .stat-info p {
      margin: 4px 0;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    .stat-detail {
      font-size: 13px;
      color: color-mix(in srgb, var(--theme-on-surface) 40%, transparent);
    }

    .detailed-analytics {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 24px;
        align-items: start;
    }
    
    @media (max-width: 1000px) {
        .detailed-analytics {
            grid-template-columns: 1fr;
        }
    }

    .funnel-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 20px 0;
    }
    
    .funnel-step {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .step-label {
        font-weight: 600;
        font-size: 14px;
        color: var(--theme-on-surface);
    }
    
    .step-barWrapper {
        width: 100%;
        background: rgba(0,0,0,0.05);
        border-radius: 8px;
    }
    
    .step-bar {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        min-width: 60px;
        transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2);
    }
    
    .step-bar .value {
        color: white;
        font-weight: 700;
        font-size: 16px;
    }

    .conversion-label {
        font-size: 12px;
        color: color-mix(in srgb, var(--theme-on-surface) 50%, transparent);
        margin-left: 4px;
    }

    .status-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    .status-item {
        display: grid;
        grid-template-columns: 120px 1fr 40px;
        align-items: center;
        gap: 12px;
    }
    
    .status-name {
        font-size: 13px;
        font-weight: 500;
    }
    
    .status-bar-bg {
        height: 8px;
        background: rgba(0,0,0,0.05);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .status-bar-fill {
        height: 100%;
        background: #f093fb;
        border-radius: 4px;
    }
    
    .status-bar-fill.quote-fill {
        background: #4facfe;
    }
    
    .status-count {
        font-weight: 600;
        text-align: right;
    }
    
    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px;
        gap: 16px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
    }
    .mt-4 { margin-top: 24px; }
  `]
})
export class QuotationAnalyticsPageComponent implements OnInit, OnDestroy {
  private quotationService = inject(QuotationsService);
  private route = inject(ActivatedRoute);
  
  loading = signal(true);
  lastUpdated = signal<Date | null>(null);
  private queryParamsSubscription?: Subscription;
  private currentTab = '';
  
  analytics = signal({
    totalEnquiries: 0,
    newEnquiries: 0,
    enquiryStatus: [] as any[],
    
    totalPresentations: 0,
    sentPresentations: 0,
    
    totalQuotations: 0,
    approvedQuotations: 0,
    quotationStatus: [] as any[],
    
    conversionRate: 0
  });

  ngOnInit() {
    this.loadData();
    
    // Subscribe to query params to detect tab changes
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      // If we're switching TO the analytics tab, refresh the data
      if (tab === 'analytics' && this.currentTab !== 'analytics') {
        console.log('Switched to analytics tab, refreshing data...');
        this.loadData();
      }
      this.currentTab = tab || '';
    });
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  refreshAnalytics() {
    console.log('Manual refresh triggered');
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    
    forkJoin({
      enquiries: this.quotationService.getEnquiries(),
      presentations: this.quotationService.getAllPresentations(),
      quotations: this.quotationService.getQuotations()
    }).subscribe({
      next: (data) => {
        this.processData(data);
        this.lastUpdated.set(new Date());
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load analytics data', err);
        this.loading.set(false);
      }
    });
  }

  processData(data: { enquiries: any[], presentations: any[], quotations: any[] }) {
    const { enquiries, presentations, quotations } = data;

    // Enquiries
    const newEnquiries = enquiries.filter(e => e.status === 'new' || e.status === 'pending').length;
    const enquiryStatusMap = new Map<string, number>();
    enquiries.forEach(e => {
        const status = e.status || 'unknown';
        enquiryStatusMap.set(status, (enquiryStatusMap.get(status) || 0) + 1);
    });
    const enquiryStatus = Array.from(enquiryStatusMap.entries()).map(([status, count]) => ({ status, count }));

    // Presentations
    const sentPresentations = presentations.filter(p => p.status === 'sent' || p.isSentToClient).length;

    // Quotations
    const approvedQuotations = quotations.filter(q => q.status === 'approved').length;
    const quotationStatusMap = new Map<string, number>();
    quotations.forEach(q => {
        const status = q.status || 'unknown';
        quotationStatusMap.set(status, (quotationStatusMap.get(status) || 0) + 1);
    });
    const quotationStatus = Array.from(quotationStatusMap.entries()).map(([status, count]) => ({ status, count }));

    // Conversion Rate
    const conversionRate = enquiries.length > 0 ? (quotations.length / enquiries.length) * 100 : 0;

    this.analytics.set({
      totalEnquiries: enquiries.length,
      newEnquiries,
      enquiryStatus,
      
      totalPresentations: presentations.length,
      sentPresentations,
      
      totalQuotations: quotations.length,
      approvedQuotations,
      quotationStatus,
      
      conversionRate: Math.round(conversionRate * 10) / 10
    });
  }

  getPercentage(current: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  }
}
