import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { Router } from '@angular/router';
import { ModulesService, AppModuleInfo } from '../../services/modules.service';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatIconModule, MatSlideToggleModule, NavbarComponent, BottomNavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>More Options</mat-card-title>
          <mat-card-subtitle>Pin/Unpin modules in bottom navigation</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            @for (module of activeModules(); track module.id) {
              <mat-list-item (click)="openModule(module)">
                <mat-icon matListItemIcon>{{ getModuleIcon(module.name) }}</mat-icon>
                <span matListItemTitle>{{ module.displayName }}</span>
                <mat-icon matListItemMeta>chevron_right</mat-icon>
              </mat-list-item>
            }
            @if (activeModules().length === 0) {
              <mat-list-item>
                <mat-icon matListItemIcon>info</mat-icon>
                <span matListItemTitle>No active modules</span>
                <span matListItemLine>Activate modules from the Modules page</span>
              </mat-list-item>
            }
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
  `]
})
export class MoreComponent {
  private router = inject(Router);
  private modulesService = inject(ModulesService);
  activeModules = signal<AppModuleInfo[]>([]);

  ngOnInit() {
    this.loadActiveModules();
  }

  loadActiveModules() {
    this.modulesService.getActive().subscribe({
      next: (modules) => {
        this.activeModules.set(modules);
      },
      error: (error) => {
        console.error('Failed to load active modules:', error);
      }
    });
  }

  openModule(module: AppModuleInfo) {
    this.router.navigate(['/modules', module.name]);
  }

  getModuleIcon(moduleName: string): string {
    const iconMap: { [key: string]: string } = {
      'user-management': 'people',
      'crm': 'business_center',
      'hr-management': 'people',
      'projects-management': 'work',
      'tasks-management': 'task',
      'inventory-management': 'inventory',
      'payroll-management': 'payments',
      'sales-management': 'trending_up',
      'reports-management': 'assessment',
      'messages-module': 'message'
    };
    return iconMap[moduleName] || 'extension';
  }
}