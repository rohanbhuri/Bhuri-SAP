import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { QuotationsService } from './quotations.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-quotations-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="quotations-widget">
      <div class="widget-header-content">
        <p class="subtitle">Client enquiries, presentations & quotations workflow</p>
      </div>
      <div class="widget-body-content">
        <div class="widget-stats">
          <div class="stat-item primary">
            <mat-icon>inbox</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().enquiries }}</span>
              <span class="stat-label">Enquiries</span>
              <span class="stat-detail">{{ stats().newEnquiries }} new</span>
            </div>
          </div>
          <div class="stat-item secondary">
            <mat-icon>co_present</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().presentations }}</span>
              <span class="stat-label">Presentations</span>
              <span class="stat-detail">{{ stats().sentPresentations }} sent</span>
            </div>
          </div>
          <div class="stat-item tertiary">
            <mat-icon>description</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().quotations }}</span>
              <span class="stat-label">Quotations</span>
              <span class="stat-detail">{{ stats().approved }} approved</span>
            </div>
          </div>
          <div class="stat-item accent">
             <mat-icon>send</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().sent }}</span>
              <span class="stat-label">Sent Quotes</span>
            </div>
          </div>
        </div>
      </div>
      <div class="widget-footer-actions">
        <div class="cta-grid">
          <button mat-flat-button class="cta-btn" (click)="navigateToTab('enquiries')">
            <mat-icon>inbox</mat-icon>
            <span>Enquiries</span>
          </button>
          <button mat-flat-button class="cta-btn" (click)="navigateToTab('presentations')">
            <mat-icon>co_present</mat-icon>
            <span>Presentations</span>
          </button>
          <button mat-flat-button class="cta-btn" (click)="navigateToTab('quotations')">
            <mat-icon>description</mat-icon>
            <span>Quotations</span>
          </button>
          <button mat-flat-button class="cta-btn analytics-btn" (click)="navigateToTab('analytics')">
            <mat-icon>analytics</mat-icon>
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </div>
  `,
   styles: [`
    .quotations-widget {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: transparent;
    }
    
    .subtitle {
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      padding: 0 16px;
      font-size: 0.9rem;
      margin-top: 4px;
    }
    
    .widget-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 16px;
    }
    
    :host-context([data-view="expanded"]) .widget-stats {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      padding: 24px;
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: color-mix(in srgb, var(--theme-surface) 96%, var(--theme-primary));
      border: 1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent);
      border-radius: 12px;
      transition: all 0.2s ease-in-out;
    }
    
    .stat-item:hover {
      transform: translateY(-2px);
      background: color-mix(in srgb, var(--theme-surface) 92%, var(--theme-primary));
      border-color: color-mix(in srgb, var(--theme-primary) 20%, transparent);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    
    :host-context([data-view="expanded"]) .stat-item {
      padding: 20px;
      border-radius: 16px;
    }

    .stat-item mat-icon {
      font-size: 1.2rem;
      width: 28px;
      height: 28px;
      color: var(--theme-primary);
      opacity: 0.8;
    }
    
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    
    .stat-number {
      font-size: 22px;
      font-weight: 800;
      color: var(--theme-primary);
      line-height: 1.1;
      letter-spacing: -0.5px;
    }
    
    .stat-label {
      font-size: 11px;
      font-weight: 600;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-detail {
      font-size: 10px;
      color: color-mix(in srgb, var(--theme-on-surface) 40%, transparent);
      margin-top: 1px;
    }

    .widget-footer-actions {
      padding: 16px;
      margin-top: auto;
      border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 5%, transparent);
    }
    
    .cta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    :host-context([data-view="expanded"]) .cta-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .cta-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: auto;
      padding: 14px 10px;
      background: color-mix(in srgb, var(--theme-primary) 12%, var(--theme-surface)) !important;
      color: var(--theme-primary) !important;
      border-radius: 14px;
      min-width: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid color-mix(in srgb, var(--theme-primary) 25%, transparent) !important;
      box-shadow: 0 4px 6px -1px color-mix(in srgb, var(--theme-on-surface) 5%, transparent);
    }

    .cta-btn mat-icon {
      margin: 0;
      font-size: 24px;
      width: 24px;
      height: 24px;
      transition: transform 0.3s ease;
    }

    .cta-btn span {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .analytics-btn {
      grid-column: span 1; /* Changed from span 2 to span 1 to fit grid */
      background: color-mix(in srgb, var(--theme-primary) 18%, var(--theme-surface)) !important;
      border-color: color-mix(in srgb, var(--theme-primary) 40%, transparent) !important;
    }

     /* Make analytics button span 2 columns if grid is 2 columns (default view) but we have 4 items so actually each takes 1 slot in 2x2 grid. 
        Wait, we have 4 items: Enquiries, Presentations, Quotations, Analytics.
        So 1fr 1fr grid is perfect 2x2.
     */

    .cta-btn:hover {
      background: var(--theme-primary) !important;
      color: var(--theme-on-primary) !important;
      border-color: var(--theme-primary) !important;
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px color-mix(in srgb, var(--theme-primary) 30%, transparent);
    }

    .cta-btn:hover mat-icon {
      transform: scale(1.1);
    }

    /* Stat item specific colors */
    .stat-item.primary { border-left: 3px solid var(--theme-primary); }
    .stat-item.secondary { border-left: 3px solid #f093fb; } /* Match presentation color */
    .stat-item.tertiary { border-left: 3px solid #4facfe; } /* Match quotation color */
    .stat-item.accent { border-left: 3px solid #43e97b; } /* Match sent color */
  `]
})
export class QuotationsWidgetComponent implements OnInit {
  private router = inject(Router);
  private quotationsService = inject(QuotationsService);

  stats = signal({
    enquiries: 0,
    newEnquiries: 0,
    presentations: 0,
    sentPresentations: 0,
    quotations: 0,
    pendingApproval: 0,
    approved: 0,
    sent: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      enquiries: this.quotationsService.getEnquiries(),
      presentations: this.quotationsService.getAllPresentations(),
      quotations: this.quotationsService.getQuotations()
    }).subscribe({
      next: (data) => {
        const { enquiries, presentations, quotations } = data;
        
        this.stats.set({
          enquiries: enquiries.length,
          newEnquiries: enquiries.filter(e => e.status === 'new').length,
          presentations: presentations.length,
          sentPresentations: presentations.filter(p => p.status === 'sent' || p.isSentToClient).length,
          quotations: quotations.length,
          pendingApproval: quotations.filter(q => q.status === 'pending_approval').length,
          approved: quotations.filter(q => q.status === 'approved').length,
          sent: quotations.filter(q => q.status === 'sent').length
        });
      },
      error: (err) => console.error('Failed to load widget stats', err)
    });
  }

  navigateToTab(tabName: string) {
    this.router.navigate(['/modules/quotations'], { queryParams: { tab: tabName } });
  }
}
