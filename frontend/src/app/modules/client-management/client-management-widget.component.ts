import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ClientManagementService } from './services/client-management.service';

@Component({
  selector: 'app-client-management-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="client-widget">
      <div class="header">
        <div class="icon-container">
          <mat-icon>people_outline</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Client accounts & requests</span>
        </div>
      </div>
      
      <div class="metrics-grid">
        <div class="metric-card pending">
          <div class="metric-value">{{ pendingRequests() }}</div>
          <div class="metric-label">Pending Requests</div>
          <div class="metric-icon">
            <mat-icon>schedule</mat-icon>
          </div>
        </div>
        
        <div class="metric-card active">
          <div class="metric-value">{{ activeClients() }}</div>
          <div class="metric-label">Active Clients</div>
          <div class="metric-icon">
            <mat-icon>check_circle</mat-icon>
          </div>
        </div>
      </div>
      
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-label">Total Clients</span>
          <span class="stat-value">{{ totalClients() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">This Month</span>
          <span class="stat-value success">+{{ newThisMonth() }}</span>
        </div>
      </div>
      
      <div class="action-section">
        <button mat-flat-button color="primary" (click)="openClientManagement()">
          <mat-icon>settings</mat-icon>
          Manage Clients
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
      gap: 16px;
    }
    
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .icon-container {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #00BCD4, #00ACC1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .subtitle {
      font-size: 0.9rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      font-weight: 500;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    .metric-card {
      padding: 16px;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
    }
    
    .metric-card.pending {
      background: color-mix(in srgb, #FF9800 10%, transparent);
      border: 1px solid color-mix(in srgb, #FF9800 20%, transparent);
    }
    
    .metric-card.active {
      background: color-mix(in srgb, #4CAF50 10%, transparent);
      border: 1px solid color-mix(in srgb, #4CAF50 20%, transparent);
    }
    
    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
    }
    
    .metric-card.pending .metric-value {
      color: #FF9800;
    }
    
    .metric-card.active .metric-value {
      color: #4CAF50;
    }
    
    .metric-label {
      font-size: 0.75rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      margin-top: 4px;
    }
    
    .metric-icon {
      position: absolute;
      top: 12px;
      right: 12px;
      opacity: 0.2;
    }
    
    .metric-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    
    .stats-row {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: color-mix(in srgb, var(--theme-surface) 95%, var(--theme-primary));
      border-radius: 8px;
    }
    
    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .stat-label {
      font-size: 0.7rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
    }
    
    .stat-value {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--theme-on-surface);
    }
    
    .stat-value.success {
      color: #4CAF50;
    }
    
    .action-section {
      margin-top: auto;
    }
    
    .action-section button {
      width: 100%;
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
    }
  `]
})
export class ClientManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  private clientService = inject(ClientManagementService);

  pendingRequests = signal(0);
  activeClients = signal(0);
  totalClients = signal(0);
  newThisMonth = signal(0);

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
        this.newThisMonth.set(0);
      }
    });
  }

  openClientManagement() {
    this.router.navigate(['/modules/client-management']);
  }
}
