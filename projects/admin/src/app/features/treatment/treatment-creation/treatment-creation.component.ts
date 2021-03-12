import { Treatment } from './../../../core/treatments/treatments.model';
import { v4 as uuid } from 'uuid';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Pet } from '../../../core/pets/pets.model';
import { selectPetById } from '../../../core/pets/pets.selectors';
import { Tutor } from '../../../core/tutors/tutors.model';
import { selectTutorById } from '../../../core/tutors/tutors.selectors';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { addTreatment, upsertTreatment } from '../../../core/treatments/treatments.actions';
import { first } from 'rxjs/operators';
import { NotificationService } from '../../../core/notifications/notification.service';
import * as petsAction  from '../../../core/pets/pets.actions';
import * as treatmentsAction  from '../../../core/treatments/treatments.actions';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'pet-treatment-creation',
  templateUrl: './treatment-creation.component.html',
  styleUrls: ['./treatment-creation.component.scss'],
  host: { class: 'section' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreatmentCreationComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  selectedTutor$: Observable<Tutor>;
  selectedPet$: Observable<Pet>;
  currentDate = new Date()
  treatmentFormGroup = this.fb.group(TreatmentCreationComponent.createTreatment());

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private store: Store,
    public fb: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  static createTreatment(): Partial<Treatment> {
    return {
      // id: uuid(),
      enterDate: ''
    };
  }

  ngOnInit() {
    this.getUserAndPetFromQueryParams();

    this.treatmentFormGroup.controls.enterDate.setValue(new Date());
  }

  getUserAndPetFromQueryParams() {
    this.activatedRouter.queryParams.subscribe(queryParams => {
      if (queryParams) {
        this.selectedTutor$ = this.store.pipe(select(selectTutorById, queryParams.tutor));
        this.selectedPet$ = this.store.pipe(select(selectPetById, queryParams.pet)); 
      }
    });
  }

  finishCreation() {
    let pet: Pet;
    this.selectedPet$.pipe(first()).subscribe(p => pet = p);

    if (pet.status === 'interned') {
      this.notificationService.error('Este pet já possui um tratamento aberto');
      return;
    }

    const vet = this.authService.authValue;
    const dateInUtc = this.treatmentFormGroup.controls.enterDate.value.toUTCString() || this.treatmentFormGroup.controls.enterDate.value;
    
    const treatment: Treatment = {
      id: '',
      status: 'open',
      enterDate: dateInUtc,
      dischargeDate: null,
      medications: [],
      food: [],
      conclusiveReport: null,
      conclusiveReportShort: null,
      dischargeCare: null,
      clinicEvo: null,
      clinicEvoResume: null,
      petId: pet.id,
      petName: pet.name,
      vetId: vet.id,
      vetName: vet.firstName
    };

    // this.store.dispatch(petsAction.createTreatmentForPet({treatment: treatment}));
    this.store.dispatch(treatmentsAction.addTreatment({treatment: treatment}));

    // this.store.dispatch(upsertTreatment({ treatment }));

    // this.store.dispatch(addPropertyToArrayInPets(
    //   { petId: petId,  propertyName: 'treatments', value: this.treatmentFormGroup.controls.id.value}
    // ));

    // dispatch createTreatment for pet
      // upsertTreatment
      // addPropertyToArrayInPets
      // change pet status to interned

    // this.router.navigate(['treatment/', this.treatmentFormGroup.controls.id.value]);
  }

}
