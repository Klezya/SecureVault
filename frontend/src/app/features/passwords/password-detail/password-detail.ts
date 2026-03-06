import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-detail',
  imports: [],
  templateUrl: './password-detail.html',
  styleUrl: './password-detail.css',
})
export class PasswordDetail {
  user_id: number | null = null;
  private route = inject(ActivatedRoute);

  constructor() {
    
    console.log(this.route.snapshot.paramMap.get("id"));
    this.user_id = Number(this.route.snapshot.paramMap.get("id"));
  }
  

}
