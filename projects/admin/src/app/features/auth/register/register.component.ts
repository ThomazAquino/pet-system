import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/core.module';
import { mustMatch } from '../../../shared/must-match.validator';

@Component({
  selector: 'pet-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
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
      this.form = this.formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required],
          telephone: [''],
          cellphone: [''],
          street: ['', Validators.required],
          streetNumber: ['', Validators.required],
          postalCode: ['', Validators.required],
          birthday: ['', Validators.required],
          cpf: ['', Validators.required],
          acceptTerms: [false, Validators.requiredTrue]
      }, {
          validator: mustMatch('password', 'confirmPassword')
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      this.authService.register(this.form.value)
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
