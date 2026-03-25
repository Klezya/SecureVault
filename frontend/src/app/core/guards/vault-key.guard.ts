import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CryptoService } from '../services/crypto.service';

export const vaultKeyGuard: CanActivateFn = async (_route, state) => {
  const router = inject(Router);
  const cryptoService = inject(CryptoService);

  if (cryptoService.hasEncryptionKey()) {
    return true;
  }

  const restored = await cryptoService.restoreEncryptionKeyIfNeeded();
  if (restored) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: {
      returnUrl: state.url,
      reason: 'vault_locked',
    },
  });
};
