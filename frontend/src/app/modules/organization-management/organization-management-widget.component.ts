import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { OrganizationManagementService } from './organization-management.service';

@Component({
  selector: 'app-organization-management-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="org-widget">
      <div class="header">
        <div class="icon-container">
          <mat-icon>business</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Organization network</span>
        </div>
      </div>
      
      <div class="org-network">
        <div class="network-visual">
          <div class="central-node">
            <mat-icon>account_balance</mat-icon>
          </div>
          <div class="connection-lines">
            <div class="line line-1"></div>
            <div class="line line-2"></div>
            <div class="line line-3"></div>
          </div>
          <div class="satellite-nodes">
            <div class="node node-1"></div>
            <div class="node node-2"></div>
            <div class="node node-3"></div>
          </div>
        </div>
        
        <div class="network-stats">
          <div class="stat-card">
            <div class="stat-value">{{ totalOrganizations() }}</div>
            <div class="stat-label">Total Orgs</div>
          </div>
          <div class="stat-card pending">
            <div class="stat-value">{{ pendingRequests() }}</div>
            <div class="stat-label">Pending</div>
            <div class="pending-indicator" [class.has-pending]="pendingRequests() > 0"></div>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <button mat-flat-button color="primary" (click)="openOrganizationManagement()">
          <mat-icon>corporate_fare</mat-icon>
          Manage Orgs
        </button>
      </div>
    </div>
  `,
  styles: [`
    .org-widget {
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
      background: linear-gradient(135deg, #FF5722, #FF7043);
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
    
    .org-network {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: center;
    }
    
    .network-visual {
      position: relative;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .central-node {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #FF5722, #FF7043);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      z-index: 2;
      position: relative;
    }
    
    .central-node mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .connection-lines {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    
    .line {
      position: absolute;
      height: 1px;
      background: linear-gradient(90deg, #FF5722, transparent);
      transform-origin: center;
    }
    
    .line-1 {
      width: 30px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(0deg);
    }
    
    .line-2 {
      width: 25px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(120deg);
    }
    
    .line-3 {
      width: 25px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(240deg);
    }
    
    .satellite-nodes {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    
    .node {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #FF9800;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    
    .node-1 {
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
    
    .node-2 {
      bottom: 15px;
      left: 25%;
    }
    
    .node-3 {
      top: 15px;
      left: 25%;
    }
    
    .network-stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .stat-card {
      padding: 12px;
      background: color-mix(in srgb, var(--theme-surface) 95%, var(--theme-primary));
      border-radius: 8px;
      text-align: center;
      position: relative;
    }
    
    .stat-card.pending {
      background: color-mix(in srgb, #FF9800 8%, transparent);
      border: 1px solid color-mix(in srgb, #FF9800 20%, transparent);
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #FF5722;
      line-height: 1;
    }
    
    .pending .stat-value {
      color: #FF9800;
    }
    
    .stat-label {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      margin-top: 4px;
    }
    
    .pending-indicator {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ccc;
    }
    
    .pending-indicator.has-pending {
      background: #F44336;
      animation: blink 1.5s infinite;
    }
    
    .action-section button {
      width: 100%;
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.3; }
    }
  `],
})
export class OrganizationManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  private orgService = inject(OrganizationManagementService);

  totalOrganizations = signal(0);
  pendingRequests = signal(0);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.orgService.getOrganizations().subscribe({
      next: (orgs) => {
        this.totalOrganizations.set(orgs.length);
      },
      error: (error) => {
        console.error('Failed to load organizations:', error);
        this.totalOrganizations.set(0);
      },
    });

    this.orgService.getOrganizationRequests().subscribe({
      next: (requests) => {
        const pendingCount = requests.filter(r => r.status === 'pending').length;
        this.pendingRequests.set(pendingCount);
      },
      error: (error) => {
        console.error('Failed to load organization requests:', error);
        this.pendingRequests.set(0);
      },
    });
  }

  openOrganizationManagement() {
    this.router.navigate(['/modules/organization-management']);
  }
}