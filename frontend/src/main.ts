import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => {
    console.error('Bootstrap failed:', err);
    // If hydration fails, try to bootstrap without hydration
    if (err.message?.includes('hydration') || err.message?.includes('SSR')) {
      console.warn('Retrying without hydration...');
      const fallbackConfig = {
        ...appConfig,
        providers: appConfig.providers.filter(p => 
          !p.toString().includes('provideClientHydration')
        )
      };
      bootstrapApplication(App, fallbackConfig)
        .catch(fallbackErr => console.error('Fallback bootstrap failed:', fallbackErr));
    }
  });
