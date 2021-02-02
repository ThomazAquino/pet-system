import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  routeAnimations
} from '../../../core/core.module';
import { Tutor } from '../../../core/tutors/tutors.model';
import { selectAllTutors } from '../../../core/tutors/tutors.reducer';

@Component({
  selector: 'pet-tutor-container',
  templateUrl: './tutor-container.component.html',
  styleUrls: ['./tutor-container.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorContainerComponent implements OnInit {

  // owners$: Observable<Owner[]> = this.store.pipe(select(selectAllOwners));

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

}
