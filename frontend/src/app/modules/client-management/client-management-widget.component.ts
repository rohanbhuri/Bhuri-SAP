import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { ClientManagementService } from './services/client-management.service';

@Component({
  selector: 'app-client-management-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="client-widget">
      <div class="widget-header">
        <div class="icon-wrapper">
          <mat-icon>people_outline</mat-icon>
        </div>
        <div class="header-content">
          <h3>Client Management</h3>
          <p>Manage client accounts & requests</p>
        </div>
      </div>

      <div class="widget-body-content">
        <div class="widget-stats">
          <div class="stat-item primary">
            <mat-icon>person_add</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ pendingRequests() }}</span>
              <span class="stat-label">Requests</span>
              <span class="stat-detail">{{ convertedRequests() }} converted</span>
            </div>
          </div>
          <div class="stat-item success">
            <mat-icon>business</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ activeClients() }}</span>
              <span class="stat-label">Clients</span>
              <span class="stat-detail">{{ totalClients() }} total</span>
            </div>
          </div>
          <div class="stat-item info">
            <mat-icon>mail</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ unreadContact() }}</span>
              <span class="stat-label">Inquiries</span>
              <span class="stat-detail">{{ totalContact() }} messages</span>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-stats">
        <div class="stat-row">
          <span class="stat-label">
            <mat-icon>trending_up</mat-icon>
            New Clients This Month
          </span>
          <mat-chip class="stat-chip success">+{{ newThisMonth() }}</mat-chip>
        </div>
      </div>
      
      <div class="widget-footer-actions">
        <div class="cta-grid">
          <button mat-flat-button class="cta-btn" (click)="openRequests()">
            <mat-icon>person_add</mat-icon>
            <span>Requests</span>
          </button>
          <button mat-flat-button class="cta-btn" (click)="openClientManagement()">
            <mat-icon>business</mat-icon>
            <span>Clients</span>
          </button>
          <button mat-flat-button class="cta-btn" (click)="openContactUs()">
            <mat-icon>mail</mat-icon>
            <span>Contact Us</span>
          </button>
          <button mat-flat-button class="cta-btn" (click)="openAnalytics()">
            <mat-icon>analytics</mat-icon>
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .client-widget {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: transparent;
    }
    
    .widget-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);
    }
    
    .icon-wrapper mat-icon {
      font-size: 1.2rem;
      width: 28px;
      height: 28px;
      color: white;
    }
    
    .header-content h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }
    
    .header-content p {
      margin: 4px 0 0;
      font-size: 0.8125rem;
      color: #6b7280;
    }
    
    .metrics-container {
      display: none;
    }
    
    .widget-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 16px;
    }
    
    :host-context([data-view="expanded"]) .widget-stats {
      grid-template-columns: repeat(3, 1fr);
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

    .stat-item.primary { border-left: 3px solid var(--theme-primary); }
    .stat-item.success { border-left: 3px solid #059669; }
    .stat-item.info { border-left: 3px solid #0284c7; }

    .quick-stats {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
      background: color-mix(in srgb, var(--theme-surface) 95%, var(--theme-on-surface));
      border-radius: 10px;
    }
    
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .stat-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8125rem;
      color: #374151;
      font-weight: 500;
    }
    
    .stat-label mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #6b7280;
    }
    
    .stat-chip {
      min-height: 24px;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 10px;
    }
    
    .stat-chip.success {
      background: #d1fae5;
      color: #065f46;
    }
    
    .stat-chip.warning {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .stat-chip.info {
      background: #dbeafe;
      color: #1e40af;
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
      grid-column: span 2;
      background: color-mix(in srgb, var(--theme-primary) 18%, var(--theme-surface)) !important;
      border-color: color-mix(in srgb, var(--theme-primary) 40%, transparent) !important;
    }

    :host-context([data-view="expanded"]) .analytics-btn {
      grid-column: auto;
    }

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
  `]
})
export class ClientManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  private clientService = inject(ClientManagementService);

  pendingRequests = signal(0);
  convertedRequests = signal(0);
  activeClients = signal(0);
  totalClients = signal(0);
  unreadContact = signal(0);
  totalContact = signal(0);
  newThisMonth = signal(0);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.clientService.getAnalytics().subscribe({
      next: (analytics) => {
        this.pendingRequests.set(analytics.pendingRequests);
        this.convertedRequests.set(analytics.convertedRequests);
        this.totalClients.set(analytics.totalClients);
        this.activeClients.set(analytics.activeClients);
        this.unreadContact.set(analytics.unreadContact);
        this.totalContact.set(analytics.totalContact);
        this.newThisMonth.set(analytics.recentChanges.clients);
      },
      error: () => {
        // Fallback to old loading if needed
      }
    });
  }

  openRequests() {
    this.router.navigate(['/modules/client-management'], { queryParams: { tab: 'requests' } });
  }

  openClientManagement() {
    this.router.navigate(['/modules/client-management'], { queryParams: { tab: 'clients' } });
  }

  openContactUs() {
    this.router.navigate(['/modules/client-management'], { queryParams: { tab: 'contact-us' } });
  }

  openAnalytics() {
    this.router.navigate(['/modules/client-management'], { queryParams: { tab: 'analytics' } });
  }
}
