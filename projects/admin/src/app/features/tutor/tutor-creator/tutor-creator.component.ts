import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/core.module';

@Component({
  selector: 'pet-tutor-creator',
  templateUrl: './tutor-creator.component.html',
  styleUrls: ['./tutor-creator.component.scss'],
  host: { class: 'section' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorCreatorComponent implements OnInit {
  tutorForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService,
      private notificationsService: NotificationService
  ) { }

  ngOnInit() {
      this.tutorForm = this.formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          password: ['123456'],
          confirmPassword: ['123456'],
          telephone: [''],
          cellphone: [''],
          street: ['', Validators.required],
          streetNumber: ['', Validators.required],
          postalCode: ['', Validators.required],
          birthday: ['', Validators.required],
          cpf: ['', Validators.required],
          acceptTerms: [true]
      }, {
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.tutorForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.tutorForm.invalid) {
          return;
      }

      this.loading = true;
      this.authService.register(this.tutorForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.notificationsService.success('Registration successful, please check your email for verification instructions');
                  this.router.navigate(['../login'], { relativeTo: this.route });
              },
              error: error => {
                  this.notificationsService.error(error);
                  this.loading = false;
              }
          });
  }
}
