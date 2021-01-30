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
import { Owner } from './owners/owners.model';
import { ownersReducer, OwnersState } from './owners/owners.reducer';
import { PetState, petReducer } from './pets/pet.reducer';
import { treatmentReducer, TreatmentState } from './treatments/treatment.reducer';

export const reducers: ActionReducerMap<AppState> = {
  owners: ownersReducer,
  pet: petReducer,
  treatment: treatmentReducer,
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

export const selectOwners = createFeatureSelector<AppState, OwnersState>(
  'owners'
);

export const selectPets = createFeatureSelector<AppState, PetState>(
  'pet'
);

export const selectTreatments = createFeatureSelector<AppState, TreatmentState>(
  'treatment'
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
  owners: OwnersState;
  pet: PetState;
  treatment: TreatmentState;
  auth: AuthState;
  settings: SettingsState;
  router: RouterReducerState<RouterStateUrl>;
}
