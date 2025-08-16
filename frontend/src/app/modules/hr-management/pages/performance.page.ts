import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HrManagementService, GoalDto } from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hr-performance-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  template: `
    <mat-card>
      <h2>Performance</h2>

      <div class="new-goal">
        <mat-form-field appearance="outline">
          <mat-label>Goal Title</mat-label>
          <input matInput [(ngModel)]="newGoalTitle" />
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="createGoal()">
          <mat-icon>add</mat-icon>
          Add Goal
        </button>
      </div>

      <table mat-table [dataSource]="goals()" class="full-width">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let g">{{ g.title }}</td>
        </ng-container>
        <ng-container matColumnDef="progress">
          <th mat-header-cell *matHeaderCellDef>Progress</th>
          <td mat-cell *matCellDef="let g">{{ g.progress ?? 0 }}%</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols"></tr>
      </table>
    </mat-card>
  `,
  styles: [
    `
      .new-goal {
        display: flex;
        gap: 12px;
        align-items: center;
        margin: 16px 0;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class PerformancePageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  goals = signal<GoalDto[]>([]);
  cols = ['title', 'progress'];

  newGoalTitle = '';

  private get employeeId(): string {
    return this.auth.getCurrentUser()?.id || '';
  }
  private get organizationId(): string {
    return this.auth.getCurrentUser()?.organizationId || '';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.hr
      .listGoals({ employeeId: this.employeeId })
      .subscribe((list) => this.goals.set(list));
  }

  createGoal(): void {
    if (!this.employeeId || !this.newGoalTitle) return;
    this.hr
      .createGoal({ employeeId: this.employeeId, title: this.newGoalTitle })
      .subscribe(() => {
        this.newGoalTitle = '';
        this.load();
      });
  }
}
