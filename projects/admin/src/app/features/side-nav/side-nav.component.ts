import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'pet-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent implements OnInit {
  logo = require('../../../assets/logo-long.png').default;
  isAuth$ = this.authService.auth;

  navigation = [
    { link: 'home', label: 'Home', icon: 'home' },
    { link: 'tutor', label: 'Tutores', icon: 'user' },
    { link: 'pet', label: 'Pets', icon: 'dog' },
    { link: 'treatment', label: 'Tratamentos', icon: 'stethoscope' },
    // { link: 'about', label: 'about', icon: 'home' },
    // { link: 'feature-list', label: 'features', icon: 'home' },
    // { link: 'examples', label: 'examples', icon: 'home' },
    { link: 'settings', label: 'settings', icon: 'home' }
  ];


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

}
