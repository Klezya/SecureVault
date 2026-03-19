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
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      @if (itemType === 'password') {
        <div>
          <label for="username" class="block text-sm font-semibold" style="color: var(--sv-text);">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            formControlName="username"
            placeholder="ej: john_doe"
            class="sv-input"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-semibold" style="color: var(--sv-text);">
            Correo
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            placeholder="ej: john@example.com"
            class="sv-input"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-semibold" style="color: var(--sv-text);">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="Contraseña"
            class="sv-input"
          />
        </div>

        <div>
          <label for="notes" class="block text-sm font-semibold" style="color: var(--sv-text);">
            Notas
          </label>
          <textarea
            id="notes"
            formControlName="notes"
            placeholder="Notas adicionales (opcional)"
            class="sv-input"
            rows="3"
          ></textarea>
        </div>
      }

      @if (itemType === 'note') {
        <div>
          <label for="title" class="block text-sm font-semibold" style="color: var(--sv-text);">
            Título
          </label>
          <input
            id="title"
            type="text"
            formControlName="title"
            placeholder="ej: Notas de trabajo"
            class="sv-input"
          />
        </div>

        <div>
          <label for="content" class="block text-sm font-semibold" style="color: var(--sv-text);">
            Contenido
          </label>
          <textarea
            id="content"
            formControlName="content"
            placeholder="Escribe tu nota aquí..."
            class="sv-input"
            rows="6"
          ></textarea>
        </div>
      }

      @if (error()) {
        <div class="rounded-xl border px-4 py-3 text-sm" style="border-color: color-mix(in oklab, var(--sv-danger) 40%, var(--sv-border)); color: var(--sv-danger); background: color-mix(in oklab, var(--sv-danger) 10%, transparent);">
          {{ error() }}
        </div>
      }

      <div class="flex flex-col gap-2 pt-4 sm:flex-row sm:gap-3">
        <button
          type="button"
          (click)="onCancel()"
          class="sv-btn sv-btn-secondary flex-1"
        >
          Cancelar
        </button>

        <button
          type="submit"
          [disabled]="isLoading() || !form.valid"
          class="sv-btn sv-btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
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
