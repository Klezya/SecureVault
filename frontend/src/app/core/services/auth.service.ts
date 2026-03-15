import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// ✅ Zero-knowledge — el servidor nunca ve la contraseña
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
  private readonly apiUrl = environment.apiUrl;

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
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login/`, payload);
  }
}
