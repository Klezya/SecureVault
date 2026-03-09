import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-password-detail',
  imports: [],
  templateUrl: './password-detail.html',
  styleUrl: './password-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordDetail {
  readonly id = input.required<string>();
  readonly userId = computed(() => Number(this.id()));
}
