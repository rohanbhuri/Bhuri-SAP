import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="bottom-nav">
      <button mat-icon-button (click)="goToDashboard()" [color]="activeRoute === '/dashboard' ? 'primary' : ''">
        <mat-icon>dashboard</mat-icon>
      </button>
      <button mat-icon-button (click)="goToMessages()" [color]="activeRoute === '/messages' ? 'primary' : ''">
        <mat-icon>message</mat-icon>
      </button>
      <button mat-icon-button (click)="goToSearch()" [color]="activeRoute === '/search' ? 'primary' : ''">
        <mat-icon>search</mat-icon>
      </button>
      <button mat-icon-button (click)="goToNotifications()" [color]="activeRoute === '/notifications' ? 'primary' : ''">
        <mat-icon>notifications</mat-icon>
      </button>
      <button mat-icon-button (click)="goToModules()" [color]="activeRoute === '/modules' ? 'primary' : ''">
        <mat-icon>apps</mat-icon>
      </button>
      <button mat-icon-button (click)="goToMore()" [color]="activeRoute === '/more' ? 'primary' : ''">
        <mat-icon>more_horiz</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--mat-sys-surface-container);
      backdrop-filter: blur(10px);
      border-radius: 25px;
      padding: 8px 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 8px;
      z-index: 1000;
    }
    
    button {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
  `]
})
export class BottomNavbarComponent {
  activeRoute: string = '';
  
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRoute = event.url;
    });
  }
  
  ngOnInit() {
    this.activeRoute = this.router.url;
  }
  
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  goToMessages() {
    this.router.navigate(['/messages']);
  }
  
  goToSearch() {
    this.router.navigate(['/search']);
  }
  
  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
  
  goToModules() {
    this.router.navigate(['/modules']);
  }
  
  goToMore() {
    this.router.navigate(['/more']);
  }
}