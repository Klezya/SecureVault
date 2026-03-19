import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from '../core/services/crypto.service';
import { VaultItemPublic } from '../core/services/vault.service';

@Component({
  selector: 'app-vault-item-card',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="sv-card p-4 sm:p-5">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex-1 min-w-0">
          @if (item.item_type === 'password') {
            <div>
              <h3 class="truncate text-xl" style="color: var(--sv-text);">
                {{ decryptedTitle() || 'Sin título' }}
              </h3>
              <div class="sv-muted mt-2 space-y-1 text-sm">
                @if (decryptedUsername()) {
                  <p>
                    <span class="font-semibold">Usuario:</span>
                    <span class="ml-1">{{ decryptedUsername() }}</span>
                  </p>
                }
                @if (decryptedEmail()) {
                  <p>
                    <span class="font-semibold">Correo:</span>
                    <span class="ml-1">{{ decryptedEmail() }}</span>
                  </p>
                }
              </div>
            </div>
          }

          @if (item.item_type === 'note') {
            <div>
              <h3 class="truncate text-xl" style="color: var(--sv-text);">
                {{ decryptedTitle() || 'Sin título' }}
              </h3>
            </div>
          }

          <p class="sv-muted mt-3 text-xs font-medium">
            {{ formatDate(item.created_at) }}
          </p>
        </div>

        <div class="flex flex-row gap-2 sm:flex-col">
          <button
            type="button"
            (click)="onView()"
            class="sv-btn sv-btn-secondary px-3"
            [attr.aria-label]="'Ver ' + (item.item_type === 'password' ? 'contraseña' : 'nota')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
          <button
            type="button"
            (click)="onEdit()"
            class="sv-btn sv-btn-secondary px-3"
            [attr.aria-label]="'Editar ' + (item.item_type === 'password' ? 'contraseña' : 'nota')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button
            type="button"
            (click)="onDelete()"
            class="sv-btn sv-btn-danger px-3"
            [attr.aria-label]="'Eliminar ' + (item.item_type === 'password' ? 'contraseña' : 'nota')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      @if (decryptError()) {
        <div class="mt-3 rounded-xl border p-3 text-sm" style="border-color: color-mix(in oklab, var(--sv-danger) 40%, var(--sv-border)); color: var(--sv-danger); background: color-mix(in oklab, var(--sv-danger) 10%, transparent);">
          No se pudo desencriptar el contenido
        </div>
      }
    </article>
  `,
})
export class VaultItemCardComponent {
  @Input({ required: true }) item!: VaultItemPublic;
  @Output() view = new EventEmitter<VaultItemPublic>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  private cryptoService = inject(CryptoService);

  // Decrypted data signals
  decryptedData = signal<any>(null);
  decryptError = signal(false);

  decryptedTitle = computed(() => {
    const data = this.decryptedData();
    if (!data) return '';
    return data.title || data.username || '';
  });

  decryptedUsername = computed(() => {
    const data = this.decryptedData();
    return data?.username || '';
  });

  decryptedEmail = computed(() => {
    const data = this.decryptedData();
    return data?.email || '';
  });

  // Decrypt on init
  constructor() {
    effect(() => {
      this.decryptItem();
    });
  }

  private async decryptItem() {
    try {
      this.decryptError.set(false);
      const plaintext = await this.cryptoService.decrypt({
        ciphertext: this.item.ciphertext,
        iv: this.item.iv,
      });
      const data = JSON.parse(plaintext);
      this.decryptedData.set(data);
    } catch (err) {
      console.error('Decryption error:', err);
      this.decryptError.set(true);
      this.decryptedData.set(null);
    }
  }

  onView() {
    this.view.emit(this.item);
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
