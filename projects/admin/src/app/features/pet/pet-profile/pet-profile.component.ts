import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Form, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, first, takeUntil, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { threadId } from 'worker_threads';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { NoIdProvided, NO_ID_PROVIDED } from '../../../core/core.state';
import { addPet, deletePet, loadPetById, updatePet, upsertPet } from '../../../core/pets/pets.actions';
import { Pet } from '../../../core/pets/pets.model';
import { selectSelectedPet } from '../../../core/pets/pets.selectors';
import { loadManyTreatmentsByIds } from '../../../core/treatments/treatments.actions';
import { selectTreatmentsByIdsForListComponent } from '../../../core/treatments/treatments.selectors';
import { updateTutor } from '../../../core/tutors/tutors.actions';
import { Tutor } from '../../../core/tutors/tutors.model';
import { selectTutorById } from '../../../core/tutors/tutors.selectors';
import { TypeOfHeader } from '../../../shared/header-profile/header-profile.component';
import { parseUrlToFile } from '../../../shared/hepper-functions';

class ImageSnippet {
  constructor(public file: File) {}
}

@Component({
  selector: 'pet-pet-profile',
  templateUrl: './pet-profile.component.html',
  styleUrls: ['./pet-profile.component.scss'],
  host: { class: 'section' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetProfileComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  petFormGroup = this.fb.group(PetProfileComponent.populatePet());
  formValueChanges$ = new BehaviorSubject(false);
  // selectedPet$: Observable<Pet> = this.store.pipe(select(selectSelectedPet));
  selectedTutor$: Observable<Tutor>;

  initialFormState: any;
  isAddMode: boolean;

  petHeader = TypeOfHeader.petProfile;

  isInitialization = true;

  petCallMade = false;

  // old pets in tutor profile
  treatments$: Observable<any>;
  imageToUpload: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);



  constructor(
    public store: Store,
    public fb: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private router: Router,
    private route: ActivatedRoute,
    private activatedRouter: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
  ) { }

  static populatePet(pet?: Pet): any {
    return {
      id: pet?.id,
      tutorId: pet?.tutorId,
      name: pet?.name,
      avatar: pet?.avatar || '',
      type: pet?.type,
      breed: pet?.breed,
      color: pet?.color,
      status: pet?.status || 'in-home'
    };
  }

  ngOnInit(): void {
    // Only for creation of pet
    this.getUserFromQueryParams();

    this.store
      .pipe(select(selectSelectedPet))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((pet: Pet) => {
        if (!pet) {
          this.isAddMode = true;

          // Try to get user from the server
          const id = this.route.snapshot.params['id'];
          if (id && id !== 'add' && !this.petCallMade) {
            this.petCallMade = true;
            this.store.dispatch(loadPetById({id: id}));
          }
          return 
        } else {
          this.isAddMode = false;
          this.petCallMade = true;
        }
        
        this.petFormGroup = this.fb.group(
          PetProfileComponent.populatePet(pet)
        );
        this.initialFormState = this.petFormGroup.getRawValue();

        if (this.isInitialization) {
          this.isInitialization = false;

          this.petFormGroup.valueChanges
          .pipe(
            takeUntil(this.destroyed$),
            debounceTime(200),
            tap((form: Form) => console.log(form))
          )
          .subscribe((_) => this.formValueChanges$.next(true));
        }

        // dispatch load?
        this.selectedTutor$ = this.store.pipe(select(selectTutorById, pet.tutorId));

        if (pet?.treatments?.length > 0) {
          this.store.dispatch(loadManyTreatmentsByIds({ids: pet.treatments}));

          this.treatments$ = this.store.select(
            selectTreatmentsByIdsForListComponent,
            pet.treatments
          );
        }
        // Temp. To not make the call when route changes
        this.petCallMade = true;
        setTimeout(() => this.cdRef.detectChanges(), 1);
      });
  }

  // Only for creation of pet
  getUserFromQueryParams() {
    this.activatedRouter.queryParams.subscribe(queryParams => {
      if (queryParams) {
        this.selectedTutor$ = this.store.pipe(select(selectTutorById, queryParams.tutor));
        this.petFormGroup.controls.tutorId.setValue(queryParams.tutor);
      }
    });
  }

  save() {
    if (this.petFormGroup.status === 'VALID') {
      // this.store.dispatch(upsertPet({ pet: this.petFormGroup.value }));

      if (this.isAddMode) {
        const pet = this.petFormGroup.getRawValue()
        pet.treatments = [];
        if (this.imageToUpload) { pet.avatar = this.imageToUpload; }
        this.store.dispatch(addPet({ pet: pet }));
      } else {
        this.formValueChanges$.next(false);
        const changes: Partial<Pet> = {};
        Object.keys(this.petFormGroup.controls).forEach(fieldKey => {
          if (fieldKey === 'id') return;
          if (this.petFormGroup.controls[fieldKey].touched && this.initialFormState[fieldKey] !== this.petFormGroup.controls[fieldKey].value) {
            changes[fieldKey] = this.petFormGroup.controls[fieldKey].value;
          }
          if (changes.avatar) { changes.avatar = this.imageToUpload; }
        });
        this.store.dispatch(updatePet({
          pet: {
            id: this.petFormGroup.controls.id.value,
            changes: changes
          }
        }));
      }
    }
  }

  cancelEditing() {
    this.petFormGroup.setValue(this.initialFormState, { emitEvent: false });
    this.formValueChanges$.next(false);
  }

  handleImageUploaded(imageInput) {
    const file: any = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.imageCompress
        .compressFile(event.target.result, null, 50, 50)
        .then((result) => {
          parseUrlToFile(result, 'a',file.type)
          .then(file => {
            this.imageToUpload = file;

            // Before sync we replace this base64 result for the actual fileToUpload.
            // We do this because the headerComponent is not expecting a file Object.
            // It can receive either a string with a path or a base46.
            this.petFormGroup.controls.avatar.setValue(result);
            this.petFormGroup.controls.avatar.markAllAsTouched();
            this.cdRef.detectChanges();

          });
        });
    });

    reader.readAsDataURL(file);
  }

  onTreatmentsListClick(treatment) {
    this.router.navigate(['treatment', treatment.id]);
  }

  onAddTreatmentClick() {
    this.selectedTutor$.pipe(first()).subscribe(tutor => {
      this.router.navigate(['treatment/add'], {
        queryParams: { 
          tutor: tutor.id,
          pet: this.petFormGroup.controls.id.value,
        }
      });
    });
  }

  deletePet() {
    this.store.dispatch(deletePet({id: this.petFormGroup.controls.id.value}));
    return false
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}


