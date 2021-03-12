import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { catchError, first, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';


import * as petsAction from './pets.actions';
import * as tutorsAction from '../tutors/tutors.actions';
import * as treatmentsAction from '../treatments/treatments.actions';
import { selectPetsState } from '../core.state';
import { upsertTreatment, deleteTreatments } from '../treatments/treatments.actions';
import { DataService } from '../_data/data.service';
import { of } from 'rxjs';
import { Pet } from './pets.model';
import { NotificationService } from '../../core/notifications/notification.service';
import { Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { selectPetById, selectPetsByIds } from './pets.selectors';

export const PETS_KEY = 'pets';

@Injectable()
export class PetsEffects {
  persistPets = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          petsAction.loadPetsSuccess,
          petsAction.loadPetSuccess,
          petsAction.updatePetSuccess,
          petsAction.addPetSuccess,
          petsAction.deletePets,
          // petsAction.upsertPet,
          // petsAction.addPropertyToArrayInPets,
        ),
        withLatestFrom(this.store.pipe(select(selectPetsState))),
        tap(([action, pets]) =>
          this.localStorageService.setItem(PETS_KEY, pets)
        )
      ),
    { dispatch: false }
  );

  loadAllPets = createEffect(() => this.actions$.pipe(
    ofType(petsAction.loadAllPets),
    switchMap(() => this.dataService.getAllPets().pipe(
      map((pets: Pet[]) => petsAction.loadPetsSuccess({ pets: pets })),
      catchError(err => of(petsAction.loadPetsFail({error: err})))
    )),
    catchError(err => of(petsAction.loadPetsFail({error: err})))
    ),
    { dispatch: true }
  );

  loadPetById = createEffect(() => this.actions$.pipe(
    ofType(petsAction.loadPetById),
    switchMap((action) => this.dataService.getPetById(action.id).pipe(
      map((pet: Pet) => petsAction.loadPetSuccess({ pet: pet })),
      catchError(err => of(petsAction.loadPetsFail({error:  err.error.message})))
    )),
    catchError(err => of(petsAction.loadPetsFail({error:  err.error.message})))
    ),
    { dispatch: true }
  );

  loadManyPetsByIds = createEffect(() => this.actions$.pipe(
    ofType(petsAction.loadManyPetsByIds),
    switchMap((action) => this.dataService.getManyPetsByIds(action.ids).pipe(
      map((pets: Pet[]) => petsAction.loadPetsSuccess({ pets: pets })),
      catchError(err => of(petsAction.loadPetsFail({error:  err.error.message})))
    )),
    catchError(err => of(petsAction.loadPetsFail({error:  err.error.message})))
    ),
    { dispatch: true }
  );

  addPet = createEffect(() => this.actions$.pipe(
    ofType(petsAction.addPet),
    switchMap(action => this.dataService.createPet(action.pet).pipe(
      switchMap((petId: string) => { return [
        petsAction.addPetSuccess({ pet: {...action.pet, id: petId} }),
        tutorsAction.addPropertyToArrayInTutor({ tutorId: action.pet.tutorId, propertyName: 'pets', value: petId}),
      ]}),
      catchError(err => of(petsAction.addPetFail({error: err.error.message})))
    )),
    catchError(err => of(petsAction.addPetFail({error: err.error.message})))
    ),
    { dispatch: true }
  );

  updatePet = createEffect(() => this.actions$.pipe(
    ofType(petsAction.updatePet),
    switchMap(action => this.dataService.updatePet(action.pet.id, action.pet).pipe(
      map((pet: Update<Pet>) => petsAction.updatePetSuccess({ pet: pet})),
      catchError(err => of(petsAction.updatePetFail({error: err.error.message})))
    )),
    catchError(err => of(petsAction.updatePetFail({error: err.error.message})))
      ),
    { dispatch: true }
  );

  addPetSuccess = createEffect(() => this.actions$.pipe(
    ofType(petsAction.addPetSuccess),
    tap((action) => {
      this.router.navigate(['pet/profile', action.pet.id]);
      return of({})
    })),
    { dispatch: false }
  );

  deletePet = createEffect(() => this.actions$.pipe(
    ofType(petsAction.deletePet),
    switchMap((action) => this.dataService.deletePet(action.id).pipe(
      withLatestFrom(this.store.pipe(select(selectPetById, action.id))),
      switchMap(([_, pet]) => { return [
        petsAction.navigate({ route: ['tutor/profile', pet.tutorId]}),
        treatmentsAction.deleteTreatments({ids: pet.treatments}),
        petsAction.deletePetSuccess({ id: pet.id}),
        tutorsAction.removePropertyToArrayInTutor({ tutorId: pet.tutorId, propertyName: 'pets', value: pet.id}),
      ]}),
      catchError(err => of(petsAction.deletePetFail({error: err.error.message})))
    )),
    catchError(err => of(petsAction.deletePetFail({error: err.error.message})))
      ),
    { dispatch: true }
  );

  deleteTreatmentsBeforeDeletePet = createEffect(() => this.actions$.pipe(
    ofType(petsAction.deleteTreatmentsBeforeDeletePet),
    tap((action) => {
      this.store.select(selectPetsByIds, action.ids).pipe(first()).subscribe(pets => {
        pets.forEach(pet => {
          this.store.dispatch(treatmentsAction.deleteTreatments({ids: pet.treatments}));
        })
      })
    }),
  ),
    { dispatch: false }
  );

  createTreatmentFprPet = createEffect(() => this.actions$.pipe(
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

  apiErrors = createEffect(() => this.actions$.pipe(
    ofType(
      petsAction.loadPetsFail,
      petsAction.addPetFail,
    ),
    tap((action) => { this.notificationService.error(action.error); return of({})})
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private localStorageService: LocalStorageService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}
}

let scopeHandle: any;
