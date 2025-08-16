import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private platformId = inject(PLATFORM_ID);
  private deferredPrompt: any;
  private swRegistration: ServiceWorkerRegistration | null = null;
  
  private installableSubject = new BehaviorSubject<boolean>(false);
  private updateAvailableSubject = new BehaviorSubject<boolean>(false);
  
  public installable$ = this.installableSubject.asObservable();
  public updateAvailable$ = this.updateAvailableSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initPWA();
    }
  }

  private initPWA() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.installableSubject.next(true);
    });

    // Register service worker and check for updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          this.swRegistration = registration;
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  this.updateAvailableSubject.next(true);
                }
              });
            }
          });
        })
        .catch((error) => console.log('SW registration failed:', error));
    }
  }

  async installPWA(): Promise<boolean> {
    if (!this.deferredPrompt) return false;
    
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      this.deferredPrompt = null;
      this.installableSubject.next(false);
      return true;
    }
    return false;
  }

  updatePWA() {
    if (this.swRegistration?.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  isInstallable(): boolean {
    return this.installableSubject.value;
  }

  isUpdateAvailable(): boolean {
    return this.updateAvailableSubject.value;
  }
}