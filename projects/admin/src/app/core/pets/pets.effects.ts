import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { map, tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';


import * as petsAction from './pets.actions';
import { selectPetsState } from '../core.state';
import { upsertTreatment } from '../treatments/treatments.actions';

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
          petsAction.addPropertyToArrayInPets,
        ),
        withLatestFrom(this.store.pipe(select(selectPetsState))),
        tap(([action, pets]) =>
          this.localStorageService.setItem(PETS_KEY, pets)
        )
      ),
    { dispatch: false }
  );
  createTreatmentFprPet = createEffect(
    () =>
      this.actions$.pipe(
        ofType(petsAction.createTreatmentForPet),
        map(action => action.treatment),
        withLatestFrom(this.store.pipe(select(selectPetsState))),
        tap(([treatment, pets]) => {
          // Add Treatment to store
          this.store.dispatch(upsertTreatment({treatment}));

          // Add Treatment id to treatments array in pet 
          this.store.dispatch(petsAction.addPropertyToArrayInPets(
            { petId: treatment.petId,  propertyName: 'treatments', value: treatment.id}
          ));

          // Change status of pet
          this.store.dispatch(petsAction.updatePet(
            {pet: {
              id: treatment.petId,
              changes: {status: 'interned'}
            }}
          ))
          return 
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private localStorageService: LocalStorageService
  ) {}
}
