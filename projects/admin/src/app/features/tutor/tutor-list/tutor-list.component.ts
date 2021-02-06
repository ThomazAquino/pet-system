import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectTutorsForListComponent } from '../../../core/tutors/tutors.selectors';

@Component({
  selector: 'pet-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorListComponent implements OnInit {
  tutors$: Observable<any>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.tutors$ = this.store.select(selectTutorsForListComponent);
  }

  onTutorsListClick(tutor) {
    this.router.navigate(['tutor/profile', tutor.id]);
  }
}
