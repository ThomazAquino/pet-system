import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/core.module';

enum EmailStatus {
  Verifying,
  Failed
}

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  EmailStatus = EmailStatus;
  emailStatus = EmailStatus.Verifying;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService,
      private notificationsService: NotificationService
  ) { }

  ngOnInit() {
      const token = this.route.snapshot.queryParams['token'];

      // remove token from url to prevent http referer leakage
      this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

      this.authService.verifyEmail(token)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.notificationsService.success('Verification successful, you can now login');
                  this.router.navigate(['../login'], { relativeTo: this.route });
              },
              error: () => {
                  this.emailStatus = EmailStatus.Failed;
              }
          });
  }
}
