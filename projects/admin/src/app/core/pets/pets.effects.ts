import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '../core.module';


import * as petsAction from './pets.actions';
import { selectPetsState } from '../core.state';

export const PETS_KEY = 'pets';

@Injectable()
export class PetsEffects {
  persistPets = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          petsAction.addPet,
          petsAction.updatePet,
          petsAction.upsertPet,
        ),
        withLatestFrom(this.store.pipe(select(selectPetsState))),
        tap(([action, pets]) =>
          this.localStorageService.setItem(PETS_KEY, pets)
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private localStorageService: LocalStorageService
  ) {}
}
