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
    <mat-card class="widget-card quotations-widget">
      <mat-card-header>
        <mat-card-subtitle>Client enquiries to quotation workflow</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
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
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="navigateToModule()">
          <mat-icon>dashboard</mat-icon>
          Manage Quotations
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .quotations-widget {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .quotations-widget mat-card-header {
      padding: 16px;
    }
    .quotations-widget mat-card-subtitle {
      color: rgba(255,255,255,0.8);
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
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }
    .stat-item mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: white;
      line-height: 1;
    }
    .stat-label {
      font-size: 12px;
      color: rgba(255,255,255,0.8);
      margin-top: 2px;
    }
    .stat-detail {
      font-size: 10px;
      color: rgba(255,255,255,0.6);
      margin-top: 2px;
    }
    .quotations-widget mat-card-actions {
      padding: 16px;
      display: flex;
      gap: 8px;
      border-top: 1px solid rgba(255,255,255,0.2);
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
