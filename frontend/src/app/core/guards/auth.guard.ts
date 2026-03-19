import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verificar si existe el access_token en localStorage
  // Nota: Las cookies httpOnly NO son accesibles desde JavaScript (es seguridad)
  // El navegador las envía automáticamente en cada request con withCredentials: true
  const accessToken = localStorage.getItem('access_token');
  
  console.log('AuthGuard check:', { accessTokenExists: !!accessToken });
  
  if (accessToken) {
    // Token presente, permitir acceso
    // Si la cookie refresh_token es inválida, lo sabremos cuando hagas requests protegidas
    // (el interceptor manejará 401 y re-intentará con refresh)
    return true;
  }
  
  // No hay sesión válida, redirigir a login
  router.navigate(['/login'], { 
    queryParams: { 
      returnUrl: state.url,
      reason: 'not_authenticated'
    } 
  });
  return false;
};
