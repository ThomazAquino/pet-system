import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'pet-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  isAuth$ = this.authService.auth;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

  }

  logout() {
    this.authService.logout();
  }

}
