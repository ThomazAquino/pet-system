import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { v4 as uuid } from 'uuid';
import { select, State, Store } from '@ngrx/store';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role, Tutor } from '../../../core/tutors/tutors.model';
import {
  merge,
  Observable,
  ReplaySubject,
  BehaviorSubject
} from 'rxjs';
import { selectPetsByIdsForListComponent } from '../../../core/pets/pets.selectors';
import { selectSelectedTutor } from '../../../core/tutors/tutors.selectors';
import { debounceTime, filter, first, takeUntil, tap } from 'rxjs/operators';
import { addTutor, updateTutor, upsertTutor, deleteTutor, loadManyTutorsByIds, loadTutorById } from '../../../core/tutors/tutors.actions';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ActivatedRoute, Router } from '@angular/router';
import { mustMatch } from '../../../shared/must-match.validator';
import { loadManyPetsByIds } from '../../../core/pets/pets.actions';
import { NoIdProvided, NO_ID_PROVIDED } from '../../../core/core.state';
import { TypeOfHeader } from '../../../shared/header-profile/header-profile.component';
import { parseUrlToFile } from '../../../shared/hepper-functions';

class ImageSnippet {
  constructor(public file: File) {}
}

@Component({
  selector: 'pet-tutor-profile',
  templateUrl: './tutor-profile.component.html',
  styleUrls: ['./tutor-profile.component.scss'],
  host: { class: 'section' },
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TutorProfileComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  // tutorFormGroup = this.fb.group(TutorProfileComponent.populateTutor());
  tutorFormGroup: FormGroup;

  formValueChanges$ = new BehaviorSubject(false);
  isInitialization = true;
  initialFormState: any;
  isAddMode: boolean;
  tutorProfileHeader = TypeOfHeader.tutorProfile;

  pets$: Observable<any>;
  imageToUpload: any;

  tutorCallMade = false;
  
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  // Only used for dispatch delete user
  private petsIds: string[];

  
  

  constructor(
    public store: Store,
    public fb: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
  ) {}

  // static populateTutor(tutor?: Tutor): any {
  //   return {
  //     id: tutor?.id || uuid(),
  //     firstName: tutor?.firstName,
  //     lastName: tutor?.lastName,
  //     avatar: tutor?.avatar,
  //     cpf: tutor?.cpf,
  //     birthday: tutor?.birthday,
  //     street: tutor?.street,
  //     streetNumber: tutor?.streetNumber,
  //     postalCode: tutor?.postalCode,
  //     telephone: tutor?.telephone,
  //     cellPhone: tutor?.cellPhone
  //   };
  // }

  ngOnInit(): void {
    this.tutorFormGroup = this.fb.group({
      id: [''],
      firstName: ['', Validators.required], 
      lastName: ['', Validators.required],
      avatar: [''],
      cpf: ['', Validators.required],
      birthday: ['', Validators.required],
      street: ['', Validators.required],
      streetNumber: ['', Validators.required],
      postalCode: ['', Validators.required],
      telephone: ['', Validators.required],
      cellphone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // role: ['', Validators.required],
      // password: ['', [Validators.minLength(6), this.isAddMode ? Validators.required : Validators.nullValidator]],
      // confirmPassword: ['']
  }, {
      // validator: mustMatch('password', 'confirmPassword')
  });

    this.store
      .pipe(select(selectSelectedTutor))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tutor: Tutor) => {
        if (!tutor) { 
          this.isAddMode = true;

          // Try to get user from the server
          const id = this.route.snapshot.params['id'];
          if (id !== 'add' && !this.tutorCallMade) {
            this.tutorCallMade = true;
            this.store.dispatch(loadTutorById({id: id}));
          }
          return
        } else {
          this.isAddMode = false;
        }

        this.tutorFormGroup.patchValue(tutor, { emitEvent: false });
        this.initialFormState = this.tutorFormGroup.getRawValue();

        if (this.isInitialization) {
          this.isInitialization = false;

          this.tutorFormGroup.valueChanges
          .pipe(
            takeUntil(this.destroyed$),
            debounceTime(200),
            tap((form: Form) => console.log(form))
          )
          .subscribe((_) => this.formValueChanges$.next(true));
        }

        if (tutor.pets?.length > 0) {
          this.store.dispatch(loadManyPetsByIds({ids: tutor.pets}));
          this.petsIds = tutor.pets;

                
          this.pets$ = this.store.select(
            selectPetsByIdsForListComponent,
            tutor.pets
          );
        }
        setTimeout(() => this.cdRef.detectChanges(), 1);
        // Temp. To not make the call when route changes
        this.tutorCallMade = true;
      });
      
  }

  save() {
    if (this.tutorFormGroup.status !== 'VALID') { return }

    if (this.isAddMode) {
      const tutor = this.tutorFormGroup.getRawValue()
      tutor.password = '123456';
      tutor.confirmPassword = '123456';
      if (this.imageToUpload) { tutor.avatar = this.imageToUpload; }
      this.store.dispatch(addTutor({ tutor: tutor }));
      
    } else {
      this.formValueChanges$.next(false);
      const changes: Partial<Tutor> = {};
      Object.keys(this.tutorFormGroup.controls).forEach(fieldKey => {
        if (fieldKey === 'id') return;
        if (this.tutorFormGroup.controls[fieldKey].touched && this.initialFormState[fieldKey] !== this.tutorFormGroup.controls[fieldKey].value) {
          changes[fieldKey] = this.tutorFormGroup.controls[fieldKey].value;
        }
        if (changes.avatar) { changes.avatar = this.imageToUpload; }
      });

      this.store.dispatch(updateTutor({
        tutor: {
          id: this.tutorFormGroup.controls.id.value,
          changes: changes
        }
      }));
    }
  }

  cancelEditing() {
    this.tutorFormGroup.setValue(this.initialFormState, { emitEvent: false });
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
            this.tutorFormGroup.controls.avatar.setValue(result);
            this.tutorFormGroup.controls.avatar.markAllAsTouched();
            this.cdRef.detectChanges();

          });
        });
    });
    reader.readAsDataURL(file);
  }

  onPetListClick(pet) {
    this.router.navigate(['pet/profile', pet.id]);
  }

  onAddPetClick() {
    this.router.navigate(['pet/profile'], { queryParams: {tutor: this.tutorFormGroup.controls.id.value} });
  }

  deleteUser() {
    this.store.dispatch(deleteTutor({id: this.tutorFormGroup.controls.id.value }));
    return false
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
