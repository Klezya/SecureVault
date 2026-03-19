import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { tap, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

  // Zero-knowledge — el servidor nunca ve la contraseña
export interface RegisterPayload {
  username: string;
  email: string;
  auth_hash: string; // el servidor recibe esto y lo re-hashea con bcrypt
  salt_base64: string; // el servidor lo guarda para devolver en el login
}

export interface RegisterResponse {
  username: string;
  email: string;
}

// ── Login paso 1: obtener salt ────────────────────────────────
export interface SaltResponse {
  salt_base64: string;
}

// ── Login paso 2: autenticarse ────────────────────────────────
export interface LoginPayload {
  email: string;
  auth_hash: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  /** Signal reactiva para estado de autenticación */
  isAuthenticated = signal<boolean>(!!localStorage.getItem('access_token'));

  /** Subject para coordinar refreshes simultáneos (evita múltiples refresh calls) */
  private _refreshSubject = new BehaviorSubject<boolean>(false);
  public isRefreshing$ = this._refreshSubject.asObservable();

  register(payload: RegisterPayload) {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register/`, payload);
  }

  // Paso 1 del login — necesitamos el salt para derivar las claves
  getSalt(email: string) {
    return this.http.get<SaltResponse>(
      `${this.apiUrl}/auth/salt/`, 
      { params: { email } }
    );
  }

  login(payload: LoginPayload) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login/`, payload).pipe(
      tap((response) => {
        // Guardar el token y tipo en localStorage
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('token_type', response.token_type);
        // Actualizar signal
        this.isAuthenticated.set(true);
      })
    );
  }

  /** Renovar el access token usando el refresh token (en la cookie) */
  refresh() {
    // Marcar que estamos refrescando
    this._refreshSubject.next(true);

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/refresh/`,
      {}
    ).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access_token);
        // El refresh_token se actualiza automáticamente en la cookie
        // Actualizar signal
        this.isAuthenticated.set(true);
      }),
      finalize(() => {
        // Marcar que terminó el refresh
        this._refreshSubject.next(false);
      })
    );
  }

  /** Obtener el token actual de la sesión */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /** Logout con notificación al servidor y limpieza local */
  logout() {
    return this.http.post(
      `${this.apiUrl}/auth/logout/`,
      {}
    ).pipe(
      finalize(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        // Actualizar signal
        this.isAuthenticated.set(false);
        this.router.navigate(['/login'], {
          queryParams: { reason: 'session_expired' }
        });
      })
    );
  }
}
