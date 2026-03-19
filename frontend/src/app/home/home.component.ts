import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="sv-page flex min-h-[calc(100dvh-8.5rem)] items-center">
      <div class="sv-surface grid w-full gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div class="flex flex-col justify-center">
          <span class="sv-pill mb-5 w-fit">
            <span class="size-2 rounded-full" style="background-color: var(--sv-primary);" aria-hidden="true"></span>
            Proyecto personal · Experimental
          </span>

          <h1 class="text-4xl leading-tight sm:text-5xl lg:text-6xl" style="color: var(--sv-text);">
            Seguridad elegante para tu información sensible
          </h1>

          <p class="sv-muted mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
            Gestiona contraseñas y notas con cifrado local bajo una política de zero knowledge, en una experiencia clara, rápida y diseñada para escritorio y móvil.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/register" class="sv-btn sv-btn-primary px-5">Crear cuenta</a>
            <a routerLink="/login" class="sv-btn sv-btn-secondary px-5">Iniciar sesión</a>
          </div>
        </div>

        <div class="sv-card flex flex-col gap-5 p-6 sm:p-7">
          <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-xl" style="background: color-mix(in oklab, var(--sv-primary) 15%, transparent); border: 1px solid color-mix(in oklab, var(--sv-primary) 30%, var(--sv-border));" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.75"
                style="color: var(--sv-primary);"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h2 class="text-2xl" style="color: var(--sv-text);">SecureVault</h2>
          </div>

          <p class="sv-muted text-sm leading-relaxed sm:text-base">
            Diseñado para separar identidad, autenticación y contenido cifrado. La bóveda solo almacena datos protegidos.
          </p>

          <ul class="space-y-3 text-sm sm:text-base" style="color: var(--sv-text);">
            <li class="flex items-start gap-2">
              <span class="mt-2 size-1.5 rounded-full" style="background-color: var(--sv-primary);" aria-hidden="true"></span>
              Cifrado del lado del cliente antes de persistir información.
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-2 size-1.5 rounded-full" style="background-color: var(--sv-primary);" aria-hidden="true"></span>
              Flujo responsive optimizado para móvil y escritorio.
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-2 size-1.5 rounded-full" style="background-color: var(--sv-primary);" aria-hidden="true"></span>
              Tema claro y oscuro con contraste WCAG AA.
            </li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {}
