import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(), 
      withInterceptors([authInterceptor]),
      withXsrfConfiguration({
        cookieName: 'csrftoken',
        headerName: 'X-CSRFToken',
      })
    ),
  ],
};
