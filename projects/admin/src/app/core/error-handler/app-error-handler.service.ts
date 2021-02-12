import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { NotificationService } from '../notifications/notification.service';
import { AuthService } from '../auth/auth.service';

/** Application-wide error handler that adds a UI notification to the error handling
 * provided by the default Angular ErrorHandler.
 */
@Injectable()
export class AppErrorHandler extends ErrorHandler {
  constructor(
    private notificationsService: NotificationService,
    private authService: AuthService
    ) {
    super();
  }

  handleError(error: Error | HttpErrorResponse) {
    if (error['status'] && [401, 403].includes(error['status']) && this.authService.authValue) {
      // auto logout if 401 or 403 response returned from api
      this.authService.logout();
      this.notificationsService.error((error && error['error'] && error['error'].message) || error['statusText']);
      return
    }

    if (error['status'] && [400].includes(error['status'])) {
      // const displayMessage = error['error'].message;
      // this.notificationsService.error(displayMessage);
      // super.handleError(error);
      return
    }


    let displayMessage = 'An error occurred.';

    if (!environment.production) {
      displayMessage += ' See console for details.';
    }

    this.notificationsService.error(displayMessage);

    super.handleError(error);
  }
}
