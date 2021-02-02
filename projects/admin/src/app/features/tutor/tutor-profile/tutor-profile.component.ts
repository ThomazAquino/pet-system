import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { v4 as uuid } from 'uuid';
import { select, State, Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { selectTutorsById } from '../../../core/tutors/tutors.reducer';
import { Tutor } from '../../../core/tutors/tutors.model';
import { merge, Observable } from 'rxjs';
import { selectPetsByIds } from '../../../core/pets/pets.reducer';
import { Pet } from '../../../core/pets/pets.model';
import { selectSelectedTutor } from '../../../core/tutors/tutors.selectors';


@Component({
  selector: 'pet-tutor-profile',
  templateUrl: './tutor-profile.component.html',
  styleUrls: ['./tutor-profile.component.scss'],
  host: { 'class': 'section'},
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorProfileComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  bookFormGroup = this.fb.group(TutorProfileComponent.createBook());
   selectedTutor$: Observable<Tutor> = this.store.pipe(select(selectSelectedTutor));


  isEditing: boolean;
  tutor: Tutor;
  pets: Pet[];


  constructor(
    public store: Store,
    public fb: FormBuilder,
    private router: ActivatedRoute
  ) { }

  static createBook(): any {
    return {
      id: uuid(),
      title: '',
      author: '',
      description: ''
    };
  }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.store.select(selectTutorsById, params['id']).subscribe((tutor: Tutor) => {
        this.tutor = tutor;
         this.store.select(selectPetsByIds, tutor.pets).subscribe(pets => {
           this.pets = pets;
         })
      });
    });
  }
}
