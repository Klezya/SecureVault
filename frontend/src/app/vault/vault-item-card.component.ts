import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from '../core/services/crypto.service';
import { VaultItemPublic } from '../core/services/vault.service';

@Component({
  selector: 'app-vault-item-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <!-- Password Card -->
          @if (item.item_type === 'password') {
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white truncate">
                {{ decryptedTitle() || 'Sin título' }}
              </h3>
              <div class="mt-2 space-y-1 text-sm text-gray-600 dark:text-slate-400">
                @if (decryptedUsername()) {
                  <p>
                    <span class="font-medium">Usuario:</span>
                    <span class="ml-1">{{ decryptedUsername() }}</span>
                  </p>
                }
                @if (decryptedEmail()) {
                  <p>
                    <span class="font-medium">Correo:</span>
                    <span class="ml-1">{{ decryptedEmail() }}</span>
                  </p>
                }
              </div>
            </div>
          }

          <!-- Note Card -->
          @if (item.item_type === 'note') {
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white truncate">
                {{ decryptedTitle() || 'Sin título' }}
              </h3>
            </div>
          }

          <!-- Metadata -->
          <p class="mt-3 text-xs text-gray-500 dark:text-slate-500">
            {{ formatDate(item.created_at) }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-2">
          <button
            type="button"
            (click)="onView()"
            class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            [attr.aria-label]="'Ver ' + (item.item_type === 'password' ? 'contraseña' : 'nota')"
          >
            <span class="text-lg">👁️</span>
          </button>
          <button
            type="button"
            (click)="onEdit()"
            class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            [attr.aria-label]="'Editar ' + (item.item_type === 'password' ? 'contraseña' : 'nota')"
          >
            <span class="text-lg">✏️</span>
          </button>
          <button
            type="button"
            (click)="onDelete()"
            class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-slate-700 dark:bg-slate-700 dark:text-red-400 dark:hover:bg-slate-600"
            [attr.aria-label]="'Eliminar ' + (item.item_type === 'password' ? 'contraseña' : 'nota')"
          >
            <span class="text-lg">🗑️</span>
          </button>
        </div>
      </div>

      <!-- Loading/Error state -->
      @if (decryptError()) {
        <div class="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          No se pudo desencriptar el contenido
        </div>
      }
    </div>
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
