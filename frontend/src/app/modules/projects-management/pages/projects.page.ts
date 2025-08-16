import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Projects</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Detailed projects management page</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class ProjectsPageComponent {}