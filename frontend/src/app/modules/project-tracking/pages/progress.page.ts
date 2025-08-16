import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-progress-page',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Progress Tracking</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Detailed progress tracking page</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class ProgressPageComponent {}