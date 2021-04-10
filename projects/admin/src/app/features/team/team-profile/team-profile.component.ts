import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { addTutor, deleteTutor, updateTutor } from '../../../core/tutors/tutors.actions';
import { Role, Tutor } from '../../../core/tutors/tutors.model';
import { selectSelectedTutor } from '../../../core/tutors/tutors.selectors';
import { mustMatch } from '../../../shared/must-match.validator';
import { parseUrlToFile } from '../../../shared/hepper-functions';

class ImageSnippet {
  constructor(public file: File) {}
}

@Component({
  selector: 'pet-team-profile',
  templateUrl: './team-profile.component.html',
  styleUrls: ['./team-profile.component.scss'],
  host: { class: 'section' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamProfileComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  // tutorFormGroup = this.fb.group(TutorProfileComponent.populateTutor());
  tutorFormGroup: FormGroup;

  formValueChanges$ = new BehaviorSubject(false);
  isInitialization = true;
  initialFormState: any;
  isAddMode: boolean;

  pets$: Observable<any>;
  selectedFile: ImageSnippet;

  roles: { value: Role, label: string }[] = [
    {value: Role.Admin, label: 'Administrador'},
    {value: Role.Vet, label: 'Veterinário'},
    {value: Role.Nurse, label: 'Enfermeiro'}
  ];

  imageToUpload: any;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    public store: Store,
    public fb: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) {}

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
      role: ['', Validators.required],
      password: ['', [Validators.minLength(6), this.isAddMode ? Validators.required : Validators.nullValidator]],
      confirmPassword: ['']
  }, {
      validator: mustMatch('password', 'confirmPassword')
  });

    this.store
      .pipe(select(selectSelectedTutor))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user: Tutor) => {
        if (!user) { 
          this.isAddMode = true;
          return 
        } else {
          this.isAddMode = false;
        }

        this.tutorFormGroup.patchValue(user, { emitEvent: false });
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

        // if (user.pets) {
        //   this.pets$ = this.store.select(
        //     selectPetsByIdsForListComponent,
        //     user.pets
        //   );
        // }
        setTimeout(() => this.cdRef.detectChanges(), 1);
      });
  }

  save() {
    if (this.tutorFormGroup.status === 'VALID') {
      console.log(this.tutorFormGroup.value);

      if (this.isAddMode) {
        const tutor = this.tutorFormGroup.getRawValue()
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
    this.store.dispatch(deleteTutor({ id: this.tutorFormGroup.controls.id.value}));
    return false
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}