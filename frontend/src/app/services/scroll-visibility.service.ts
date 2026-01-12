import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollVisibilityService {
  private lastScrollTop = 0;
  private scrollThreshold = 5;
  isBottomNavHidden = signal(false);

  constructor() {
    this.initScrollListener();
  }

  private initScrollListener() {
    // Listen to window scroll
    window.addEventListener('scroll', () => this.handleWindowScroll(), { passive: true });
  }

  private handleWindowScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (Math.abs(currentScrollTop - this.lastScrollTop) < this.scrollThreshold) {
      return;
    }
    
    if (currentScrollTop > this.lastScrollTop && currentScrollTop > 50) {
      // Scrolling down
      this.isBottomNavHidden.set(true);
    } else {
      // Scrolling up
      this.isBottomNavHidden.set(false);
    }
    
    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }

  attachScrollListener(element: HTMLElement) {
    element.addEventListener('scroll', () => this.handleElementScroll(element), { passive: true });
  }

  private handleElementScroll(element: HTMLElement) {
    const currentScrollTop = element.scrollTop;
    
    if (Math.abs(currentScrollTop - this.lastScrollTop) < this.scrollThreshold) {
      return;
    }
    
    if (currentScrollTop > this.lastScrollTop && currentScrollTop > 50) {
      this.isBottomNavHidden.set(true);
    } else {
      this.isBottomNavHidden.set(false);
    }
    
    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }
}
