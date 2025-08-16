import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-deliverables-page',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Deliverables</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Detailed deliverables management page</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class DeliverablesPageComponent {}