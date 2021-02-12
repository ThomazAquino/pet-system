import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { AppState } from '../core.state';

import { AuthGuard } from './auth-guard';
import { AuthState } from './auth.models';
import { selectIsAuthenticated } from './auth.selectors';

describe('AuthGuardService', () => {
  let authGuardService: AuthGuard;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, provideMockStore()]
    });
    authGuardService = TestBed.inject<AuthGuard>(AuthGuard);
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectIsAuthenticated, true);
  });

  it('should be created', () => {
    expect(authGuardService).toBeTruthy();
  });

  it('should return isAuthenticated from authState', () => {
    authGuardService.canActivate().subscribe((canActivate) => {
      expect(canActivate).toBe(true);
    });
  });
});

function createState(authState: AuthState) {
  return {
    auth: authState
  } as AppState;
}
