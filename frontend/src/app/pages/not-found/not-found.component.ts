import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrandConfigService } from '../../services/brand-config.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="brand-logo">
          <img [src]="brandConfig?.brand?.logo" [alt]="brandConfig?.brand?.name" />
        </div>
        
        <div class="error-code">404</div>
        
        <h1 class="error-title">Page Not Found</h1>
        
        <p class="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <button mat-raised-button color="primary" routerLink="/" class="home-button">
          <mat-icon>home</mat-icon>
          Go to Home
        </button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-color, #3B82F6) 0%, var(--accent-color, #F59E0B) 100%);
      padding: 20px;
    }

    .not-found-content {
      text-align: center;
      color: white;
      max-width: 500px;
    }

    .brand-logo img {
      height: 60px;
      margin-bottom: 30px;
      filter: brightness(0) invert(1);
    }

    .error-code {
      font-size: 8rem;
      font-weight: 900;
      line-height: 1;
      margin-bottom: 20px;
      text-shadow: 4px 4px 8px rgba(0,0,0,0.3);
      opacity: 0.9;
    }

    .error-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .error-message {
      font-size: 1.2rem;
      margin-bottom: 40px;
      opacity: 0.8;
      line-height: 1.6;
    }

    .home-button {
      padding: 12px 32px;
      font-size: 1.1rem;
      font-weight: 600;
      min-width: 160px;
    }

    @media (max-width: 768px) {
      .error-code {
        font-size: 6rem;
      }
      
      .error-title {
        font-size: 2rem;
      }
      
      .error-message {
        font-size: 1rem;
      }
    }
  `]
})
export class NotFoundComponent implements OnInit {
  private brandConfigService = inject(BrandConfigService);
  brandConfig: any;

  ngOnInit() {
    this.brandConfig = this.brandConfigService.getConfig();
  }
}