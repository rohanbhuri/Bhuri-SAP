import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { authInterceptor } from './interceptors/auth.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(
      withEventReplay(),
      withNoHttpTransferCache()
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideNativeDateAdapter()
  ]
};
