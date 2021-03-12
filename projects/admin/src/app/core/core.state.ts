import {
  ActionReducerMap,
  MetaReducer,
  createFeatureSelector
} from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { environment } from '../../environments/environment';

import { initStateFromLocalStorage } from './meta-reducers/init-state-from-local-storage.reducer';
import { debug } from './meta-reducers/debug.reducer';
import { AuthState } from './auth/auth.models';
import { authReducer } from './auth/auth.reducer';
import { RouterStateUrl } from './router/router.state';
import { settingsReducer } from './settings/settings.reducer';
import { SettingsState } from './settings/settings.model';
import { Tutor } from './tutors/tutors.model';
import { tutorsReducer, TutorsState } from './tutors/tutors.reducer';
import { PetsState, petsReducer } from './pets/pets.reducer';
import { treatmentsReducer, TreatmentsState } from './treatments/treatments.reducer';

export const reducers: ActionReducerMap<AppState> = {
  tutors: tutorsReducer,
  pets: petsReducer,
  treatments: treatmentsReducer,
  auth: authReducer,
  settings: settingsReducer,
  router: routerReducer
};

export const metaReducers: MetaReducer<AppState>[] = [
  initStateFromLocalStorage
];

if (!environment.production) {
  if (!environment.test) {
    metaReducers.unshift(debug);
  }
}

export const selectTutorsState = createFeatureSelector<AppState, TutorsState>(
  'tutors'
);

export const selectPetsState = createFeatureSelector<AppState, PetsState>(
  'pets'
);

export const selectTreatmentsState = createFeatureSelector<AppState, TreatmentsState>(
  'treatments'
);

export const selectAuthState = createFeatureSelector<AppState, AuthState>(
  'auth'
);

export const selectSettingsState = createFeatureSelector<
  AppState,
  SettingsState
>('settings');

export const selectRouterState = createFeatureSelector<
  AppState,
  RouterReducerState<RouterStateUrl>
>('router');

export interface AppState {
  tutors: TutorsState;
  pets: PetsState;
  treatments: TreatmentsState;
  auth: AuthState;
  settings: SettingsState;
  router: RouterReducerState<RouterStateUrl>;
}

export type NoIdProvided = 'NO_ID_PROVIDED';
export const NO_ID_PROVIDED: NoIdProvided  = 'NO_ID_PROVIDED';
