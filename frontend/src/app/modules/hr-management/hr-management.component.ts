import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-hr-management',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div class="module-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>HR Management</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>HR Management module placeholder - Ready for AI agent implementation</p>
          <ul>
            <li>Employee Management</li>
            <li>Staff Records</li>
            <li>Department Management</li>
            <li>Performance Reviews</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .module-container { padding: 20px; }
  `]
})
export class HrManagementComponent {}