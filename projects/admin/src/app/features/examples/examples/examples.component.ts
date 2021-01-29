import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import {
  routeAnimations,
  selectIsAuthenticated
} from '../../../core/core.module';

import { State } from '../examples.state';

@Component({
  selector: 'pet-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  examples = [
    { link: 'todos', label: 'pet.examples.menu.todos' },
    { link: 'stock-market', label: 'pet.examples.menu.stocks' },
    { link: 'theming', label: 'pet.examples.menu.theming' },
    { link: 'crud', label: 'pet.examples.menu.crud' },
    {
      link: 'simple-state-management',
      label: 'pet.examples.menu.simple-state-management'
    },
    { link: 'form', label: 'pet.examples.menu.form' },
    { link: 'notifications', label: 'pet.examples.menu.notifications' },
    { link: 'elements', label: 'pet.examples.menu.elements' },
    { link: 'authenticated', label: 'pet.examples.menu.auth', auth: true }
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }
}
