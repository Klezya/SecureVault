import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  host: {
    'class': 'flex min-h-dvh flex-col transition-colors duration-200',
  },
  template: `
    <app-header />
    <main class="relative flex flex-1 flex-col">
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class App {
  constructor() {
    // Eagerly initialize the theme service so the effect runs on bootstrap
    inject(ThemeService);
  }
}
