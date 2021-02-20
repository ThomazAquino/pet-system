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
import { Form, FormBuilder } from '@angular/forms';
import { Tutor } from '../../../core/tutors/tutors.model';
import {
  merge,
  Observable,
  ReplaySubject,
  BehaviorSubject
} from 'rxjs';
import { selectPetsByIdsForListComponent } from '../../../core/pets/pets.selectors';
import { selectSelectedTutor } from '../../../core/tutors/tutors.selectors';
import { debounceTime, filter, first, takeUntil, tap } from 'rxjs/operators';
import { upsertTutor } from '../../../core/tutors/tutors.actions';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ActivatedRoute, Router } from '@angular/router';

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

  tutorFormGroup = this.fb.group(TutorProfileComponent.populateTutor());

  formValueChanges$ = new BehaviorSubject(false);
  initialFormState: any;
  isNew: boolean;

  pets$: Observable<any>;
  selectedFile: ImageSnippet;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    public store: Store,
    public fb: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) {}

  static populateTutor(tutor?: Tutor): any {
    return {
      id: tutor?.id || uuid(),
      name: tutor?.name,
      lastName: tutor?.lastName,
      avatar: tutor?.avatar,
      cpf: tutor?.cpf,
      birthday: tutor?.birthday,
      street: tutor?.street,
      streetNumber: tutor?.streetNumber,
      postalCode: tutor?.postalCode,
      tel: tutor?.tel,
      cellPhone: tutor?.cellPhone
    };
  }

  ngOnInit(): void {
    this.store
      .pipe(select(selectSelectedTutor))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tutor: Tutor) => {
        if (!tutor) { 
          this.isNew = true;
          return 
        }
        this.tutorFormGroup = this.fb.group(
          TutorProfileComponent.populateTutor(tutor)
        );
        this.initialFormState = this.tutorFormGroup.getRawValue();

        this.tutorFormGroup.valueChanges
          .pipe(
            takeUntil(this.destroyed$),
            debounceTime(200),
            tap((form: Form) => console.log(form))
          )
          .subscribe((_) => this.formValueChanges$.next(true));

        if (tutor.pets) {
          this.pets$ = this.store.select(
            selectPetsByIdsForListComponent,
            tutor.pets
          );
        }
      });
  }

  save() {
    if (this.tutorFormGroup.status === 'VALID') {
      if (this.isNew) {
        this.store.dispatch(upsertTutor({ tutor: {...this.tutorFormGroup.value, pets: []}}));

        this.router.navigate(['tutor/profile', this.tutorFormGroup.controls.id.value]);
      } else {
        this.store.dispatch(upsertTutor({ tutor: this.tutorFormGroup.value }));
        this.formValueChanges$.next(false);
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
        .compressFile(event.target.result, null, 75, 50)
        .then((result) => {
          // this.store.dispatch(upsertTutor({tutor : {...this.tutorFormGroup.value, image:result}}));
          this.tutorFormGroup.controls.avatar.setValue(result);
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

  onPetListClick(pet) {
    this.router.navigate(['pet/profile', pet.id]);
  }

  onAddPetClick() {
    this.router.navigate(['pet/profile'], { queryParams: {tutor: this.tutorFormGroup.controls.id.value} });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
