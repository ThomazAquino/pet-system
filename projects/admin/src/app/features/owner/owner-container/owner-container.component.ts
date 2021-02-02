import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  routeAnimations
} from '../../../core/core.module';
import { Owner } from '../../../core/owners/owners.model';
import { selectAllOwners } from '../../../core/owners/owners.reducer';

@Component({
  selector: 'pet-owner-container',
  templateUrl: './owner-container.component.html',
  styleUrls: ['./owner-container.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnerContainerComponent implements OnInit {

  // owners$: Observable<Owner[]> = this.store.pipe(select(selectAllOwners));

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

}
