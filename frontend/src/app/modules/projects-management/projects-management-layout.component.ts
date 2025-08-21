import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

@Component({
  selector: 'app-projects-management-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NavbarComponent,
    BottomNavbarComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="module-container">
      <nav class="subnav">
        <a routerLink="projects" routerLinkActive="active">Projects</a>
        <a routerLink="deliverables" routerLinkActive="active">Deliverables</a>
        <a routerLink="analytics" routerLinkActive="active">Analytics</a>
        <a routerLink="gantt" routerLinkActive="active">Gantt Chart</a>
      </nav>
      <router-outlet></router-outlet>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [
    `
      .module-container {
        padding: 16px;
        max-width: 1400px;
        margin: 0 auto;
      }
      .subnav {
        display: flex;
        gap: 12px;
        border-bottom: 1px solid
          color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        margin-bottom: 12px;
        flex-wrap: wrap;
      }
      .subnav a {
        padding: 8px 12px;
        text-decoration: none;
        color: var(--theme-on-surface);
        border-radius: 8px 8px 0 0;
      }
      .subnav a.active {
        border-bottom: 2px solid var(--theme-primary);
        color: var(--theme-primary);
        font-weight: 600;
      }
    `,
  ],
})
export class ProjectsManagementLayoutComponent {}