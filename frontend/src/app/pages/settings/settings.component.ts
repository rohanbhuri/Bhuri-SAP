import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatIconModule, NavbarComponent, BottomNavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="settings-container">
      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>Settings</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <mat-list>
            <mat-list-item (click)="openPreferences()" class="settings-item">
              <mat-icon matListItemIcon>palette</mat-icon>
              <span matListItemTitle>User Preferences</span>
              <span matListItemLine>Customize theme and colors</span>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .settings-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .settings-card {
      width: 100%;
    }
    
    .settings-item {
      cursor: pointer;
      border-radius: var(--border-radius, 8px);
      margin-bottom: 8px;
      transition: var(--transition, all 0.2s ease-in-out);
    }
    
    .settings-item:hover {
      background-color: color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
    }
    
    :host-context(.dark-theme) .settings-item:hover {
      background-color: color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
    }
  `]
})
export class SettingsComponent {
  private router = inject(Router);
  
  openPreferences() {
    this.router.navigate(['/settings/preferences']);
  }
}