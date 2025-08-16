import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Project Analytics</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Detailed project analytics page</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class AnalyticsPageComponent {}