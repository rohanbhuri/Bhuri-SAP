import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { HrManagementService, HrStats } from '../hr-management.service';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hr-analytics-page',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, DecimalPipe],
  template: `
    <div class="grid">
      <mat-card>
        <h3>Total Employees</h3>
        <h1>{{ stats().total }}</h1>
      </mat-card>
      <mat-card>
        <h3>Active</h3>
        <h1>{{ stats().active }}</h1>
      </mat-card>
      <mat-card>
        <h3>Departments</h3>
        <h1>{{ stats().departments }}</h1>
      </mat-card>
      <mat-card>
        <h3>Avg Salary</h3>
        <h1>{{ stats().averageSalary | number : '1.0-0' }}</h1>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
      }
    `,
  ],
})
export class AnalyticsPageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  stats = signal<HrStats>({
    total: 0,
    active: 0,
    departments: 0,
    averageSalary: 0,
    newHires: 0,
  });

  ngOnInit(): void {
    this.hr.getStats().subscribe((s) => this.stats.set(s));
  }
}
