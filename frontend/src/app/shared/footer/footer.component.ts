import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t" style="border-color: var(--sv-border); background-color: color-mix(in oklab, var(--sv-surface) 78%, transparent);">
      <div class="mx-auto flex min-h-14 max-w-6xl items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <p class="text-center text-xs font-medium" style="color: var(--sv-text-muted);">
          SecureVault &mdash; Proyecto personal &middot; No apto para producción
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
