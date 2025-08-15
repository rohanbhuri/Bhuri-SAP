import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

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
            <mat-list-item>
              <mat-icon matListItemIcon>inventory</mat-icon>
              <span matListItemTitle>Inventory</span>
              <mat-slide-toggle matListItemMeta></mat-slide-toggle>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>analytics</mat-icon>
              <span matListItemTitle>Analytics</span>
              <mat-slide-toggle matListItemMeta></mat-slide-toggle>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>report</mat-icon>
              <span matListItemTitle>Reports</span>
              <mat-slide-toggle matListItemMeta></mat-slide-toggle>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>calendar_today</mat-icon>
              <span matListItemTitle>Calendar</span>
              <mat-slide-toggle matListItemMeta></mat-slide-toggle>
            </mat-list-item>
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
export class MoreComponent {}