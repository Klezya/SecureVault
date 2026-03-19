import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaultItemPublic } from '../core/services/vault.service';

interface DecryptedPasswordData {
  username: string;
  email: string;
  password: string;
  notes?: string;
}

interface DecryptedNoteData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-vault-item-view',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      @if (itemType === 'password' && passwordData) {
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold" style="color: var(--sv-text);">
              Usuario
            </label>
            <p class="mt-2 rounded-xl border px-3 py-2" style="border-color: var(--sv-border); background-color: color-mix(in oklab, var(--sv-surface) 70%, transparent); color: var(--sv-text);">
              {{ passwordData.username || '—' }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold" style="color: var(--sv-text);">
              Correo
            </label>
            <p class="mt-2 rounded-xl border px-3 py-2" style="border-color: var(--sv-border); background-color: color-mix(in oklab, var(--sv-surface) 70%, transparent); color: var(--sv-text);">
              {{ passwordData.email || '—' }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold" style="color: var(--sv-text);">
              Contraseña
            </label>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <div class="min-w-[12rem] flex-1 break-all rounded-xl border px-3 py-2 font-mono" style="border-color: var(--sv-border); background-color: color-mix(in oklab, var(--sv-surface) 70%, transparent); color: var(--sv-text);">
                {{ showPassword() ? passwordData.password : '••••••••' }}
              </div>
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="sv-btn sv-btn-secondary px-3"
                [attr.aria-label]="'Mostrar/ocultar contraseña'"
              >
                @if (showPassword()) {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                }
              </button>
              <button
                type="button"
                (click)="copyToClipboard(passwordData.password)"
                class="sv-btn sv-btn-secondary px-3"
                [attr.aria-label]="'Copiar contraseña'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
              </button>
            </div>
          </div>

          @if (passwordData.notes) {
            <div>
              <label class="block text-sm font-semibold" style="color: var(--sv-text);">
                Notas
              </label>
              <p class="mt-2 whitespace-pre-wrap rounded-xl border px-3 py-2" style="border-color: var(--sv-border); background-color: color-mix(in oklab, var(--sv-surface) 70%, transparent); color: var(--sv-text);">
                {{ passwordData.notes }}
              </p>
            </div>
          }
        </div>
      }

      @if (itemType === 'note' && noteData) {
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold" style="color: var(--sv-text);">
              Título
            </label>
            <p class="mt-2 rounded-xl border px-3 py-2" style="border-color: var(--sv-border); background-color: color-mix(in oklab, var(--sv-surface) 70%, transparent); color: var(--sv-text);">
              {{ noteData.title || '—' }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold" style="color: var(--sv-text);">
              Contenido
            </label>
            <p class="mt-2 whitespace-pre-wrap rounded-xl border px-3 py-2" style="border-color: var(--sv-border); background-color: color-mix(in oklab, var(--sv-surface) 70%, transparent); color: var(--sv-text);">
              {{ noteData.content || '—' }}
            </p>
          </div>
        </div>
      }

      <div class="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:gap-3" style="border-color: var(--sv-border);">
        <button
          type="button"
          (click)="onClose()"
          class="sv-btn sv-btn-secondary flex-1"
        >
          Cerrar
        </button>
        <button
          type="button"
          (click)="onEdit()"
          class="sv-btn sv-btn-primary flex-1"
        >
          Editar
        </button>
      </div>
    </div>
  `,
})
export class VaultItemViewComponent {
  @Input({ required: true }) item!: VaultItemPublic;
  @Input({ required: true }) itemType!: 'password' | 'note';
  @Input() passwordData: DecryptedPasswordData | null = null;
  @Input() noteData: DecryptedNoteData | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  showPassword = signal(false);

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard');
    });
  }

  onClose() {
    this.close.emit();
  }

  onEdit() {
    this.edit.emit();
  }
}
