import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pet-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent implements OnInit {
  logo = require('../../../assets/logo-long.png').default;

  navigation = [
    { link: 'home', label: 'Home', icon: 'home' },
    { link: 'tutor', label: 'Tutores', icon: 'user' },
    { link: 'about', label: 'about', icon: 'home' },
    { link: 'feature-list', label: 'features', icon: 'home' },
    { link: 'examples', label: 'examples', icon: 'home' },
    { link: 'settings', label: 'settings', icon: 'home' }
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
