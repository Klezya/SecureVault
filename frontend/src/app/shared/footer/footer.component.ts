import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-gray-100 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-center px-6">
        <p class="text-xs text-gray-400 dark:text-slate-600">
          SecureVault &mdash; Proyecto personal &middot; No apto para producción
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
