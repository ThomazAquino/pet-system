import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { selectIsAuthenticated } from './auth.selectors';
import { AppState } from '../core.state';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private router: Router
    ) {}

  // canActivate(): Observable<boolean> {
  //   return this.store.pipe(select(selectIsAuthenticated));
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const auth = this.authService.authValue;
    if (auth) {
        // check if route is restricted by role
        if (route.data.roles && !route.data.roles.includes(auth.role)) {
            // role not authorized so redirect to home page
            this.router.navigate(['/']);
            return false;
        }

        // authorized so return true
        return true;
    }

    // not logged in so redirect to login page with the return url 
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
