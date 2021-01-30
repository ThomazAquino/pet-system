import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '../core.module';


import * as ownersAction from './owners.actions';
import { selectOwners } from '../core.state';

export const OWNER_KEY = 'owners';

@Injectable()
export class OwnersEffects {
  persistOwners = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ownersAction.addOwner,
          ownersAction.updateOwner,
          ownersAction.upsertOwner,
        ),
        withLatestFrom(this.store.pipe(select(selectOwners))),
        tap(([action, owners]) =>
          this.localStorageService.setItem(OWNER_KEY, owners)
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
