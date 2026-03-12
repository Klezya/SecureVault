import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-vault-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vault-dashboard.component.html',
})
export class VaultDashboardComponent {}
