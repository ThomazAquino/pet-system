import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { TutorsService } from '../../../core/core.module';
import { loadAllTutors } from '../../../core/tutors/tutors.actions';
import { Role } from '../../../core/tutors/tutors.model';
import { selectAllTutors, selectTutorsForListComponent } from '../../../core/tutors/tutors.selectors';

@Component({
  selector: 'pet-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorListComponent implements OnInit {
  tutors$: Observable<any>;

  constructor(
    private store: Store,
    private router: Router,
    private tutorService: TutorsService
    ) {}

  ngOnInit(): void {
    this.store.dispatch(loadAllTutors());   
    this.tutors$ = this.store.select(selectTutorsForListComponent, Role.User);
  }

  onTutorsListClick(tutor) {
    this.router.navigate(['tutor/profile', tutor.id]);
  }

  onAddTutorClick() {
    this.router.navigate(['tutor/profile/add']);
  }
}
