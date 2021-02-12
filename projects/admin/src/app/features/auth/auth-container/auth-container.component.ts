import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'pet-auth-container',
  templateUrl: './auth-container.component.html',
  styleUrls: ['./auth-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthContainerComponent implements OnInit {

  constructor(
    private router: Router,
    private accountService: AuthService
  ) {
      // redirect to home if already logged in
      if (this.accountService.authValue) {
          this.router.navigate(['/']);
      }
    }

  ngOnInit(): void {
  }

}
