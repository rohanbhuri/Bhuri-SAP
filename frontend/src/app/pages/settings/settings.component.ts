import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { ThemeService } from '../../services/theme.service';
import { SettingsService, UserSettings } from '../../services/settings.service';
import { AuthService } from '../../services/auth.service';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  badge?: string;
  color?: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,

    MatDividerModule,
    MatProgressSpinnerModule,
    NavbarComponent,
    BottomNavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>
    
    <div class="settings-container">
      <div class="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and privacy settings</p>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="settingsState().loading">
        <mat-spinner diameter="32"></mat-spinner>
        <span>Loading settings...</span>
      </div>

      <!-- Settings Sections -->
      <div class="settings-grid" *ngIf="!settingsState().loading">
        
        <!-- Account & Profile -->
        <mat-card class="settings-section">
          <mat-card-header>
            <mat-icon mat-card-avatar class="section-icon account">person</mat-icon>
            <mat-card-title>Account & Profile</mat-card-title>
            <mat-card-subtitle>Personal information and profile settings</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item 
                *ngFor="let item of accountSettings" 
                (click)="navigateTo(item.route)"
                class="settings-item"
                [class]="item.color">
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <div matListItemTitle>{{ item.title }}</div>
                <div matListItemLine>{{ item.description }}</div>
                <span matListItemMeta class="arrow-icon">›</span>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <!-- Appearance & Theme -->
        <mat-card class="settings-section">
          <mat-card-header>
            <mat-icon mat-card-avatar class="section-icon theme">palette</mat-icon>
            <mat-card-title>Appearance</mat-card-title>
            <mat-card-subtitle>Theme, colors, and visual preferences</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item 
                *ngFor="let item of appearanceSettings" 
                (click)="navigateTo(item.route)"
                class="settings-item">
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <div matListItemTitle>{{ item.title }}</div>
                <div matListItemLine>{{ item.description }}</div>
                <span matListItemMeta class="arrow-icon">›</span>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <!-- Notifications -->
        <mat-card class="settings-section">
          <mat-card-header>
            <mat-icon mat-card-avatar class="section-icon notifications">notifications</mat-icon>
            <mat-card-title>Notifications</mat-card-title>
            <mat-card-subtitle>Email, push, and in-app notification preferences</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item 
                *ngFor="let item of notificationSettings" 
                (click)="navigateTo(item.route)"
                class="settings-item">
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <div matListItemTitle>{{ item.title }}</div>
                <div matListItemLine>{{ item.description }}</div>
                <span matListItemMeta class="arrow-icon">›</span>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <!-- Privacy & Security -->
        <mat-card class="settings-section">
          <mat-card-header>
            <mat-icon mat-card-avatar class="section-icon security">security</mat-icon>
            <mat-card-title>Privacy & Security</mat-card-title>
            <mat-card-subtitle>Control your privacy and account security</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item 
                *ngFor="let item of privacySettings" 
                (click)="navigateTo(item.route)"
                class="settings-item"
                [class]="item.color">
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <div matListItemTitle>{{ item.title }}</div>
                <div matListItemLine>{{ item.description }}</div>
                <mat-icon matListItemMeta>arrow_forward_ios</mat-icon>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <!-- Organizations -->
        <mat-card class="settings-section">
          <mat-card-header>
            <mat-icon mat-card-avatar class="section-icon organizations">business</mat-icon>
            <mat-card-title>Organizations</mat-card-title>
            <mat-card-subtitle>Manage your organization memberships and visibility</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item 
                *ngFor="let item of organizationSettings" 
                (click)="navigateTo(item.route)"
                class="settings-item">
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <div matListItemTitle>{{ item.title }}</div>
                <div matListItemLine>{{ item.description }}</div>
                <span matListItemMeta class="arrow-icon">›</span>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <!-- Accessibility -->
        <mat-card class="settings-section">
          <mat-card-header>
            <mat-icon mat-card-avatar class="section-icon accessibility">accessibility</mat-icon>
            <mat-card-title>Accessibility</mat-card-title>
            <mat-card-subtitle>Screen reader, contrast, and navigation options</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item 
                *ngFor="let item of accessibilitySettings" 
                (click)="navigateTo(item.route)"
                class="settings-item">
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <div matListItemTitle>{{ item.title }}</div>
                <div matListItemLine>{{ item.description }}</div>
                <span matListItemMeta class="arrow-icon">›</span>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <!-- Data & Storage -->
        <mat-card class="settings-section">
          <mat-card-header>
            <mat-icon mat-card-avatar class="section-icon data">storage</mat-icon>
            <mat-card-title>Data & Storage</mat-card-title>
            <mat-card-subtitle>Export data, manage storage, and account deletion</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item 
                *ngFor="let item of dataSettings" 
                (click)="navigateTo(item.route)"
                class="settings-item"
                [class]="item.color">
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <div matListItemTitle>{{ item.title }}</div>
                <div matListItemLine>{{ item.description }}</div>
                <span matListItemMeta class="arrow-icon">›</span>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <mat-card class="quick-actions" *ngIf="!settingsState().loading">
        <mat-card-header>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="action-buttons">
            <button mat-raised-button color="primary" (click)="navigateTo('/settings/preferences')">
              <mat-icon>palette</mat-icon>
              Theme Settings
            </button>
            <button mat-raised-button (click)="navigateTo('/settings/notifications')">
              <mat-icon>notifications</mat-icon>
              Notifications
            </button>
            <button mat-raised-button (click)="navigateTo('/settings/privacy')">
              <mat-icon>lock</mat-icon>
              Privacy
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private settingsService = inject(SettingsService);
  private authService = inject(AuthService);

  settingsState = this.settingsService.getSettingsState;
  userSettings = signal<UserSettings | null>(null);

  accountSettings: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile Information',
      description: 'Update your personal details and contact information',
      icon: 'person',
      route: '/profile/edit'
    },
    {
      id: 'account',
      title: 'Account Settings',
      description: 'Email, password, and basic account preferences',
      icon: 'manage_accounts',
      route: '/settings/account'
    }
  ];

  appearanceSettings: SettingsSection[] = [
    {
      id: 'theme',
      title: 'Theme & Colors',
      description: 'Customize appearance with themes and colors',
      icon: 'palette',
      route: '/settings/preferences'
    },
    {
      id: 'display',
      title: 'Display Settings',
      description: 'Font size, layout, and visual preferences',
      icon: 'display_settings',
      route: '/settings/display'
    }
  ];

  notificationSettings: SettingsSection[] = [
    {
      id: 'notifications',
      title: 'Notification Preferences',
      description: 'Email, push, and in-app notification settings',
      icon: 'notifications',
      route: '/settings/notifications'
    },
    {
      id: 'quiet-hours',
      title: 'Quiet Hours',
      description: 'Set times when you don\'t want to receive notifications',
      icon: 'do_not_disturb',
      route: '/settings/quiet-hours'
    }
  ];

  privacySettings: SettingsSection[] = [
    {
      id: 'privacy',
      title: 'Privacy Settings',
      description: 'Control who can see your profile and information',
      icon: 'lock',
      route: '/settings/privacy'
    },
    {
      id: 'security',
      title: 'Security & Authentication',
      description: 'Two-factor auth, password, and login security',
      icon: 'security',
      route: '/settings/security',
      badge: this.userSettings()?.security.twoFactorEnabled ? '' : '!',
      color: 'warn'
    }
  ];

  organizationSettings: SettingsSection[] = [
    {
      id: 'org-privacy',
      title: 'Organization Privacy',
      description: 'Control visibility in each organization you\'ve joined',
      icon: 'business',
      route: '/settings/organization-privacy'
    },
    {
      id: 'org-notifications',
      title: 'Organization Notifications',
      description: 'Notification preferences for each organization',
      icon: 'notifications_active',
      route: '/settings/organization-notifications'
    }
  ];

  accessibilitySettings: SettingsSection[] = [
    {
      id: 'accessibility',
      title: 'Accessibility Options',
      description: 'Screen reader, high contrast, and navigation settings',
      icon: 'accessibility',
      route: '/settings/accessibility'
    },
    {
      id: 'keyboard',
      title: 'Keyboard Navigation',
      description: 'Keyboard shortcuts and navigation preferences',
      icon: 'keyboard',
      route: '/settings/keyboard'
    }
  ];

  dataSettings: SettingsSection[] = [
    {
      id: 'export',
      title: 'Export Data',
      description: 'Download a copy of your data and settings',
      icon: 'download',
      route: '/settings/export-data'
    },
    {
      id: 'storage',
      title: 'Storage Management',
      description: 'Manage files, attachments, and storage usage',
      icon: 'storage',
      route: '/settings/storage'
    },
    {
      id: 'delete',
      title: 'Delete Account',
      description: 'Permanently delete your account and all data',
      icon: 'delete_forever',
      route: '/settings/delete-account',
      color: 'warn'
    }
  ];

  ngOnInit() {
    this.themeService.applyModuleTheme('settings');
    this.loadUserSettings();
  }

  loadUserSettings() {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    // Use default settings for now since backend endpoints don't exist yet
    this.userSettings.set(this.settingsService.getDefaultSettings());
    
    // TODO: Uncomment when backend is implemented
    // this.settingsService.loadUserSettings().subscribe({
    //   next: (settings) => {
    //     this.userSettings.set(settings);
    //   },
    //   error: (error) => {
    //     console.error('Failed to load settings:', error);
    //     this.userSettings.set(this.settingsService.getDefaultSettings());
    //   }
    // });
  }

  navigateTo(route: string) {
    console.log('Navigating to:', route);
    this.router.navigate([route]).catch(error => {
      console.error('Navigation error:', error);
      // Show user-friendly message for unimplemented features
      if (route.includes('privacy') || route.includes('security') || route.includes('accessibility')) {
        alert('This feature is coming soon!');
      }
    });
  }
}