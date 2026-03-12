import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
}

export interface LoginPayload {
email: string;
password: string;
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
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/auth/register/`,
      payload,
    );
  }

  login(payload: LoginPayload) {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login/`,
      payload,
    );
  }
}