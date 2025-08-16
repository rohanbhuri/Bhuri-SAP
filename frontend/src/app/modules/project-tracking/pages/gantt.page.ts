import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

interface TrackingTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-tracking-gantt',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="gantt-container">
      <div class="gantt-header">
        <h3>Project Tracking Timeline</h3>
        <div class="gantt-controls">
          <button mat-button (click)="zoomIn()"><mat-icon>zoom_in</mat-icon></button>
          <button mat-button (click)="zoomOut()"><mat-icon>zoom_out</mat-icon></button>
          <button mat-button (click)="resetZoom()"><mat-icon>fit_screen</mat-icon></button>
        </div>
      </div>

      <div class="gantt-content">
        <div class="gantt-sidebar">
          <div class="task-header">Tracking Tasks</div>
          <div *ngFor="let task of tasks" class="task-row">
            <div class="task-info">
              <div class="task-name" [matTooltip]="task.name">{{ task.name }}</div>
              <div class="task-meta">
                <span class="assignee">{{ task.assignee }}</span>
                <span class="priority" [class]="'priority-' + task.priority">{{ task.priority }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="gantt-timeline">
          <div class="timeline-header">
            <div *ngFor="let date of timelineDates" class="date-column">
              {{ date | date:'MMM dd' }}
            </div>
          </div>
          
          <div class="timeline-body">
            <div *ngFor="let task of tasks" class="timeline-row">
              <div class="task-bar-container">
                <div class="task-bar"
                     [style.left.%]="getTaskPosition(task).left"
                     [style.width.%]="getTaskPosition(task).width"
                     [class]="'priority-' + task.priority"
                     [matTooltip]="getTaskTooltip(task)">
                  <div class="task-progress" [style.width.%]="task.progress"></div>
                  <span class="task-label">{{ task.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gantt-container {
      height: calc(100vh - 200px);
      display: flex;
      flex-direction: column;
      background: var(--theme-surface);
      border-radius: 12px;
      overflow: hidden;
    }
    .gantt-header {
      padding: 16px;
      background: var(--theme-primary);
      color: var(--theme-on-primary);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .gantt-header h3 { margin: 0; font-size: 1.2rem; }
    .gantt-controls { display: flex; gap: 8px; }
    .gantt-controls button { color: var(--theme-on-primary); min-width: 40px; }
    .gantt-content { flex: 1; display: flex; overflow: hidden; }
    .gantt-sidebar {
      width: 300px;
      background: var(--theme-surface-variant);
      border-right: 1px solid var(--theme-outline);
      overflow-y: auto;
    }
    .task-header {
      padding: 16px;
      font-weight: 600;
      background: var(--theme-surface-container);
      border-bottom: 1px solid var(--theme-outline);
    }
    .task-row {
      padding: 12px 16px;
      border-bottom: 1px solid var(--theme-outline);
      height: 60px;
      display: flex;
      align-items: center;
    }
    .task-info { width: 100%; }
    .task-name {
      font-weight: 500;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .task-meta { display: flex; gap: 8px; font-size: 0.8rem; }
    .assignee { color: var(--theme-on-surface-variant); }
    .priority {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .priority-high { background: #ffebee; color: #c62828; }
    .priority-medium { background: #fff3e0; color: #ef6c00; }
    .priority-low { background: #e8f5e8; color: #2e7d32; }
    .gantt-timeline { flex: 1; overflow-x: auto; overflow-y: hidden; }
    .timeline-header {
      display: flex;
      background: var(--theme-surface-container);
      border-bottom: 1px solid var(--theme-outline);
      min-width: 800px;
    }
    .date-column {
      flex: 1;
      padding: 16px 8px;
      text-align: center;
      font-weight: 500;
      font-size: 0.9rem;
      border-right: 1px solid var(--theme-outline);
      min-width: 80px;
    }
    .timeline-body { min-width: 800px; }
    .timeline-row {
      height: 60px;
      border-bottom: 1px solid var(--theme-outline);
      position: relative;
    }
    .task-bar-container { height: 100%; position: relative; padding: 15px 0; }
    .task-bar {
      position: absolute;
      height: 30px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      padding: 0 8px;
      color: white;
      font-size: 0.8rem;
      font-weight: 500;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .task-bar:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
    .task-bar.priority-high { background: linear-gradient(135deg, #f44336, #d32f2f); }
    .task-bar.priority-medium { background: linear-gradient(135deg, #ff9800, #f57c00); }
    .task-bar.priority-low { background: linear-gradient(135deg, #4caf50, #388e3c); }
    .task-progress {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: rgba(255,255,255,0.3);
      border-radius: 6px;
      transition: width 0.3s ease;
    }
    .task-label {
      position: relative;
      z-index: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class TrackingGanttPageComponent implements OnInit {
  tasks: TrackingTask[] = [
    {
      id: '1',
      name: 'Project Kickoff',
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 0, 3),
      progress: 100,
      assignee: 'Project Manager',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Requirements Analysis',
      startDate: new Date(2024, 0, 4),
      endDate: new Date(2024, 0, 14),
      progress: 90,
      assignee: 'Business Analyst',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Development Phase 1',
      startDate: new Date(2024, 0, 15),
      endDate: new Date(2024, 1, 15),
      progress: 60,
      assignee: 'Dev Team',
      priority: 'medium'
    },
    {
      id: '4',
      name: 'Quality Assurance',
      startDate: new Date(2024, 1, 10),
      endDate: new Date(2024, 1, 25),
      progress: 30,
      assignee: 'QA Team',
      priority: 'medium'
    },
    {
      id: '5',
      name: 'User Acceptance Testing',
      startDate: new Date(2024, 1, 20),
      endDate: new Date(2024, 2, 5),
      progress: 10,
      assignee: 'Client Team',
      priority: 'low'
    }
  ];

  timelineDates: Date[] = [];
  private zoomLevel = 1;

  ngOnInit() {
    this.generateTimeline();
  }

  private generateTimeline() {
    const startDate = new Date(Math.min(...this.tasks.map(t => t.startDate.getTime())));
    const endDate = new Date(Math.max(...this.tasks.map(t => t.endDate.getTime())));
    
    startDate.setDate(startDate.getDate() - 2);
    endDate.setDate(endDate.getDate() + 2);

    this.timelineDates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      this.timelineDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  getTaskPosition(task: TrackingTask): { left: number; width: number } {
    if (this.timelineDates.length === 0) return { left: 0, width: 0 };

    const timelineStart = this.timelineDates[0].getTime();
    const timelineEnd = this.timelineDates[this.timelineDates.length - 1].getTime();
    const timelineWidth = timelineEnd - timelineStart;

    const taskStart = task.startDate.getTime();
    const taskEnd = task.endDate.getTime();

    const left = ((taskStart - timelineStart) / timelineWidth) * 100;
    const width = ((taskEnd - taskStart) / timelineWidth) * 100;

    return { left: Math.max(0, left), width: Math.max(1, width) };
  }

  getTaskTooltip(task: TrackingTask): string {
    return `${task.name}\nStart: ${task.startDate.toDateString()}\nEnd: ${task.endDate.toDateString()}\nProgress: ${task.progress}%\nAssignee: ${task.assignee}`;
  }

  zoomIn() { this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3); }
  zoomOut() { this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.5); }
  resetZoom() { this.zoomLevel = 1; }
}