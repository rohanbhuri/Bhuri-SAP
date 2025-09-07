import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { CrmService, Task } from '../crm.service';
import { TaskDialogComponent } from '../dialogs/task-dialog.component';
import { AssignmentDialogComponent } from '../dialogs/assignment-dialog.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatMenuModule, MatProgressSpinnerModule, MatCheckboxModule
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Tasks & Reminders</h2>
        <div class="header-actions">
          <div class="selection-info" *ngIf="selection.hasValue()">
            <span>{{ selection.selected.length }} selected</span>
            <button mat-button (click)="openAssignmentDialog()">
              <mat-icon>person_add</mat-icon>
              Assign
            </button>
          </div>
          <button mat-raised-button color="primary" (click)="openTaskDialog()">
            <mat-icon>add_task</mat-icon>
            Add Task
          </button>
        </div>
      </div>
      
      <div class="cards-container">
        <div class="task-card" *ngFor="let task of displayedTasks()">
          <mat-card class="task-card-content" [class.completed]="task.status === 'completed'" [class.selected]="selection.isSelected(task)">
            <div class="card-header">
              <div class="task-info">
                <mat-checkbox 
                  (click)="$event.stopPropagation()"
                  (change)="$event ? selection.toggle(task) : null"
                  [checked]="selection.isSelected(task)"
                  class="task-checkbox">
                </mat-checkbox>
                <div class="task-details">
                  <div class="task-title">{{ task.title }}</div>
                  <div class="task-description" *ngIf="task.description">
                    {{ task.description | slice:0:100 }}{{ task.description && task.description.length > 100 ? '...' : '' }}
                  </div>
                </div>
              </div>
              <button mat-icon-button [matMenuTriggerFor]="taskMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #taskMenu="matMenu">
                <button mat-menu-item (click)="editTask(task)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="openAssignmentDialog([task])">
                  <mat-icon>person_add</mat-icon>
                  <span>Assign</span>
                </button>
                <button mat-menu-item (click)="toggleTaskStatus(task)">
                  <mat-icon>{{ task.status === 'completed' ? 'undo' : 'check' }}</mat-icon>
                  <span>{{ task.status === 'completed' ? 'Mark Pending' : 'Mark Complete' }}</span>
                </button>
                <button mat-menu-item (click)="deleteTask(task._id)">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </div>
            
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>category</mat-icon>
                  <mat-chip class="type-chip">{{ task.type | titlecase }}</mat-chip>
                </div>
                <div class="info-item">
                  <mat-icon>flag</mat-icon>
                  <mat-chip [color]="getTaskPriorityColor(task.priority)" class="priority-chip">
                    {{ task.priority | titlecase }}
                  </mat-chip>
                </div>
                <div class="info-item">
                  <mat-icon>info</mat-icon>
                  <mat-chip [color]="task.status === 'completed' ? 'primary' : 'accent'" class="status-chip">
                    {{ task.status | titlecase }}
                  </mat-chip>
                </div>
                <div class="info-item" *ngIf="task.dueDate">
                  <mat-icon [class.overdue]="isOverdue(task.dueDate)">schedule</mat-icon>
                  <span [class.overdue]="isOverdue(task.dueDate)">{{ task.dueDate | date:'MMM d, y' }}</span>
                </div>
                <div class="info-item" *ngIf="task.assignedTo">
                  <mat-icon>person</mat-icon>
                  <span>{{ task.assignedTo.firstName }} {{ task.assignedTo.lastName }}</span>
                </div>
                <div class="info-item" *ngIf="!task.assignedTo">
                  <mat-icon>person_off</mat-icon>
                  <span class="unassigned">Unassigned</span>
                </div>
              </div>
            </div>
            
            <div class="card-actions">
              <button mat-button color="primary" (click)="editTask(task)">
                <mat-icon>edit</mat-icon>
                Edit
              </button>
              <button mat-button [color]="task.status === 'completed' ? 'warn' : 'accent'" (click)="toggleTaskStatus(task)">
                <mat-icon>{{ task.status === 'completed' ? 'undo' : 'check' }}</mat-icon>
                {{ task.status === 'completed' ? 'Undo' : 'Complete' }}
              </button>
            </div>
          </mat-card>
        </div>
      </div>
      
      <div class="loading-container" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Loading more tasks...</span>
      </div>
      
      <div class="no-data" *ngIf="tasks().length === 0 && !loading()">
        <mat-icon>task_alt</mat-icon>
        <h3>No tasks found</h3>
        <p>Start by adding your first task</p>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 24px; min-height: 100vh; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: var(--theme-on-surface); }
    .header-actions { display: flex; align-items: center; gap: 16px; }
    .selection-info { display: flex; align-items: center; gap: 8px; color: #1976d2; font-weight: 500; }
    
    .cards-container { 
      display: grid; 
      gap: 20px;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
    
    .task-card-content {
      transition: all 0.3s ease;
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      position: relative;
    }
    
    .task-card-content:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
    }
    
    .task-card-content.completed {
      opacity: 0.7;
      border-left: 4px solid var(--theme-primary);
    }
    
    .task-card-content.completed::before {
      content: '✓';
      position: absolute;
      top: 16px;
      right: 16px;
      width: 24px;
      height: 24px;
      background: var(--theme-primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
    }
    
    .task-card-content.selected { border-color: #1976d2; background: rgba(25, 118, 210, 0.05); }
    .task-checkbox { margin-right: 12px; }
    .unassigned { color: rgba(0,0,0,0.6); font-style: italic; }
    
    .card-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start; 
      margin-bottom: 16px; 
      padding: 16px 16px 0;
    }
    
    .task-info { flex: 1; min-width: 0; display: flex; align-items: flex-start; gap: 12px; }
    .task-details { flex: 1; min-width: 0; }
    .task-title { font-weight: 600; margin-bottom: 6px; font-size: 16px; }
    .task-description { font-size: 14px; opacity: 0.8; line-height: 1.4; }
    
    .card-body { padding: 0 16px 16px; }
    
    .info-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); 
      gap: 12px; 
    }
    
    .info-item { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      font-size: 14px;
      padding: 8px;
      background: color-mix(in srgb, var(--theme-primary) 5%, transparent);
      border-radius: 6px;
    }
    
    .info-item mat-icon { 
      font-size: 18px; 
      width: 18px; 
      height: 18px; 
      opacity: 0.7; 
      flex-shrink: 0;
    }
    
    .info-item mat-icon.overdue { color: var(--theme-warn); opacity: 1; }
    .info-item span.overdue { color: var(--theme-warn); font-weight: 500; }
    
    .type-chip, .priority-chip, .status-chip { font-size: 11px; height: 22px; }
    
    .card-actions { 
      display: flex; 
      justify-content: flex-end; 
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
    
    .no-data mat-icon { 
      font-size: 64px; 
      width: 64px; 
      height: 64px; 
      margin-bottom: 16px; 
    }
    
    .no-data h3 { margin: 16px 0 8px; }
    .no-data p { margin: 0; }
    
    @media (max-width: 768px) {
      .page-content { padding: 16px; }
      .cards-container { 
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .page-header { 
        flex-direction: column; 
        gap: 16px; 
        align-items: stretch; 
      }
      .header-actions { 
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }
      .selection-info {
        justify-content: center;
      }
      .info-grid { grid-template-columns: 1fr; }
    }
    
    @media (max-width: 480px) {
      .card-actions { justify-content: center; }
    }
  `]
})
export class TasksPageComponent implements OnInit {
  private crmService = inject(CrmService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  tasks = signal<Task[]>([]);
  displayedTasks = signal<Task[]>([]);
  loading = signal(false);
  selection = new SelectionModel<Task>(true, []);
  
  private pageSize = 12;
  private currentPage = 0;
  private hasMoreData = true;

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading.set(true);
    this.currentPage = 0;
    this.displayedTasks.set([]);
    this.crmService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loadMoreTasks();
        this.loading.set(false);
        this.selection.clear();
      },
      error: () => this.loading.set(false)
    });
  }
  
  loadMoreTasks() {
    const allTasks = this.tasks();
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newTasks = allTasks.slice(startIndex, endIndex);
    
    if (newTasks.length > 0) {
      this.displayedTasks.set([...this.displayedTasks(), ...newTasks]);
      this.currentPage++;
      this.hasMoreData = endIndex < allTasks.length;
    } else {
      this.hasMoreData = false;
    }
  }
  
  @HostListener('window:scroll')
  onScroll() {
    if (this.hasMoreData && !this.loading()) {
      const threshold = 200;
      const position = window.pageYOffset + window.innerHeight;
      const height = document.documentElement.scrollHeight;
      
      if (position > height - threshold) {
        this.loadMoreTasks();
      }
    }
  }

  getTaskPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'low': 'primary',
      'medium': 'accent',
      'high': 'warn',
      'urgent': 'warn'
    };
    return colors[priority] || '';
  }
  
  isOverdue(dueDate: string | Date): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }
  
  toggleTaskStatus(task: Task) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updatedTask = { ...task, status: newStatus };
    
    this.crmService.updateTask(task._id, updatedTask).subscribe({
      next: (updated) => {
        const updatedTasks = this.tasks().map(t => t._id === task._id ? { ...t, ...updated } : t);
        const updatedDisplayed = this.displayedTasks().map(t => t._id === task._id ? { ...t, ...updated } : t);
        this.tasks.set(updatedTasks);
        this.displayedTasks.set(updatedDisplayed);
        this.snackBar.open(`Task marked as ${newStatus}`, 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Error updating task status', 'Close', { duration: 3000 })
    });
  }

  openTaskDialog(task?: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      data: task || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (task) {
          this.crmService.updateTask(task._id, result).subscribe({
            next: (updated) => {
              this.loadTasks();
              this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
            },
            error: () => this.snackBar.open('Error updating task', 'Close', { duration: 3000 })
          });
        } else {
          this.crmService.createTask(result).subscribe({
            next: (created) => {
              this.loadTasks();
              this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });
            },
            error: () => this.snackBar.open('Error creating task', 'Close', { duration: 3000 })
          });
        }
      }
    });
  }

  editTask(task: Task) {
    this.openTaskDialog(task);
  }

  openAssignmentDialog(tasks?: Task[]) {
    const selectedTasks = tasks || this.selection.selected;
    const currentAssignee = selectedTasks.length === 1 ? selectedTasks[0].assignedTo : undefined;
    
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {
      width: '500px',
      data: {
        type: 'task',
        items: selectedTasks,
        currentAssignee
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
        this.selection.clear();
      }
    });
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.crmService.deleteTask(id).subscribe({
        next: () => {
          const updatedTasks = this.tasks().filter(t => t._id !== id);
          const updatedDisplayed = this.displayedTasks().filter(t => t._id !== id);
          this.tasks.set(updatedTasks);
          this.displayedTasks.set(updatedDisplayed);
          this.selection.clear();
          this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error deleting task', 'Close', { duration: 3000 })
      });
    }
  }
}