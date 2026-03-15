import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService, RegisterPayload } from '../../core/services/auth.service';
import { CryptoService } from '../../core/services/crypto.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('password')?.value;
  const cpw = control.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { passwordsMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cryptoService = inject(CryptoService);
  private readonly router = inject(Router);

  readonly loadingMessage = signal('Creando cuenta…');
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  get username() {
    return this.form.get('username')!;
  }
  get email() {
    return this.form.get('email')!;
  }
  get password() {
    return this.form.get('password')!;
  }
  get confirmPassword() {
    return this.form.get('confirmPassword')!;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, email, password } = this.form.getRawValue();

    try {
      this.loadingMessage.set('Protegiendo tu contraseña…');
      const { saltBase64, authHash } = await this.cryptoService.deriveKeysForRegistration(password!);

      this.loadingMessage.set('Creando cuenta…');
      const payload: RegisterPayload = {
        username: username!,
        email: email!,
        auth_hash: authHash,
        salt_base64: saltBase64,
      };
      await firstValueFrom(
        this.authService.register(payload)
      );

      await this.router.navigate(['/login']);

    } catch (error) {
      this.errorMessage.set(this._parseError(error));
      console.error('Error during registration:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
  
  private _parseError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 409) return 'Este correo ya está registrado.';
      return 'Ocurrió un error al crear la cuenta. Inténtalo de nuevo.';
    }
    // Error del crypto (muy raro, pero posible si el navegador no soporta WebCrypto)
    if (err instanceof Error) return `Error de seguridad: ${err.message}`;
    return 'Ocurrió un error inesperado.';
  }
}
