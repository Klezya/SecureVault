import { Injectable } from '@angular/core';

// ¿Qué devuelve el proceso de derivación?
export interface DerivedKeyBundle {
  encryptionKey: CryptoKey; // AES-256-GCM, no exportable — solo en RAM
  authHash: string; // base64 — lo único que viaja al servidor
  saltBase64: string; // base64 — el servidor lo guarda y devuelve en login
}

// ¿Qué forma tiene un dato cifrado?
export interface EncryptedPayload {
  ciphertext: string; // base64 — los datos cifrados
  iv: string; // base64 — vector de inicialización (explicamos esto en encrypt)
}
@Injectable({ providedIn: 'root' })
export class CryptoService {
  // ── Constantes ─────────────────────────────────────────────
  private readonly PBKDF2_ITERATIONS = 600_000;
  private readonly SALT_BYTES = 32;
  private readonly SESSION_KEY = 'vault-encryption-session';

  // ── Estado de sesión ───────────────────────────────────────
  private _encryptionKey: CryptoKey | null = null;

  // ── API pública ────────────────────────────────────────────
  async deriveKeysForRegistration(password: string): Promise<DerivedKeyBundle> {
    const salt = crypto.getRandomValues(new Uint8Array(this.SALT_BYTES));
    return this._deriveAll(password, salt);
  }

  async deriveKeysForLogin(password: string, saltBase64: string): Promise<DerivedKeyBundle> {
    const salt = this._fromBase64(saltBase64);
    const result = await this._deriveAll(password, salt);
    
    // Guardar en sessionStorage para recuperar después de reload
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({
      password,
      saltBase64,
    }));
    
    return result;
  }

  /** Verifica si tiene clave de encriptación disponible */
  hasEncryptionKey(): boolean {
    return this._encryptionKey !== null;
  }

  /** Intenta re-derivar la clave desde sessionStorage si existe */
  async restoreEncryptionKeyIfNeeded(): Promise<boolean> {
    if (this._encryptionKey) return true; // Ya tiene clave

    const stored = sessionStorage.getItem(this.SESSION_KEY);
    if (!stored) return false; // No hay datos guardados

    try {
      const { password, saltBase64 } = JSON.parse(stored);
      await this.deriveKeysForLogin(password, saltBase64);
      return true;
    } catch (err) {
      console.error('Error restoring encryption key:', err);
      return false;
    }
  }

  async encrypt(plaintext: string): Promise<EncryptedPayload> {
    if (!this._encryptionKey) throw new Error('Sin sesión activa');

    // 1. IV nuevo en cada llamada — 12 bytes es el estándar para AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 2. Cifrar
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this._encryptionKey,
      new TextEncoder().encode(plaintext),
    );

    // 3. Devolver ambos — sin el IV no se puede descifrar
    return {
      ciphertext: this._toBase64(ciphertext),
      iv: this._toBase64(iv),
    };
  }

  async decrypt(payload: EncryptedPayload): Promise<string> {
    if (!this._encryptionKey) throw new Error('Sin sesión activa');

    // 1. Reconstruir el IV desde base64
    const iv = this._fromBase64(payload.iv);

    // 2. Descifrar — lanza excepción si los datos fueron manipulados
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this._encryptionKey,
      this._fromBase64(payload.ciphertext),
    );

    // 3. Bytes → string
    return new TextDecoder().decode(plaintext);
  }

  clearSession(): void {
    this._encryptionKey = null;
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  // ── Privado: núcleo de derivación ──────────────────────────
  private async _deriveAll(
    password: string,
    salt: Uint8Array<ArrayBuffer>,
  ): Promise<DerivedKeyBundle> {
    // Paso A: string → bytes
    const passwordBytes = new TextEncoder().encode(password);

    // Paso B: bytes → CryptoKey marcada como material PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      'raw', // formato de entrada: bytes crudos
      passwordBytes, // los bytes de la contraseña
      'PBKDF2', // algoritmo al que pertenece este material
      false, // extractable: false — este objeto nunca puede exportarse
      ['deriveBits'], // solo puede usarse para derivar bits, nada más
    );

    // Paso C: PBKDF2 → 256 bits base
    const masterBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt, // el Uint8Array que recibimos como parámetro
        iterations: this.PBKDF2_ITERATIONS, // 600 000
        hash: 'SHA-256',
      },
      keyMaterial, // el material del paso anterior
      256, // cuántos bits queremos como output
    );

    // Paso D: envolver los bits como clave HKDF
    const hkdfKey = await crypto.subtle.importKey(
      'raw',
      masterBits, // los 256 bits del paso anterior
      'HKDF', // ahora lo marcamos como material HKDF
      false, // no exportable
      ['deriveBits', 'deriveKey'],
    );

    // Rama A: encryptionKey — cifra el vault, nunca sale de RAM
    const encryptionKey = await crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: new TextEncoder().encode('vault-encryption'), // contexto fijo
        info: new TextEncoder().encode('enc'),
      },
      hkdfKey,
      { name: 'AES-GCM', length: 256 }, // qué tipo de clave queremos
      false, // ← NUNCA exportable
      ['encrypt', 'decrypt'],
    );

    // Rama B: authBits — va al servidor como credencial
    const authBits = await crypto.subtle.deriveBits(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: new TextEncoder().encode('vault-auth'), // contexto diferente al de arriba
        info: new TextEncoder().encode('auth'),
      },
      hkdfKey,
      256,
    );

    // Guardamos la encryptionKey en el estado de sesión
    this._encryptionKey = encryptionKey;

    return {
      encryptionKey,
      authHash: this._toBase64(authBits),
      saltBase64: this._toBase64(salt),
    };
  }

  // ── Privado: utilidades de codificación ───────────────────
  private _toBase64(buf: ArrayBuffer | Uint8Array): string {
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private _fromBase64(b64: string): Uint8Array<ArrayBuffer> {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>;
  }
}
