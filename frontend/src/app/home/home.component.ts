import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="flex flex-1 flex-col items-center justify-center px-6 py-16 min-h-[calc(100dvh-7.5rem)]">

      <!-- Badge -->
      <span class="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500 tracking-wide dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        <span class="size-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
        Proyecto personal · Experimental
      </span>

      <!-- Lock icon -->
      <div
        class="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gray-100 ring-1 ring-gray-200 dark:bg-slate-800 dark:ring-slate-700"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-8 text-emerald-500 dark:text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </div>

      <!-- Heading -->
      <h1 class="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        SecureVault
      </h1>

      <!-- Description -->
      <p class="mt-4 max-w-sm text-center text-base leading-relaxed text-gray-500 dark:text-slate-400">
        Experimenta con cifrado y codificación de contraseñas y notas bajo una política de
        <span class="font-medium text-gray-800 dark:text-slate-200">zero knowledge</span>.
      </p>

      <!-- CTA Buttons -->
      <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          routerLink="/register"
          class="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          Crear cuenta
        </a>
        <a
          routerLink="/login"
          class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-600"
        >
          Iniciar sesión
        </a>
      </div>

    </div>
  `,
})
export class HomeComponent {}
