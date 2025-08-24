import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { SettingsService, NotificationSettings } from '../../services/settings.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-notifications-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    NavbarComponent,
    BottomNavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>
    
    <div class="notifications-container">
      <div class="page-header">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <h1>Notification Settings</h1>
          <p>Control how and when you receive notifications</p>
        </div>
      </div>

      <form [formGroup]="notificationForm" (ngSubmit)="saveSettings()">
        
        <!-- General Notifications -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="section-icon">notifications</mat-icon>
            <mat-card-title>General Notifications</mat-card-title>
            <mat-card-subtitle>Choose your preferred notification methods</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="toggle-group">
              <div class="toggle-item">
                <div class="toggle-info">
                  <div class="toggle-title">Email Notifications</div>
                  <div class="toggle-description">Receive notifications via email</div>
                </div>
                <mat-slide-toggle formControlName="email" color="primary"></mat-slide-toggle>
              </div>

              <div class="toggle-item">
                <div class="toggle-info">
                  <div class="toggle-title">Push Notifications</div>
                  <div class="toggle-description">Browser push notifications</div>
                </div>
                <mat-slide-toggle formControlName="push" color="primary"></mat-slide-toggle>
              </div>

              <div class="toggle-item">
                <div class="toggle-info">
                  <div class="toggle-title">SMS Notifications</div>
                  <div class="toggle-description">Text message notifications for urgent items</div>
                </div>
                <mat-slide-toggle formControlName="sms" color="primary"></mat-slide-toggle>
              </div>

              <div class="toggle-item">
                <div class="toggle-info">
                  <div class="toggle-title">In-App Notifications</div>
                  <div class="toggle-description">Show notifications within the application</div>
                </div>
                <mat-slide-toggle formControlName="inApp" color="primary"></mat-slide-toggle>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Content Notifications -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="section-icon">category</mat-icon>
            <mat-card-title>Content Notifications</mat-card-title>
            <mat-card-subtitle>Choose what types of activities to be notified about</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="toggle-group">
              <div class="toggle-item">
                <div class="toggle-info">
                  <div class="toggle-title">Messages</div>
                  <div class="toggle-description">New direct messages and mentions</div>
                </div>
                <mat-slide-toggle formControlName="messageNotifications" color="primary"></mat-slide-toggle>
              </div>

              <div class="toggle-item">
                <div class="toggle-info">
                  <div class="toggle-title">Tasks & Projects</div>
                  <div class="toggle-description">Task assignments and project updates</div>
                </div>
                <mat-slide-toggle formControlName="taskNotifications" color="primary"></mat-slide-toggle>
              </div>

              <div class="toggle-item">
                <div class="toggle-info">
                  <div class="toggle-title">Project Updates</div>
                  <div class="toggle-description">Status changes and milestone completions</div>
                </div>
                <mat-slide-toggle formControlName="projectUpdates" color="primary"></mat-slide-toggle>
              </div>

              <div class="toggle-item">
                <div class="toggle-info">
                  <div class="toggle-title">Organization Announcements</div>
                  <div class="toggle-description">Important announcements from your organizations</div>
                </div>
                <mat-slide-toggle formControlName="organizationAnnouncements" color="primary"></mat-slide-toggle>
              </div>

              <div class="toggle-item">
                <div class="toggle-info">
                  <div class="toggle-title">Weekly Digest</div>
                  <div class="toggle-description">Weekly summary of your activity and updates</div>
                </div>
                <mat-slide-toggle formControlName="weeklyDigest" color="primary"></mat-slide-toggle>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Quiet Hours -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="section-icon">do_not_disturb</mat-icon>
            <mat-card-title>Quiet Hours</mat-card-title>
            <mat-card-subtitle>Set times when you don't want to receive notifications</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="toggle-group">
              <div class="toggle-item">
                <div class="toggle-info">
                  <div class="toggle-title">Enable Quiet Hours</div>
                  <div class="toggle-description">Pause notifications during specified hours</div>
                </div>
                <mat-slide-toggle formControlName="quietHoursEnabled" color="primary"></mat-slide-toggle>
              </div>
            </div>

            <div class="quiet-hours-config" *ngIf="notificationForm.get('quietHoursEnabled')?.value">
              <mat-divider></mat-divider>
              <div class="time-inputs">
                <mat-form-field appearance="outline">
                  <mat-label>Start Time</mat-label>
                  <input matInput type="time" formControlName="quietHoursStart">
                  <mat-icon matSuffix>schedule</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>End Time</mat-label>
                  <input matInput type="time" formControlName="quietHoursEnd">
                  <mat-icon matSuffix>schedule</mat-icon>
                </mat-form-field>
              </div>
              <p class="quiet-hours-note">
                <mat-icon>info</mat-icon>
                During quiet hours, only urgent notifications will be delivered
              </p>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Save Actions -->
        <div class="save-actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="saving() || notificationForm.invalid">
            <mat-icon *ngIf="!saving()">save</mat-icon>
            <mat-icon *ngIf="saving()" class="spinning">sync</mat-icon>
            {{ saving() ? 'Saving...' : 'Save Settings' }}
          </button>
          <button mat-button type="button" (click)="resetForm()">
            <mat-icon>refresh</mat-icon>
            Reset to Default
          </button>
        </div>
      </form>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./settings-pages.component.scss']
})
export class NotificationsSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);
  private themeService = inject(ThemeService);
  private snackBar = inject(MatSnackBar);

  saving = signal(false);

  notificationForm = this.fb.group({
    email: [true],
    push: [true],
    sms: [false],
    inApp: [true],
    messageNotifications: [true],
    taskNotifications: [true],
    projectUpdates: [true],
    organizationAnnouncements: [true],
    weeklyDigest: [false],
    quietHoursEnabled: [false],
    quietHoursStart: ['22:00', Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)],
    quietHoursEnd: ['08:00', Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]
  });

  ngOnInit() {
    this.themeService.applyModuleTheme('settings');
    this.loadNotificationSettings();
  }

  loadNotificationSettings() {
    // Use default settings for now since backend endpoints don't exist yet
    const defaultSettings = this.settingsService.getDefaultSettings().notifications;
    this.notificationForm.patchValue({
      email: defaultSettings.email,
      push: defaultSettings.push,
      sms: defaultSettings.sms,
      inApp: defaultSettings.inApp,
      messageNotifications: defaultSettings.messageNotifications,
      taskNotifications: defaultSettings.taskNotifications,
      projectUpdates: defaultSettings.projectUpdates,
      organizationAnnouncements: defaultSettings.organizationAnnouncements,
      weeklyDigest: defaultSettings.weeklyDigest,
      quietHoursEnabled: defaultSettings.quietHours.enabled,
      quietHoursStart: defaultSettings.quietHours.start,
      quietHoursEnd: defaultSettings.quietHours.end
    });
    
    // TODO: Uncomment when backend is implemented
    // this.settingsService.loadUserSettings().subscribe({
    //   next: (settings) => {
    //     if (settings?.notifications) {
    //       const notifications = settings.notifications;
    //       this.notificationForm.patchValue({ ... });
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Failed to load notification settings:', error);
    //     this.snackBar.open('Failed to load settings', 'Close', { duration: 3000 });
    //   }
    // });
  }

  saveSettings() {
    if (this.notificationForm.invalid) return;

    this.saving.set(true);
    
    // Mock save for now since backend endpoints don't exist yet
    setTimeout(() => {
      this.saving.set(false);
      this.snackBar.open('Notification settings saved successfully (mock)', 'Close', { duration: 3000 });
    }, 1000);
    
    // TODO: Uncomment when backend is implemented
    // const formValue = this.notificationForm.value;
    // const notifications: Partial<NotificationSettings> = { ... };
    // this.settingsService.updateNotificationSettings(notifications).subscribe({ ... });
  }

  resetForm() {
    const defaultSettings = this.settingsService.getDefaultSettings().notifications;
    this.notificationForm.patchValue({
      email: defaultSettings.email,
      push: defaultSettings.push,
      sms: defaultSettings.sms,
      inApp: defaultSettings.inApp,
      messageNotifications: defaultSettings.messageNotifications,
      taskNotifications: defaultSettings.taskNotifications,
      projectUpdates: defaultSettings.projectUpdates,
      organizationAnnouncements: defaultSettings.organizationAnnouncements,
      weeklyDigest: defaultSettings.weeklyDigest,
      quietHoursEnabled: defaultSettings.quietHours.enabled,
      quietHoursStart: defaultSettings.quietHours.start,
      quietHoursEnd: defaultSettings.quietHours.end
    });
  }

  goBack() {
    window.history.back();
  }
}