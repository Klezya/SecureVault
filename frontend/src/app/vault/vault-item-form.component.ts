import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CryptoService } from '../core/services/crypto.service';

export interface VaultItemCreate {
  item_type: 'password' | 'note';
  ciphertext: string;
  iv: string;
}

interface PasswordData {
  username: string;
  email: string;
  password: string;
  notes: string;
}

interface NoteData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-vault-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <!-- Password Form -->
      @if (itemType === 'password') {
        <div>
          <label for="username" class="block text-sm font-medium text-gray-900 dark:text-white">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            formControlName="username"
            placeholder="ej: john_doe"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-900 dark:text-white">
            Correo
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            placeholder="ej: john@example.com"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-900 dark:text-white">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="Contraseña"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label for="notes" class="block text-sm font-medium text-gray-900 dark:text-white">
            Notas
          </label>
          <textarea
            id="notes"
            formControlName="notes"
            placeholder="Notas adicionales (opcional)"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            rows="3"
          ></textarea>
        </div>
      }

      <!-- Note Form -->
      @if (itemType === 'note') {
        <div>
          <label for="title" class="block text-sm font-medium text-gray-900 dark:text-white">
            Título
          </label>
          <input
            id="title"
            type="text"
            formControlName="title"
            placeholder="ej: Notas de trabajo"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-gray-900 dark:text-white">
            Contenido
          </label>
          <textarea
            id="content"
            formControlName="content"
            placeholder="Escribe tu nota aquí..."
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            rows="6"
          ></textarea>
        </div>
      }

      <!-- Error message -->
      @if (error()) {
        <div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
          {{ error() }}
        </div>
      }

      <!-- Buttons -->
      <div class="flex gap-3 pt-4">
        <button
          type="button"
          (click)="onCancel()"
          class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Cancelar
        </button>

        <button
          type="submit"
          [disabled]="isLoading() || !form.valid"
          class="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          @if (isLoading()) {
            Creando...
          } @else {
            Crear
          }
        </button>
      </div>
    </form>
  `,
})
export class VaultItemFormComponent {
  @Input() itemType: 'password' | 'note' = 'password';
  @Output() itemCreated = new EventEmitter<VaultItemCreate>();
  @Output() canceled = new EventEmitter<void>();

  form: FormGroup;
  isLoading = signal(false);
  error = signal('');

  constructor(
    private fb: FormBuilder,
    private cryptoService: CryptoService,
  ) {
    this.form = this.createForm();

    // Reconstruir formulario cuando cambie el tipo
    effect(() => {
      this.itemType; // Track the input
      this.form = this.createForm();
    });
  }

  private createForm(): FormGroup {
    if (this.itemType === 'password') {
      return this.fb.group({
        username: ['', [Validators.required, Validators.minLength(1)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(1)]],
        notes: [''],
      });
    } else {
      return this.fb.group({
        title: ['', [Validators.required, Validators.minLength(1)]],
        content: ['', [Validators.required, Validators.minLength(1)]],
      });
    }
  }

  async onSubmit() {
    if (!this.form.valid) return;

    this.isLoading.set(true);
    this.error.set('');

    try {
      // Preparar datos según tipo
      const data = this.itemType === 'password'
        ? (this.form.value as PasswordData)
        : (this.form.value as NoteData);

      // Cifrar
      const plaintext = JSON.stringify(data);
      const encrypted = await this.cryptoService.encrypt(plaintext);

      // Emitir
      this.itemCreated.emit({
        item_type: this.itemType,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
      });

      // Limpiar
      this.form.reset();
    } catch (err) {
      this.error.set('Error al cifrar. Intenta de nuevo.');
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancel() {
    this.form.reset();
    this.error.set('');
    this.canceled.emit();
  }
}
