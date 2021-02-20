import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Form, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, first, takeUntil, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { upsertPet } from '../../../core/pets/pets.actions';
import { Pet } from '../../../core/pets/pets.model';
import { selectSelectedPet } from '../../../core/pets/pets.selectors';
import { selectTreatmentsByIdsForListComponent } from '../../../core/treatments/treatments.selectors';
import { updateTutor } from '../../../core/tutors/tutors.actions';
import { Tutor } from '../../../core/tutors/tutors.model';
import { selectTutorById } from '../../../core/tutors/tutors.selectors';

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
    private cdRef: ChangeDetectorRef,
  ) { }

  static populatePet(pet?: Pet): any {
    return {
      id: pet?.id || uuid(),
      tutorId: pet?.tutorId,
      name: pet?.name,
      avatar: pet?.avatar,
      type: pet?.type,
      breed: pet?.breed,
      color: pet?.color,
      status: pet?.status || 'in-home'
    };
  }

  ngOnInit(): void {
    this.getUserFromQueryParams();

    this.store
      .pipe(select(selectSelectedPet))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((pet: Pet) => {
        if (!pet) {
          this.isNew = true;
          return 
        }
        this.petFormGroup = this.fb.group(
          PetProfileComponent.populatePet(pet)
        );
        this.initialFormState = this.petFormGroup.getRawValue();

        this.petFormGroup.valueChanges
          .pipe(
            takeUntil(this.destroyed$),
            debounceTime(200),
            tap((form: Form) => console.log(form))
          )
          .subscribe((_) => this.formValueChanges$.next(true));

        this.selectedTutor$ = this.store.pipe(select(selectTutorById, pet.tutorId));

        if (pet?.treatments?.length > 0) {
          this.treatments$ = this.store.select(
            selectTreatmentsByIdsForListComponent,
            pet.treatments
          );
        }
      });
  }

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
      this.store.dispatch(upsertPet({ pet: this.petFormGroup.value }));

      if (this.isNew) {
        this.store.select(selectTutorById, this.petFormGroup.controls.tutorId.value).pipe(
          first()
        ).subscribe(tutor => {
          this.store.dispatch(updateTutor(
            {tutor: {
              id: tutor.id,
              changes: {pets: [...tutor.pets, this.petFormGroup.controls.id.value]}
            }}
          ))
        })

        this.router.navigate(['pet/profile', this.petFormGroup.controls.id.value]);
      } else {
        this.formValueChanges$.next(false);
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
        .compressFile(event.target.result, null, 75, 50)
        .then((result) => {
          // this.store.dispatch(upsertTutor({tutor : {...this.tutorFormGroup.value, image:result}}));
          this.petFormGroup.controls.avatar.setValue(result);
          this.cdRef.detectChanges();
        });
      // this.imageService.uploadImage(this.selectedFile.file).subscribe(
      //   (res) => {

      //   },
      //   (err) => {

      //   })
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

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
