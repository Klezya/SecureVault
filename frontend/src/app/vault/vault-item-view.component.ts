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
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <!-- Password View -->
      @if (itemType === 'password' && passwordData) {
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white">
              Usuario
            </label>
            <p class="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-700 dark:text-white">
              {{ passwordData.username || '—' }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white">
              Correo
            </label>
            <p class="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-700 dark:text-white">
              {{ passwordData.email || '—' }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white">
              Contraseña
            </label>
            <div class="mt-2 flex items-center gap-2">
              <div class="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-gray-900 dark:border-slate-700 dark:bg-slate-700 dark:text-white break-all">
                {{ showPassword() ? passwordData.password : '••••••••' }}
              </div>
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                [attr.aria-label]="'Mostrar/ocultar contraseña'"
              >
                {{ showPassword() ? '👁️' : '👁️‍🗨️' }}
              </button>
              <button
                type="button"
                (click)="copyToClipboard(passwordData.password)"
                class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                [attr.aria-label]="'Copiar contraseña'"
              >
                📋
              </button>
            </div>
          </div>

          @if (passwordData.notes) {
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white">
                Notas
              </label>
              <p class="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 whitespace-pre-wrap text-gray-900 dark:border-slate-700 dark:bg-slate-700 dark:text-white">
                {{ passwordData.notes }}
              </p>
            </div>
          }
        </div>
      }

      <!-- Note View -->
      @if (itemType === 'note' && noteData) {
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white">
              Título
            </label>
            <p class="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-700 dark:text-white">
              {{ noteData.title || '—' }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white">
              Contenido
            </label>
            <p class="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 whitespace-pre-wrap text-gray-900 dark:border-slate-700 dark:bg-slate-700 dark:text-white">
              {{ noteData.content || '—' }}
            </p>
          </div>
        </div>
      }

      <!-- Actions -->
      <div class="flex gap-3 border-t border-gray-100 pt-4 dark:border-slate-800">
        <button
          type="button"
          (click)="onClose()"
          class="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Cerrar
        </button>
        <button
          type="button"
          (click)="onEdit()"
          class="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
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
