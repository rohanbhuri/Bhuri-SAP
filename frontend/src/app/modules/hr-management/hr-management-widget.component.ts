import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HrManagementService, HrStats } from './hr-management.service';

@Component({
  selector: 'app-hr-management-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="hr-widget">
      <div class="header">
        <div class="icon-container">
          <mat-icon>person_pin</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Human resources overview</span>
        </div>
      </div>
      
      <div class="workforce-summary">
        <div class="employee-count">
          <div class="count-display">
            <div class="total-count">{{ stats().total }}</div>
            <div class="active-count">{{ stats().active }} active</div>
          </div>
          <div class="employee-visual">
            <div class="employee-icons">
              @for (i of getEmployeeIcons(); track i) {
                <mat-icon class="employee-icon">person</mat-icon>
              }
            </div>
          </div>
        </div>
      </div>
      
      <div class="department-overview">
        <div class="dept-header">
          <span class="dept-title">Departments</span>
          <span class="dept-count">{{ stats().departments }}</span>
        </div>
        
        <div class="dept-grid">
          @for (dept of getDepartments(); track dept.name) {
            <div class="dept-item">
              <div class="dept-dot" [style.background]="dept.color"></div>
              <span class="dept-name">{{ dept.name }}</span>
            </div>
          }
        </div>
      </div>
      
      <div class="action-section">
        <button mat-flat-button color="primary" (click)="openModule()">
          <mat-icon>badge</mat-icon>
          Manage HR
        </button>
      </div>
    </div>
  `,
  styles: [`
    .hr-widget {
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
      background: linear-gradient(135deg, #FF9800, #FFB74D);
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
    
    .workforce-summary {
      padding: 16px;
      background: linear-gradient(135deg, color-mix(in srgb, #FF9800 8%, transparent), color-mix(in srgb, #FF9800 4%, transparent));
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, #FF9800 20%, transparent);
    }
    
    .employee-count {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: center;
    }
    
    .total-count {
      font-size: 2.2rem;
      font-weight: 700;
      color: #FF9800;
      line-height: 1;
    }
    
    .active-count {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      margin-top: 4px;
    }
    
    .employee-visual {
      display: flex;
      justify-content: center;
    }
    
    .employee-icons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
    }
    
    .employee-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #FF9800;
      opacity: 0.7;
    }
    
    .department-overview {
      flex: 1;
    }
    
    .dept-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .dept-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--theme-on-surface);
    }
    
    .dept-count {
      font-size: 1.2rem;
      font-weight: 700;
      color: #FF9800;
    }
    
    .dept-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    
    .dept-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      background: color-mix(in srgb, var(--theme-surface) 95%, var(--theme-primary));
      border-radius: 6px;
    }
    
    .dept-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .dept-name {
      font-size: 0.75rem;
      color: var(--theme-on-surface);
      font-weight: 500;
    }
    
    .action-section button {
      width: 100%;
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
    }
  `],
})
export class HrManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  private hrService = inject(HrManagementService);
  stats = signal<HrStats>({
    total: 0,
    active: 0,
    departments: 0,
    averageSalary: 0,
    newHires: 0,
  });
  
  getEmployeeIcons(): number[] {
    const total = Math.min(this.stats().total, 9);
    return Array(total).fill(0).map((_, i) => i);
  }
  
  getDepartments() {
    return [
      { name: 'Engineering', color: '#2196F3' },
      { name: 'Sales', color: '#4CAF50' },
      { name: 'Marketing', color: '#FF9800' },
      { name: 'Support', color: '#9C27B0' }
    ].slice(0, this.stats().departments);
  }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.hrService.getStats().subscribe((data) => {
      this.stats.set(data);
    });
  }

  openModule() {
    this.router.navigate(['/modules/hr-management']);
  }
}
