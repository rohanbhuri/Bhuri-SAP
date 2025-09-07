import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import {
  CrmService,
  CrmStats,
  ConversionReport,
  Contact,
  Lead,
  Deal,
  Task,
} from './crm.service';

@Component({
  selector: 'app-crm-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="crm-widget" (mouseenter)="pauseAutoSlide()" (mouseleave)="resumeAutoSlide()">
      <div class="header">
        <div class="icon-container">
          <mat-icon>business_center</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Customer relationship management</span>
        </div>
      </div>

      <div class="slider-container">
        <div
          class="slider-wrapper"
          [style.transform]="'translateX(-' + currentSlide() * 100 + '%)'"
        >
          <!-- Overview Card -->
          <div class="slide">
            <div class="card-content">
              <div class="pipeline-overview">
                <div class="pipeline-value">
                  <div class="value">
                    \${{ formatCurrency(stats().pipelineValue) }}
                  </div>
                  <div class="label">Pipeline</div>
                </div>
                <div class="conversion-rate">
                  <div class="rate">
                    {{ conversionReport()?.dealWinRate || 0 }}%
                  </div>
                  <div class="label">Win Rate</div>
                </div>
              </div>
              <div class="metrics-grid">
                <div class="metric">
                  <div class="metric-number contacts">
                    {{ stats().contacts }}
                  </div>
                  <div class="metric-label">Contacts</div>
                </div>
                <div class="metric">
                  <div class="metric-number leads">{{ stats().leads }}</div>
                  <div class="metric-label">Leads</div>
                </div>
                <div class="metric">
                  <div class="metric-number deals">{{ stats().deals }}</div>
                  <div class="metric-label">Deals</div>
                </div>
                <div class="metric">
                  <div class="metric-number tasks">
                    {{ stats().pendingTasks }}
                  </div>
                  <div class="metric-label">Tasks</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Funnel Card -->
          <div class="slide">
            <div class="card-content">
              <div class="card-title">Conversion Funnel</div>
              <div class="funnel-stages">
                <div class="stage">
                  <div class="stage-value">
                    {{ conversionReport()?.totalContacts || 0 }}
                  </div>
                  <div class="stage-label">Contacts</div>
                </div>
                <div class="stage-arrow">→</div>
                <div class="stage">
                  <div class="stage-value">
                    {{ conversionReport()?.totalLeads || 0 }}
                  </div>
                  <div class="stage-label">Leads</div>
                  <div class="stage-rate">
                    {{ conversionReport()?.contactToLeadRate || 0 }}%
                  </div>
                </div>
                <div class="stage-arrow">→</div>
                <div class="stage">
                  <div class="stage-value">
                    {{ conversionReport()?.wonDeals || 0 }}
                  </div>
                  <div class="stage-label">Won</div>
                  <div class="stage-rate">
                    {{ conversionReport()?.dealWinRate || 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pipeline Card -->
          <div class="slide">
            <div class="card-content">
              <div class="card-title">Deal Pipeline</div>
              <div class="pipeline-stages" *ngIf="getDealStages().length > 0">
                <div
                  class="stage-item"
                  *ngFor="let stage of getDealStages().slice(0, 4)"
                >
                  <div class="stage-header">
                    <span class="stage-name">{{ stage.name }}</span>
                    <span class="stage-count">{{ stage.count }}</span>
                  </div>
                  <mat-progress-bar
                    [value]="stage.percentage"
                    mode="determinate"
                  ></mat-progress-bar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation">
        <div class="slider-dots">
          <button
            class="dot"
            [class.active]="currentSlide() === 0"
            (click)="goToSlide(0)"
          ></button>
          <button
            class="dot"
            [class.active]="currentSlide() === 1"
            (click)="goToSlide(1)"
          ></button>
          <button
            class="dot"
            [class.active]="currentSlide() === 2"
            (click)="goToSlide(2)"
          ></button>
        </div>
        <button
          mat-flat-button
          color="primary"
          class="crm-button"
          (click)="openCrm()"
        >
          <mat-icon>business_center</mat-icon>
          Open CRM
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .crm-widget {
        padding: 12px;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }

      .icon-container {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: linear-gradient(135deg, #4caf50, #66bb6a);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .icon-container mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .subtitle {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
        font-weight: 600;
      }

      .slider-container {
        flex: 1;
        overflow: hidden;
        border-radius: 8px;
      }

      .slider-wrapper {
        display: flex;
        transition: transform 0.3s ease;
        height: 100%;
      }

      .slide {
        min-width: 100%;
        height: 100%;
      }

      .card-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .card-title {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--theme-on-surface);
        margin-bottom: 8px;
      }

      .pipeline-overview {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 8px;
        padding: 10px;
        background: linear-gradient(
          135deg,
          color-mix(in srgb, #4caf50 10%, transparent),
          color-mix(in srgb, #4caf50 5%, transparent)
        );
        border-radius: 6px;
        border: 1px solid color-mix(in srgb, #4caf50 20%, transparent);
      }

      .pipeline-value .value {
        font-size: 1.4rem;
        font-weight: 700;
        color: #4caf50;
        line-height: 1;
      }

      .conversion-rate .rate {
        font-size: 1.2rem;
        font-weight: 700;
        color: #ff9800;
        line-height: 1;
      }

      .pipeline-value .label,
      .conversion-rate .label {
        font-size: 0.7rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        margin-top: 2px;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }

      .metric {
        text-align: center;
        padding: 6px;
        border-radius: 4px;
        background: color-mix(
          in srgb,
          var(--theme-surface) 95%,
          var(--theme-primary)
        );
      }

      .metric-number {
        font-size: 1.1rem;
        font-weight: 600;
        line-height: 1;
      }

      .metric-number.contacts {
        color: #9c27b0;
      }
      .metric-number.leads {
        color: #2196f3;
      }
      .metric-number.deals {
        color: #ff5722;
      }
      .metric-number.tasks {
        color: #ff9800;
      }

      .metric-label {
        font-size: 0.65rem;
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
        margin-top: 2px;
      }

      .funnel-stages {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        padding: 8px;
        background: color-mix(
          in srgb,
          var(--theme-surface) 98%,
          var(--theme-primary)
        );
        border-radius: 6px;
      }

      .stage {
        text-align: center;
        flex: 1;
      }

      .stage-value {
        font-size: 1rem;
        font-weight: 700;
        color: var(--theme-primary);
      }

      .stage-label {
        font-size: 0.6rem;
        color: var(--theme-on-surface);
        opacity: 0.7;
        margin-top: 2px;
      }

      .stage-rate {
        font-size: 0.55rem;
        color: var(--theme-accent);
        font-weight: 600;
        margin-top: 1px;
      }

      .stage-arrow {
        font-size: 12px;
        color: var(--theme-on-surface);
        opacity: 0.5;
      }

      .pipeline-stages {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .stage-item {
        margin-bottom: 6px;
      }

      .stage-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3px;
      }

      .stage-name {
        font-size: 0.65rem;
        font-weight: 500;
      }

      .stage-count {
        font-size: 0.65rem;
        color: var(--theme-primary);
        font-weight: 600;
      }

      .navigation {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .slider-dots {
        display: flex;
        gap: 6px;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: none;
        background: color-mix(
          in srgb,
          var(--theme-on-surface) 30%,
          transparent
        );
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .dot.active {
        background: var(--theme-primary);
      }

      .crm-button {
        height: 32px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .crm-button mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
    `,
  ],
})
export class CrmWidgetComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private crmService = inject(CrmService);

  stats = signal<CrmStats>({
    contacts: 0,
    leads: 0,
    deals: 0,
    pendingTasks: 0,
    pipelineValue: 0,
  });

  conversionReport = signal<ConversionReport | null>(null);
  deals = signal<Deal[]>([]);
  currentSlide = signal(0);
  private slideInterval: any;

  ngOnInit() {
    this.loadAllData();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      const nextSlide = (this.currentSlide() + 1) % 3;
      this.currentSlide.set(nextSlide);
    }, 5000);
  }

  pauseAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  resumeAutoSlide() {
    this.startAutoSlide();
  }

  loadAllData() {
    this.loadStats();
    this.loadConversionReport();
    this.loadDeals();
  }

  loadStats() {
    this.crmService.getDashboardStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => {
        this.stats.set({
          contacts: 0,
          leads: 0,
          deals: 0,
          pendingTasks: 0,
          pipelineValue: 0,
        });
      },
    });
  }

  loadConversionReport() {
    this.crmService.getConversionReport().subscribe({
      next: (report) => this.conversionReport.set(report),
      error: () => this.conversionReport.set(null),
    });
  }

  loadDeals() {
    this.crmService.getDeals().subscribe({
      next: (deals) => this.deals.set(deals),
      error: () => this.deals.set([]),
    });
  }

  formatCurrency(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K';
    }
    return value.toString();
  }

  getDealStages() {
    const stages = [
      'prospecting',
      'qualification',
      'proposal',
      'negotiation',
      'closed-won',
      'closed-lost',
    ];
    const totalDeals = this.deals().length;

    return stages
      .map((stage) => {
        const stageDeals = this.deals().filter((deal) => deal.stage === stage);
        const count = stageDeals.length;
        const percentage = totalDeals > 0 ? (count / totalDeals) * 100 : 0;

        return {
          name:
            stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
          count,
          percentage,
        };
      })
      .filter((stage) => stage.count > 0);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
    // Reset auto-slide timer when user manually navigates
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startAutoSlide();
    }
  }

  openCrm() {
    this.router.navigate(['/modules/crm'], {
      queryParams: { tab: 'contacts' },
    });
  }
}
