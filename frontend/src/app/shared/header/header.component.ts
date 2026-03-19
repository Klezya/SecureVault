import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <header class="sticky top-0 z-50 border-b backdrop-blur-md" style="border-color: var(--sv-border); background: color-mix(in oklab, var(--sv-surface) 80%, transparent);">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a
          routerLink="/"
          class="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          style="color: var(--sv-text);"
          aria-label="SecureVault — ir al inicio"
        >
          <div
            class="flex size-9 items-center justify-center rounded-xl"
            style="background: color-mix(in oklab, var(--sv-primary) 15%, transparent); border: 1px solid color-mix(in oklab, var(--sv-primary) 40%, var(--sv-border));"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              style="color: var(--sv-primary);"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <span class="text-base font-bold tracking-tight">SecureVault</span>
        </a>

        <div class="flex flex-wrap items-center justify-end gap-2">
          @if (auth.isAuthenticated()) {
            <a
              routerLink="/vault"
              class="sv-btn sv-btn-secondary"
              aria-label="Ir a Vault — mis contraseñas"
            >
              Vault
            </a>
            <button
              type="button"
              (click)="logout()"
              class="sv-btn sv-btn-danger"
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          }

          <button
            type="button"
            (click)="theme.toggle()"
            [attr.aria-label]="theme.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            [attr.aria-pressed]="theme.isDark()"
            class="sv-btn sv-btn-secondary px-3"
          >
            @if (theme.isDark()) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.75"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.75"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            }
            <span class="sr-only">Cambiar tema</span>
          </button>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly auth = inject(AuthService);

  logout(): void {
    this.auth.logout().subscribe();
  }
}
