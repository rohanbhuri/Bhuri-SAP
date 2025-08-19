import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttChartComponent, GanttConfig } from '../../../components/gantt-chart.component';
import { ProjectsManagementService, Project } from '../../projects-management/projects-management.service';

@Component({
  selector: 'app-timesheet-gantt',
  standalone: true,
  imports: [CommonModule, GanttChartComponent],
  template: `
    <app-gantt-chart 
      [data]="ganttData" 
      [config]="ganttConfig">
    </app-gantt-chart>
  `,

})
export class TimesheetGanttPageComponent implements OnInit {
  private projectsService = inject(ProjectsManagementService);
  
  ganttData: any[] = [];

  ganttConfig: GanttConfig = {
    title: 'Project Timeline',
    taskNameField: 'name',
    startDateField: 'startDate',
    endDateField: 'endDate',
    progressField: 'progress',
    idField: '_id',
    displayFields: ['status', 'priority'],
    colorField: 'status',
    colorMap: {
      'planning': 'linear-gradient(135deg, #9e9e9e, #757575)',
      'active': 'linear-gradient(135deg, #2196f3, #1976d2)',
      'on-hold': 'linear-gradient(135deg, #ff9800, #f57c00)',
      'completed': 'linear-gradient(135deg, #4caf50, #388e3c)',
      'cancelled': 'linear-gradient(135deg, #f44336, #d32f2f)'
    }
  };

  ngOnInit() {
    this.loadProjects();
  }

  private loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.ganttData = projects.map(project => ({
          ...project,
          startDate: new Date(project.startDate),
          endDate: new Date(project.endDate)
        }));
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        // Fallback to demo data if API fails
        this.ganttData = [
          {
            _id: '1',
            name: 'Demo Project 1',
            startDate: new Date(2024, 0, 1),
            endDate: new Date(2024, 0, 15),
            progress: 75,
            status: 'active',
            priority: 'high'
          },
          {
            _id: '2',
            name: 'Demo Project 2',
            startDate: new Date(2024, 0, 10),
            endDate: new Date(2024, 0, 25),
            progress: 50,
            status: 'on-hold',
            priority: 'medium'
          }
        ];
      }
    });
  }


}