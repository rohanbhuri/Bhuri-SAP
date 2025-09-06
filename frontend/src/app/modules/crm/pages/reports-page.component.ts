import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { CrmService, CrmStats, ConversionReport, Contact, Lead, Deal, Task } from '../crm.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatChipsModule],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Reports & Analytics</h2>
        <button mat-raised-button color="primary" (click)="refreshData()">
          <mat-icon>refresh</mat-icon>
          Refresh Data
        </button>
      </div>
      
      <div class="reports-grid">
        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ stats()?.contacts || 0 }}</div>
                <div class="stat-label">Total Contacts</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ stats()?.leads || 0 }}</div>
                <div class="stat-label">Active Leads</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ stats()?.deals || 0 }}</div>
                <div class="stat-label">Open Deals</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">\${{ (stats()?.pipelineValue || 0) | number:'1.0-0' }}</div>
                <div class="stat-label">Pipeline Value</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Task Status</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="task-stats">
              <div class="task-item">
                <div class="task-value">{{ stats()?.pendingTasks || 0 }}</div>
                <div class="task-label">Pending</div>
              </div>
              <div class="task-item">
                <div class="task-value">{{ getTasksByStatus('in-progress').length }}</div>
                <div class="task-label">In Progress</div>
              </div>
              <div class="task-item">
                <div class="task-value">{{ getTasksByStatus('completed').length }}</div>
                <div class="task-label">Completed</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card conversion-card">
          <mat-card-header>
            <mat-card-title>Conversion Funnel</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="conversion-stats">
              <div class="conversion-item">
                <div class="conversion-value">{{ conversionReport()?.totalContacts || 0 }}</div>
                <div class="conversion-label">Contacts</div>
              </div>
              <div class="conversion-arrow">→</div>
              <div class="conversion-item">
                <div class="conversion-value">{{ conversionReport()?.totalLeads || 0 }}</div>
                <div class="conversion-label">Leads</div>
                <div class="conversion-rate">{{ conversionReport()?.contactToLeadRate || 0 }}%</div>
              </div>
              <div class="conversion-arrow">→</div>
              <div class="conversion-item">
                <div class="conversion-value">{{ conversionReport()?.totalDeals || 0 }}</div>
                <div class="conversion-label">Deals</div>
                <div class="conversion-rate">{{ conversionReport()?.leadToDealRate || 0 }}%</div>
              </div>
              <div class="conversion-arrow">→</div>
              <div class="conversion-item">
                <div class="conversion-value">{{ conversionReport()?.wonDeals || 0 }}</div>
                <div class="conversion-label">Won</div>
                <div class="conversion-rate">{{ conversionReport()?.dealWinRate || 0 }}%</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Deal Pipeline</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="pipeline-stages">
              <div class="stage-item" *ngFor="let stage of getDealStages()">
                <div class="stage-header">
                  <span class="stage-name">{{ stage.name }}</span>
                  <span class="stage-count">{{ stage.count }}</span>
                </div>
                <mat-progress-bar [value]="stage.percentage" mode="determinate"></mat-progress-bar>
                <div class="stage-value">\${{ stage.value | number:'1.0-0' }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Lead Sources</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="source-chips">
              <mat-chip-set>
                <mat-chip *ngFor="let source of getLeadSources()" [highlighted]="true">
                  {{ source.name }} ({{ source.count }})
                </mat-chip>
              </mat-chip-set>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item" *ngFor="let activity of getRecentActivity()">
                <mat-icon [class]="'activity-icon ' + activity.type">{{ activity.icon }}</mat-icon>
                <div class="activity-content">
                  <div class="activity-text">{{ activity.text }}</div>
                  <div class="activity-time">{{ activity.time | date:'short' }}</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: var(--theme-on-surface); }
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .conversion-card { grid-column: 1 / -1; }
    .conversion-stats { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .conversion-item { text-align: center; flex: 1; }
    .conversion-value { font-size: 24px; font-weight: 700; color: var(--theme-primary); }
    .conversion-label { font-size: 12px; color: var(--theme-on-surface); opacity: 0.7; margin-top: 4px; }
    .conversion-rate { font-size: 10px; color: var(--theme-accent); font-weight: 600; margin-top: 2px; }
    .conversion-arrow { font-size: 20px; color: var(--theme-on-surface); opacity: 0.5; }
    .stats-card { background: var(--theme-surface); border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent); border-radius: 12px; box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-on-surface) 8%, transparent); }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .stat-item { text-align: center; }
    .stat-value { font-size: 32px; font-weight: 700; color: var(--theme-primary); margin-bottom: 8px; }
    .stat-label { font-size: 14px; color: var(--theme-on-surface); opacity: 0.7; font-weight: 500; }
    .task-stats { display: flex; justify-content: space-around; }
    .task-item { text-align: center; }
    .task-value { font-size: 24px; font-weight: 700; color: var(--theme-primary); }
    .task-label { font-size: 12px; color: var(--theme-on-surface); opacity: 0.7; margin-top: 4px; }
    .pipeline-stages { display: flex; flex-direction: column; gap: 16px; }
    .stage-item { }
    .stage-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .stage-name { font-weight: 500; }
    .stage-count { color: var(--theme-primary); font-weight: 600; }
    .stage-value { text-align: right; font-size: 12px; color: var(--theme-on-surface); opacity: 0.7; margin-top: 4px; }
    .source-chips { margin-top: 8px; }
    .activity-list { display: flex; flex-direction: column; gap: 12px; max-height: 300px; overflow-y: auto; }
    .activity-item { display: flex; align-items: center; gap: 12px; }
    .activity-icon { width: 20px; height: 20px; font-size: 20px; }
    .activity-icon.contact { color: var(--theme-primary); }
    .activity-icon.lead { color: var(--theme-accent); }
    .activity-icon.deal { color: var(--theme-success); }
    .activity-content { flex: 1; }
    .activity-text { font-size: 14px; color: var(--theme-on-surface); }
    .activity-time { font-size: 12px; color: var(--theme-on-surface); opacity: 0.6; }
    @media (max-width: 768px) { .reports-grid { grid-template-columns: 1fr; } .stats-grid { grid-template-columns: 1fr; gap: 16px; } .page-header { flex-direction: column; gap: 16px; align-items: flex-start; } }
  `]
})
export class ReportsPageComponent implements OnInit {
  private crmService = inject(CrmService);
  stats = signal<CrmStats | null>(null);
  conversionReport = signal<ConversionReport | null>(null);
  contacts = signal<Contact[]>([]);
  leads = signal<Lead[]>([]);
  deals = signal<Deal[]>([]);
  tasks = signal<Task[]>([]);

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loadStats();
    this.loadConversionReport();
    this.loadContacts();
    this.loadLeads();
    this.loadDeals();
    this.loadTasks();
  }

  refreshData() {
    this.loadAllData();
  }

  loadStats() {
    this.crmService.getDashboardStats().subscribe(stats => this.stats.set(stats));
  }

  loadConversionReport() {
    this.crmService.getConversionReport().subscribe(report => this.conversionReport.set(report));
  }

  loadContacts() {
    this.crmService.getContacts().subscribe(contacts => this.contacts.set(contacts));
  }

  loadLeads() {
    this.crmService.getLeads().subscribe(leads => this.leads.set(leads));
  }

  loadDeals() {
    this.crmService.getDeals().subscribe(deals => this.deals.set(deals));
  }

  loadTasks() {
    this.crmService.getTasks().subscribe(tasks => this.tasks.set(tasks));
  }

  getTasksByStatus(status: string) {
    return this.tasks().filter(task => task.status === status);
  }

  getDealStages() {
    const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
    const totalDeals = this.deals().length;
    
    return stages.map(stage => {
      const stageDeals = this.deals().filter(deal => deal.stage === stage);
      const count = stageDeals.length;
      const value = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const percentage = totalDeals > 0 ? (count / totalDeals) * 100 : 0;
      
      return {
        name: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
        count,
        value,
        percentage
      };
    });
  }

  getLeadSources() {
    const sources = this.leads().reduce((acc, lead) => {
      const source = lead.source || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sources).map(([name, count]) => ({ name, count }));
  }

  getRecentActivity() {
    const activities: any[] = [];
    
    // Recent contacts
    this.contacts().slice(-3).forEach(contact => {
      activities.push({
        type: 'contact',
        icon: 'person_add',
        text: `New contact: ${contact.firstName} ${contact.lastName}`,
        time: contact.createdAt
      });
    });

    // Recent leads
    this.leads().slice(-3).forEach(lead => {
      activities.push({
        type: 'lead',
        icon: 'trending_up',
        text: `New lead: ${lead.title}`,
        time: lead.createdAt
      });
    });

    // Recent deals
    this.deals().slice(-3).forEach(deal => {
      activities.push({
        type: 'deal',
        icon: 'handshake',
        text: `New deal: ${deal.title} - $${deal.value}`,
        time: deal.createdAt
      });
    });

    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
  }
}