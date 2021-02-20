import { updatePropertyToArrayInTreatment } from './../../../core/treatments/treatments.actions';
import { selectSelectedTreatment } from './../../../core/treatments/treatments.selectors';
import { Treatment } from './../../../core/treatments/treatments.model';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Form, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { Pet } from '../../../core/pets/pets.model';
import { selectPetById } from '../../../core/pets/pets.selectors';
import { Tutor } from '../../../core/tutors/tutors.model';
import { selectTutorById } from '../../../core/tutors/tutors.selectors';
import { addPropertyToArrayInTreatment, updateTreatment } from '../../../core/treatments/treatments.actions';
import { NotificationService } from '../../../core/notifications/notification.service';

class ImageSnippet {
  constructor(public file: File) {}
}

export interface InputData {
  propertyName: string;
  label: string;
  value: any;
  action?: string;
  options?: {
    autoSave: boolean;
  }
}

@Component({
  selector: 'pet-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['./treatment.component.scss'],
  host: { class: 'section' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreatmentComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  treatmentFormGroup = this.fb.group(TreatmentComponent.populatePet());
  formValueChanges$ = new BehaviorSubject(false);
  selectedPet$: Observable<Pet>;
  selectedTutor$: Observable<Tutor>;
  selectedTreatment: Treatment;

  initialFormState: any;
  isNew: boolean;

  // old pets in tutor profile
  treatments$: Observable<any>;
  selectedFile: ImageSnippet;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    public store: Store,
    public fb: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private notificationService : NotificationService
  ) { }

  static populatePet(treatment?: Treatment): any {
    return {
      id: treatment?.id,
      status: treatment?.status,
      enterDate: treatment?.enterDate,
      dischargeDate: treatment?.dischargeDate,
      medications: treatment?.medications,
      food: treatment?.food,
      conclusiveReport: treatment?.conclusiveReport,
      dischargeCare: treatment?.dischargeCare,
      conclusiveReportShort: treatment?.conclusiveReportShort,
      clinicEvo: treatment?.clinicEvo,
      clinicEvoResume: treatment?.clinicEvoResume,
      belongsToVet: treatment?.belongsToVet
    };
  }

  ngOnInit() {
    this.store
      .pipe(select(selectSelectedTreatment))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((treatment: Treatment) => {
        if (!treatment) {
          // this.isNew = true;
          return 
        }
        this.selectedTreatment = treatment;
        this.treatmentFormGroup = this.fb.group(
          TreatmentComponent.populatePet(treatment)
        );
        this.initialFormState = this.treatmentFormGroup.getRawValue();

        this.treatmentFormGroup.valueChanges
          .pipe(
            takeUntil(this.destroyed$),
            debounceTime(200),
            tap((form: Form) => console.log(form))
          )
          .subscribe((_) => this.formValueChanges$.next(true));

        this.selectedPet$ = this.store.pipe(select(selectPetById, treatment.petId));

        this.selectedPet$.pipe(takeUntil(this.destroyed$)).subscribe(pet => {
          if (pet?.tutorId) {
            this.selectedTutor$ = this.store.pipe(select(selectTutorById, pet.tutorId));
          }
        })
      });
  }

  getUserAndPetFromQueryParams() {
    this.activatedRouter.queryParams.subscribe(queryParams => {
      if (queryParams) {
        this.selectedTutor$ = this.store.pipe(select(selectTutorById, queryParams.tutor));
        this.selectedPet$ = this.store.pipe(select(selectPetById, queryParams.pet));
      }
    });
  }

  updatePropertyOnTreatment(change: InputData) {
    const updateObj = {}
    updateObj[change.propertyName] = change.value;
    this.store.dispatch(updateTreatment({
      treatment: {
        id: this.treatmentFormGroup.controls.id.value,
        changes: updateObj
      }
    }));
    this.notificationService.info(`${change.label} atualizado.`);
  }

  updateNestedPropertyOnTreatment(change: InputData) {
    if (change.action === 'add') {
      this.store.dispatch(addPropertyToArrayInTreatment(
        { treatmentId: this.selectedTreatment.id,  propertyName: 'medications', value: change.value}
      ));
      this.notificationService.info(`${change.label} criado.`);
    } else if (change.action === 'update') {
      this.store.dispatch(updatePropertyToArrayInTreatment(
        { treatmentId: this.selectedTreatment.id,  propertyName: 'medications', value: change.value}
      ));
    }
    
  }

}
