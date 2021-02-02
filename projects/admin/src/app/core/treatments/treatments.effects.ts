import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '../core.module';


import * as treatmentsAction from './treatments.actions';
import { selectTreatments } from '../core.state';

export const TREATMENTS_KEY = 'treatments';

@Injectable()
export class TreatmentsEffects {
  persistTreatments = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          treatmentsAction.addTreatment,
          treatmentsAction.updateTreatment,
          treatmentsAction.upsertTreatment,
        ),
        withLatestFrom(this.store.pipe(select(selectTreatments))),
        tap(([action, treatments]) =>
          this.localStorageService.setItem(TREATMENTS_KEY, treatments)
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
