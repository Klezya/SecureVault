import { HttpInterceptorFn } from '@angular/common/http';

// URLs públicas que NO necesitan autenticación
const PUBLIC_URLS = [
  '/auth/register/',
  '/auth/login/',
  '/auth/salt/',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Verificar si es una URL pública
  const isPublicUrl = PUBLIC_URLS.some(url => req.url.includes(url));

  if (isPublicUrl) {
    return next(req);
  }

  // Para URLs protegidas, agregar el token
  const token = localStorage.getItem('access_token');
  const tokenType = localStorage.getItem('token_type') || 'Bearer';

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `${tokenType} ${token}`,
      },
    });
  }

  return next(req);
};
