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
      
      <div class="metrics-container">
        <div class="metric-card primary">
          <div class="metric-header">
            <mat-icon>schedule</mat-icon>
            <span class="metric-title">Pending Requests</span>
          </div>
          <div class="metric-value">{{ pendingRequests() }}</div>
          <div class="metric-footer">
            <span class="metric-change">Awaiting review</span>
          </div>
        </div>
        
        <div class="metric-card success">
          <div class="metric-header">
            <mat-icon>check_circle</mat-icon>
            <span class="metric-title">Active Clients</span>
          </div>
          <div class="metric-value">{{ activeClients() }}</div>
          <div class="metric-footer">
            <span class="metric-change">{{ totalClients() }} total</span>
          </div>
        </div>
      </div>

      <div class="quick-stats">
        <div class="stat-row">
          <span class="stat-label">
            <mat-icon>trending_up</mat-icon>
            New This Month
          </span>
          <mat-chip class="stat-chip success">+{{ newThisMonth() }}</mat-chip>
        </div>
        <div class="stat-row">
          <span class="stat-label">
            <mat-icon>block</mat-icon>
            Inactive
          </span>
          <mat-chip class="stat-chip warning">{{ inactiveClients() }}</mat-chip>
        </div>
        <div class="stat-row">
          <span class="stat-label">
            <mat-icon>security</mat-icon>
            With 2FA
          </span>
          <mat-chip class="stat-chip info">{{ clientsWith2FA() }}</mat-chip>
        </div>
      </div>
      
      <div class="widget-actions">
        <button mat-stroked-button (click)="openRequests()">
          <mat-icon>inbox</mat-icon>
          View Requests
        </button>
        <button mat-raised-button color="primary" (click)="openClientManagement()">
          <mat-icon>settings</mat-icon>
          Manage
        </button>
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
      background: white;
      border-radius: 12px;
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
      font-size: 28px;
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
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    .metric-card {
      padding: 16px;
      border-radius: 10px;
      border: 1px solid;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .metric-card.primary {
      background: #fef3c7;
      border-color: #fbbf24;
    }
    
    .metric-card.success {
      background: #d1fae5;
      border-color: #6ee7b7;
    }
    
    .metric-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .metric-card.primary .metric-header mat-icon {
      color: #d97706;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .metric-card.success .metric-header mat-icon {
      color: #059669;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .metric-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .metric-card.primary .metric-title {
      color: #92400e;
    }
    
    .metric-card.success .metric-title {
      color: #065f46;
    }
    
    .metric-value {
      font-size: 2.25rem;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 8px;
    }
    
    .metric-card.primary .metric-value {
      color: #d97706;
    }
    
    .metric-card.success .metric-value {
      color: #059669;
    }
    
    .metric-footer {
      font-size: 0.75rem;
    }
    
    .metric-card.primary .metric-footer {
      color: #92400e;
    }
    
    .metric-card.success .metric-footer {
      color: #065f46;
    }
    
    .quick-stats {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
      background: #f9fafb;
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
    
    .widget-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: auto;
    }
    
    .widget-actions button {
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .widget-actions button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }
  `]
})
export class ClientManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  private clientService = inject(ClientManagementService);

  pendingRequests = signal(0);
  activeClients = signal(0);
  totalClients = signal(0);
  inactiveClients = signal(0);
  newThisMonth = signal(0);
  clientsWith2FA = signal(0);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.clientService.getAllClientRequests().subscribe({
      next: (requests) => {
        this.pendingRequests.set(requests.filter(r => r.status === 'PENDING').length);
      },
      error: () => this.pendingRequests.set(0)
    });

    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.totalClients.set(clients.length);
        this.activeClients.set(clients.filter(c => c.isActive).length);
        this.inactiveClients.set(clients.filter(c => !c.isActive).length);
        this.clientsWith2FA.set(clients.filter(c => c.requireTwoFactor).length);
        
        const now = new Date();
        const thisMonth = clients.filter(c => {
          const created = new Date(c.createdAt);
          return created.getMonth() === now.getMonth() && 
                 created.getFullYear() === now.getFullYear();
        });
        this.newThisMonth.set(thisMonth.length);
      },
      error: () => {
        this.totalClients.set(0);
        this.activeClients.set(0);
        this.inactiveClients.set(0);
        this.newThisMonth.set(0);
        this.clientsWith2FA.set(0);
      }
    });
  }

  openRequests() {
    this.router.navigate(['/modules/client-management'], { queryParams: { tab: 'requests' } });
  }

  openClientManagement() {
    this.router.navigate(['/modules/client-management']);
  }
}
