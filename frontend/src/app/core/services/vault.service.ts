import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface VaultItemCreate {
  item_type: 'password' | 'note';
  ciphertext: string;
  iv: string;
}

export interface VaultItemPublic {
  id: string;
  item_type: 'password' | 'note';
  ciphertext: string;
  iv: string;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class VaultService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vault`;

  getItems() {
    return this.http.get<VaultItemPublic[]>(`${this.apiUrl}/items/`);
  }

  createItem(item: VaultItemCreate) {
    return this.http.post<VaultItemPublic>(`${this.apiUrl}/items/`, item);
  }

  deleteItem(id: string) {
    return this.http.delete(`${this.apiUrl}/items/${id}/`);
  }
}
