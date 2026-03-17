import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verificar si existe el token JWT en localStorage
  const token = localStorage.getItem('access_token');
  
  if (token) {
    // Token existe, permitir acceso
    return true;
  }
  
  // No hay token, redirigir al login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
