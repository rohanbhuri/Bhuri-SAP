import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { HrManagementService, GoalDto } from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';
import { GoalDialogComponent } from '../dialogs/goal-dialog.component';

@Component({
  selector: 'app-hr-performance-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Performance Management</h2>
        <button mat-raised-button color="primary" (click)="openGoalDialog()">
          <mat-icon>add</mat-icon>
          Add Goal
        </button>
      </div>



      <div class="cards-container">
        <div class="goal-card" *ngFor="let goal of displayedGoals()">
          <mat-card class="goal-card-content">
            <div class="card-header">
              <div class="goal-info">
                <mat-icon>flag</mat-icon>
                <span class="goal-title">{{ goal.title }}</span>
              </div>
              <div class="progress-badge" [class.completed]="(goal.progress || 0) >= 100">
                {{ goal.progress || 0 }}%
              </div>
            </div>
            
            <div class="card-body">
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="goal.progress ?? 0"></div>
                </div>
                <div class="progress-labels">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
            
            <div class="card-actions">
              <button mat-button color="primary" (click)="openGoalDialog(goal)">
                <mat-icon>edit</mat-icon>
                Edit
              </button>
              <button mat-button color="accent" (click)="bumpProgress(goal, 10)" [disabled]="(goal.progress || 0) >= 100">
                <mat-icon>add</mat-icon>
                +10%
              </button>
            </div>
          </mat-card>
        </div>
      </div>
      
      <div class="loading-container" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Loading more goals...</span>
      </div>
      
      <div class="no-data" *ngIf="goals().length === 0 && !loading()">
        <mat-icon>flag</mat-icon>
        <h3>No performance goals found</h3>
        <p>Create your first performance goal above</p>
        <p style="color: red;">DEBUG: Updated component template</p>
      </div>
    </div>
  `,
  styles: [
    `
      .page-content { padding: 24px; min-height: 100vh; }
      .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
      .page-header h2 { margin: 0; color: var(--theme-on-surface); font-size: 24px; font-weight: 500; }
      
      .goal-form-section {
        background: var(--theme-surface);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }
      
      .goal-form-section h3 { margin: 0 0 16px 0; color: var(--theme-on-surface); font-size: 18px; font-weight: 500; }
      .new-goal { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
      
      .cards-container { 
        display: grid; 
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      }
      
      .goal-card-content {
        transition: all 0.3s ease;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }
      
      .goal-card-content:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
      }
      
      .card-header { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 16px; 
        padding: 16px 16px 0;
      }
      
      .goal-info { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
      .goal-info mat-icon { color: var(--theme-primary); flex-shrink: 0; }
      .goal-title { font-weight: 500; word-break: break-word; }
      
      .progress-badge {
        background: color-mix(in srgb, var(--theme-accent) 20%, transparent);
        color: var(--theme-accent);
        padding: 4px 12px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        flex-shrink: 0;
      }
      
      .progress-badge.completed {
        background: color-mix(in srgb, var(--theme-primary) 20%, transparent);
        color: var(--theme-primary);
      }
      
      .card-body { padding: 0 16px 16px; }
      
      .progress-section { margin-bottom: 16px; }
      
      .progress-bar {
        width: 100%;
        height: 12px;
        background: color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 8px;
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--theme-primary), var(--theme-accent));
        transition: width 0.3s ease;
        border-radius: 6px;
      }
      
      .progress-labels {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        opacity: 0.7;
      }
      
      .card-actions { 
        display: flex; 
        justify-content: center; 
        gap: 8px; 
        padding: 0 16px 16px;
        border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
        margin-top: 16px;
        padding-top: 16px;
      }
      
      .loading-container { 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        gap: 16px; 
        padding: 40px; 
        color: var(--theme-on-surface);
        opacity: 0.7;
      }
      
      .no-data { 
        text-align: center; 
        padding: 60px 20px; 
        color: var(--theme-on-surface); 
        opacity: 0.6; 
      }
      
      .no-data mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; }
      .no-data h3 { margin: 16px 0 8px; }
      .no-data p { margin: 0; }
      
      @media (max-width: 768px) {
        .page-content { padding: 16px; }
        .cards-container { grid-template-columns: 1fr; gap: 16px; }
        .page-header { flex-direction: column; gap: 16px; align-items: stretch; }
        .new-goal { flex-direction: column; align-items: stretch; }
      }
    `,
  ],
})
export class PerformancePageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  goals = signal<GoalDto[]>([]);
  displayedGoals = signal<GoalDto[]>([]);
  loading = signal(false);
  
  private pageSize = 12;
  private currentPage = 0;
  private hasMoreData = true;

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
    this.loading.set(true);
    this.currentPage = 0;
    this.hasMoreData = true;
    this.displayedGoals.set([]);
    
    this.hr.listGoals({ organizationId: this.organizationId }).subscribe({
      next: (list) => {
        this.goals.set(list);
        this.loadMoreGoals();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  
  loadMoreGoals(): void {
    const allGoals = this.goals();
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newGoals = allGoals.slice(startIndex, endIndex);
    
    if (newGoals.length > 0) {
      this.displayedGoals.set([...this.displayedGoals(), ...newGoals]);
      this.currentPage++;
      this.hasMoreData = endIndex < allGoals.length;
    } else {
      this.hasMoreData = false;
    }
  }
  
  @HostListener('window:scroll')
  onScroll(): void {
    if (this.hasMoreData && !this.loading()) {
      const threshold = 200;
      const position = window.pageYOffset + window.innerHeight;
      const height = document.documentElement.scrollHeight;
      
      if (position > height - threshold) {
        this.loadMoreGoals();
      }
    }
  }

  openGoalDialog(goal?: GoalDto): void {
    const dialogRef = this.dialog.open(GoalDialogComponent, {
      width: '500px',
      data: goal || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (goal) {
        this.hr.updateGoal(goal._id!, result).subscribe({
          next: (updated) => {
            const updatedGoals = this.goals().map(g => g._id === goal._id ? { ...g, ...updated } : g);
            const updatedDisplayed = this.displayedGoals().map(g => g._id === goal._id ? { ...g, ...updated } : g);
            this.goals.set(updatedGoals);
            this.displayedGoals.set(updatedDisplayed);
            this.snackBar.open('Goal updated successfully', 'Close', { duration: 3000 });
          },
          error: () => this.snackBar.open('Error updating goal', 'Close', { duration: 3000 })
        });
      } else {
        const goalData = {
          ...result,
          employeeId: this.employeeId
        };

        this.hr.createGoal(goalData).subscribe({
          next: (created) => {
            if (created && created._id) {
              this.goals.set([created, ...this.goals()]);
              this.displayedGoals.set([created, ...this.displayedGoals()]);
            } else {
              this.load();
            }
            this.snackBar.open('Goal created successfully', 'Close', { duration: 3000 });
          },
          error: () => this.snackBar.open('Error creating goal', 'Close', { duration: 3000 })
        });
      }
    });
  }

  bumpProgress(g: GoalDto, delta: number): void {
    const id = g._id;
    if (!id) return;
    const next = Math.max(0, Math.min(100, (g.progress ?? 0) + delta));
    this.hr.updateGoal(id, { progress: next }).subscribe(() => {
      // Update the goal in both arrays
      const updatedGoals = this.goals().map(goal => 
        goal._id === id ? { ...goal, progress: next } : goal
      );
      const updatedDisplayed = this.displayedGoals().map(goal => 
        goal._id === id ? { ...goal, progress: next } : goal
      );
      this.goals.set(updatedGoals);
      this.displayedGoals.set(updatedDisplayed);
    });
  }
}
