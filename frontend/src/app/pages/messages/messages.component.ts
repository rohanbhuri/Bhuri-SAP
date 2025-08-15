import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MatCardModule, NavbarComponent, BottomNavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Messages</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Messages functionality coming soon...</p>
        </mat-card-content>
      </mat-card>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
  `]
})
export class MessagesComponent {}