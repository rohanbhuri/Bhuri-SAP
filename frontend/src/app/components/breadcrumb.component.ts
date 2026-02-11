import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbService } from '../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      @for (segment of breadcrumbs(); track $index; let isLast = $last) {
        @if (!isLast && segment.route) {
          <a [routerLink]="segment.route" class="breadcrumb-link">
            {{ segment.label }}
          </a>
        } @else {
          <span [class.current]="isLast">{{ segment.label }}</span>
        }
        @if (!isLast) {
          <mat-icon aria-hidden="true">chevron_right</mat-icon>
        }
      }
    </nav>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .breadcrumb-link {
      color: #666;
      text-decoration: none;
      transition: color 0.2s;
    }

    .breadcrumb-link:hover {
      color: #333;
      text-decoration: underline;
    }

    .breadcrumb .current {
      color: #333;
      font-weight: 500;
    }

    .breadcrumb mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: #999;
    }
  `]
})
export class BreadcrumbComponent {
  private breadcrumbService = inject(BreadcrumbService);
  breadcrumbs = this.breadcrumbService.breadcrumbs$;
}
