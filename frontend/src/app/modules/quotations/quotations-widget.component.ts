import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { QuotationsService } from './quotations.service';

@Component({
  selector: 'app-quotations-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="quotations-widget">
      <div class="widget-header-content">
        <p class="subtitle">Client enquiries to quotation workflow</p>
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
            <mat-icon>description</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().quotations }}</span>
              <span class="stat-label">Quotations</span>
              <span class="stat-detail">{{ stats().pendingApproval }} pending</span>
            </div>
          </div>
          <div class="stat-item tertiary">
            <mat-icon>check_circle</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().approved }}</span>
              <span class="stat-label">Approved</span>
            </div>
          </div>
          <div class="stat-item accent">
            <mat-icon>send</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().sent }}</span>
              <span class="stat-label">Sent</span>
            </div>
          </div>
        </div>
      </div>
      <div class="widget-footer-actions">
        <button mat-raised-button color="primary" (click)="navigateToModule()">
          <mat-icon>dashboard</mat-icon>
          Manage Quotations
        </button>
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
    .quotations-widget mat-card-header {
      padding: 16px;
    }
    .subtitle {
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      padding: 0 16px;
      font-size: 0.9rem;
    }
    .widget-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 16px;
    }
    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: color-mix(in srgb, var(--theme-surface) 95%, var(--theme-primary));
      border: 1px solid color-mix(in srgb, var(--theme-primary) 10%, transparent);
      border-radius: 8px;
    }
    .stat-item mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--theme-primary);
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: var(--theme-primary);
      line-height: 1;
    }
    .stat-label {
      font-size: 12px;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      margin-top: 2px;
    }
    .stat-detail {
      font-size: 10px;
      color: color-mix(in srgb, var(--theme-on-surface) 50%, transparent);
      margin-top: 2px;
    }
    .widget-footer-actions {
      padding: 16px;
      display: flex;
      gap: 8px;
      margin-top: auto;
    }
    .quotations-widget mat-card-actions button {
      flex: 1;
    }
  `]
})
export class QuotationsWidgetComponent implements OnInit {
  private router = inject(Router);
  private quotationsService = inject(QuotationsService);

  stats = signal({
    enquiries: 0,
    newEnquiries: 0,
    quotations: 0,
    pendingApproval: 0,
    approved: 0,
    sent: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.quotationsService.getEnquiries().subscribe(enquiries => {
      const newEnquiries = enquiries.filter(e => e.status === 'new').length;
      this.quotationsService.getQuotations().subscribe(quotations => {
        this.stats.set({
          enquiries: enquiries.length,
          newEnquiries,
          quotations: quotations.length,
          pendingApproval: quotations.filter(q => q.status === 'pending_approval').length,
          approved: quotations.filter(q => q.status === 'approved').length,
          sent: quotations.filter(q => q.status === 'sent').length
        });
      });
    });
  }

  navigateToModule() {
    this.router.navigate(['/modules/quotations']);
  }
}
