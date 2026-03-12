import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _isDark = signal(this.getInitialTheme());

  readonly isDark = this._isDark.asReadonly();
  readonly theme = computed(() => (this._isDark() ? 'dark' : 'light'));

  constructor() {
    effect(() => {
      const dark = this._isDark();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('sv-theme', dark ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this._isDark.update((v) => !v);
  }

  private getInitialTheme(): boolean {
    const stored = localStorage.getItem('sv-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
