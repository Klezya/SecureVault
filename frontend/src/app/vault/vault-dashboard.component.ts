import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaultItemFormComponent } from './vault-item-form.component';
import { VaultItemCardComponent } from './vault-item-card.component';
import { VaultItemViewComponent } from './vault-item-view.component';
import { VaultService, VaultItemPublic } from '../core/services/vault.service';
import { CryptoService } from '../core/services/crypto.service';

@Component({
  selector: 'app-vault-dashboard',
  imports: [CommonModule, VaultItemFormComponent, VaultItemCardComponent, VaultItemViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vault-dashboard.component.html',
})
export class VaultDashboardComponent implements OnInit {
  private vaultService = inject(VaultService);
  private cryptoService = inject(CryptoService);

  // Modal state
  showModal = signal(false);
  selectedItemType = signal<'password' | 'note'>('password');

  // Modal state - View
  showViewModal = signal(false);
  selectedViewItem = signal<VaultItemPublic | null>(null);
  selectedViewItemType = signal<'password' | 'note'>('password');
  passwordViewData = signal<any>(null);
  noteViewData = signal<any>(null);

  // Tab state
  activeTab = signal<'passwords' | 'notes'>('passwords');

  // Items state
  items = signal<VaultItemPublic[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Computed filtered items based on active tab
  filteredItems = computed(() => {
    const tabType = this.activeTab();
    const itemsData = this.items();
    return itemsData.filter((item) => item.item_type === (tabType === 'passwords' ? 'password' : 'note'));
  });

  // Computed empty state
  isEmpty = computed(() => this.filteredItems().length === 0 && !this.loading());

  async ngOnInit() {
    // Intentar restaurar la clave de encriptación si fue perdida por reload
    const hasKey = await this.cryptoService.restoreEncryptionKeyIfNeeded();
    if (!hasKey) {
      this.error.set('Sesión de encriptación perdida. Por favor recarga la página.');
      return;
    }

    this.loadItems();
  }

  private loadItems() {
    this.loading.set(true);
    this.error.set(null);

    this.vaultService.getItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading items:', err);
        this.error.set('No se pudieron cargar los elementos. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }

  switchTab(tab: 'passwords' | 'notes') {
    this.activeTab.set(tab);
  }

  openModal(type: 'password' | 'note') {
    this.selectedItemType.set(type);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  async onItemCreated(item: any) {
    try {
      await this.vaultService.createItem(item).toPromise();
      this.closeModal();
      this.loadItems();
    } catch (err) {
      console.error('Error creating item:', err);
    }
  }

  async onItemView(item: VaultItemPublic) {
    try {
      this.selectedViewItem.set(item);
      this.selectedViewItemType.set(item.item_type);

      // Decrypt the data
      const plaintext = await this.cryptoService.decrypt({
        ciphertext: item.ciphertext,
        iv: item.iv,
      });
      const data = JSON.parse(plaintext);
      
      // Assign to the correct property based on type
      if (item.item_type === 'password') {
        this.passwordViewData.set(data);
        this.noteViewData.set(null);
      } else {
        this.noteViewData.set(data);
        this.passwordViewData.set(null);
      }
      
      this.showViewModal.set(true);
    } catch (err) {
      console.error('Error viewing item:', err);
      this.error.set('No se pudo desencriptar el elemento.');
    }
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.selectedViewItem.set(null);
    this.passwordViewData.set(null);
    this.noteViewData.set(null);
  }

  onViewItemEdit() {
    // TODO: Implement edit on the viewed item
    console.log('Edit clicked on viewed item');
    this.closeViewModal();
  }

  onItemDelete(itemId: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      return;
    }

    this.vaultService.deleteItem(itemId).subscribe({
      next: () => {
        this.items.set(this.items().filter((item) => item.id !== itemId));
      },
      error: (err) => {
        console.error('Error deleting item:', err);
        this.error.set('No se pudo eliminar el elemento.');
      },
    });
  }

  retryLoad() {
    this.loadItems();
  }
}
