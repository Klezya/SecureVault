import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CryptoService } from '../../core/services/crypto.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cryptoService = inject(CryptoService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly loadingMessage = signal('Iniciando sesión…');
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    }
  );

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();

    try {
      
      this.loadingMessage.set('Verificando cuenta…');
      const { salt_base64 } = await firstValueFrom(
        this.authService.getSalt(email!)
      );

      this.loadingMessage.set('Protegiendo tu sesión…');
      const { authHash } = await this.cryptoService.deriveKeysForLogin(password!, salt_base64);

      this.loadingMessage.set('Iniciando sesión…');
      const response = await firstValueFrom(
        this.authService.login({ email: email!, auth_hash: authHash })
      );

      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('token_type', response.token_type);
      await this.router.navigate(['/vault']);

    } catch (err) {
      this.errorMessage.set(this._parseError(err));
      console.error('Error en login:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  private _parseError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) return 'Correo o contraseña incorrectos.';
      if (err.status === 403) return 'Tu cuenta está inactiva. Contacta soporte.';
      return 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.';
    }
    if (err instanceof Error) return `Error de seguridad: ${err.message}`;
    return 'Ocurrió un error inesperado.';
  }
}
