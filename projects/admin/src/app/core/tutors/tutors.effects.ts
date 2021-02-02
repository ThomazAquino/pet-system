import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '../core.module';


import * as tutorsAction from './tutors.actions';
import { selectTutorsState } from '../core.state';

export const TUTORS_KEY = 'tutors';

@Injectable()
export class TutorsEffects {
  persistTutors = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          tutorsAction.addTutor,
          tutorsAction.updateTutor,
          tutorsAction.upsertTutor,
        ),
        withLatestFrom(this.store.pipe(select(selectTutorsState))),
        tap(([action, tutors]) =>
          this.localStorageService.setItem(TUTORS_KEY, tutors)
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
