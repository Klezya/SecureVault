import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, take, filter } from 'rxjs/operators';
import { throwError as throwRxjsError } from 'rxjs';

// URLs públicas que NO necesitan autenticación
const PUBLIC_URLS = [
  '/auth/register/',
  '/auth/login/',
  '/auth/salt/',
  '/auth/logout/',
  '/auth/refresh/',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isPublicUrl = PUBLIC_URLS.some(url => req.url.includes(url));

  // ✅ Siempre enviar cookies
  req = req.clone({
    withCredentials: true,
  });

  // Para URLs protegidas, agregar el token de acceso
  if (!isPublicUrl) {
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type') || 'Bearer';

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `${tokenType} ${token}`,
        },
      });
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si es 401 y hay token → intentar refresh
      if (
        error.status === 401 &&
        !isPublicUrl &&
        localStorage.getItem('access_token')
      ) {
        return authService.isRefreshing$.pipe(
          take(1),
          switchMap((isRefreshing) => {
            if (!isRefreshing) {
              // Iniciar refresh
              return authService.refresh().pipe(
                switchMap(() => {
                  // Refresh exitoso, reintentar request con nuevo token
                  const newToken = localStorage.getItem('access_token');
                  const tokenType = localStorage.getItem('token_type') || 'Bearer';

                  const retryReq = req.clone({
                    setHeaders: {
                      Authorization: `${tokenType} ${newToken}`,
                    },
                    withCredentials: true,
                  });

                  return next(retryReq);
                }),
                catchError(() => {
                  // Refresh falló → logout
                  authService.logout().subscribe();
                  return throwRxjsError(() => error);
                }),
              );
            } else {
              // Ya está refrescando → esperar a que termine
              return authService.isRefreshing$.pipe(
                filter(isRefreshing => !isRefreshing),
                take(1),
                switchMap(() => {
                  // Refresh terminó, reintentar request con nuevo token
                  const newToken = localStorage.getItem('access_token');
                  const tokenType = localStorage.getItem('token_type') || 'Bearer';

                  const retryReq = req.clone({
                    setHeaders: {
                      Authorization: `${tokenType} ${newToken}`,
                    },
                    withCredentials: true,
                  });

                  return next(retryReq);
                }),
                catchError(() => {
                  // Si falla el reintento, logout
                  authService.logout().subscribe();
                  return throwRxjsError(() => error);
                }),
              );
            }
          }),
        );
      }

      return throwRxjsError(() => error);
    }),
  );
};
