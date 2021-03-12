import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';


import * as treatmentsAction from './treatments.actions';
import * as petsAction from '../pets/pets.actions';
import { selectTreatmentsState } from '../core.state';
import { DataService } from '../_data/data.service';
import { NotificationService } from '../notifications/notification.service';
import { of } from 'rxjs';
import { Treatment } from './treatments.model';
import { Pet } from '../pets/pets.model';
import { Router } from '@angular/router';
import { updateTreatment, closeTreatment } from './treatments.actions';
import { Update } from '@ngrx/entity';
import { selectTreatmentById } from './treatments.selectors';

export const TREATMENTS_KEY = 'treatments';

@Injectable()
export class TreatmentsEffects {
  persistTreatments = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          treatmentsAction.loadTreatmentsSuccess,
          treatmentsAction.loadTreatmentSuccess,
          treatmentsAction.addTreatmentSuccess,
          treatmentsAction.updateTreatmentSuccess,
          treatmentsAction.deleteTreatments,
          // treatmentsAction.upsertTreatment,
          // treatmentsAction.addPropertyToArrayInTreatment,
          // treatmentsAction.updatePropertyToArrayInTreatment,
        ),
        withLatestFrom(this.store.pipe(select(selectTreatmentsState))),
        tap(([action, treatments]) =>
          this.localStorageService.setItem(TREATMENTS_KEY, treatments)
        )
      ),
    { dispatch: false }
  );

  loadAllTreatments = createEffect(() => this.actions$.pipe(
    ofType(treatmentsAction.loadAllTreatments),
    switchMap(() => this.dataService.getAllTreatments().pipe(
      map((treatments: Treatment[]) => treatmentsAction.loadTreatmentsSuccess({ treatments: treatments })),
      catchError(err => of(treatmentsAction.loadTreatmentsFail({error:  err.error.message})))
    )),
    catchError(err => of(treatmentsAction.loadTreatmentsFail({error: err.error.message})))
    ),
    { dispatch: true }
  );

  loadTreatmentById = createEffect(() => this.actions$.pipe(
    ofType(treatmentsAction.loadTreatmentById),
    switchMap((action) => this.dataService.getTreatmentById(action.id).pipe(
      map((treatment: Treatment) => treatmentsAction.loadTreatmentSuccess({ treatment: treatment })),
      catchError(err => of(treatmentsAction.loadTreatmentsFail({error:  err.error.message})))
    )),
    catchError(err => of(treatmentsAction.loadTreatmentsFail({error:  err.error.message})))
    ),
    { dispatch: true }
  );

  loadManyTreatmentsByIds = createEffect(() => this.actions$.pipe(
    ofType(treatmentsAction.loadManyTreatmentsByIds),
    switchMap((action) => { return this.dataService.getManyTreatmentsByIds(action.ids).pipe(
      map((treatments: Treatment[]) => { return treatmentsAction.loadTreatmentsSuccess({ treatments: treatments })}),
      catchError(err => { return of(treatmentsAction.loadTreatmentsFail({error:  err.error.message}))})
    )}),
    catchError(err => of(treatmentsAction.loadTreatmentsFail({error:  err.error.message})))
    ),
    { dispatch: true }
  );

  addTreatment = createEffect(() => this.actions$.pipe(
    ofType(treatmentsAction.addTreatment),
    switchMap(action =>
      this.dataService.createTreatment(action.treatment).pipe(
        switchMap((treatmentId: string) => { return [
          treatmentsAction.addTreatmentSuccess({ treatment: {...action.treatment, id: treatmentId} }),
          petsAction.addPropertyToArrayInPets({ petId: action.treatment.petId, propertyName: 'treatments', value: treatmentId})
        ]}),
        catchError(err => of(treatmentsAction.addTreatmentFail({error: err.error.message})))
      )),
    catchError(err => of(treatmentsAction.addTreatmentFail({error: err.error.message})))
      ),
    { dispatch: true }
  );

  addTreatmentSuccess = createEffect(() => this.actions$.pipe(
    ofType(treatmentsAction.addTreatmentSuccess),
    tap((action) => {
      this.router.navigate(['treatment', action.treatment.id]);
      return of({})
    })),
    { dispatch: false }
  );

  updateTreatment = createEffect(() => this.actions$.pipe(
    ofType(treatmentsAction.updateTreatment),
    switchMap(action => { return this.dataService.updateTreatment(action.treatment.id, action.treatment).pipe(
      map((treatment: any) => { return treatmentsAction.updateTreatmentSuccess(treatment)}),
      catchError(err => of(treatmentsAction.updateTreatmentFail({error: err.error.message})))
    )}),
    catchError(err => of(treatmentsAction.updateTreatmentFail({error: err.error.message})))
      ),
    { dispatch: true }
  );
  // close  closeTreatment

  closeTreatment = createEffect(() => this.actions$.pipe(
    ofType(treatmentsAction.closeTreatment),
    switchMap((action) => { return this.dataService.closeTreatment(action.id).pipe(
      withLatestFrom(this.store.pipe(select(selectTreatmentById, action.id))),
      switchMap(([_, treatment]) => { return [
        treatmentsAction.updateTreatmentSuccess({ treatment: {id: treatment.id, changes: {status: 'close'}}}),
        petsAction.updatePetSuccess({ pet: {id: treatment.petId, changes: {status: 'in-home'}} }),
        petsAction.navigate({ route: ['pet/profile', treatment.petId]})
      ]}),
      catchError(err => of(treatmentsAction.addTreatmentFail({error: err.error.message})))
    )}),
    catchError(err => of(treatmentsAction.addTreatmentFail({error: err.error.message})))
      ),
    { dispatch: true }
  );

  navigate = createEffect(() => this.actions$.pipe(
    ofType(petsAction.navigate),
    tap((action) => {
      this.router.navigate(action.route);
      return of({})
    })),
    { dispatch: false }
  );


  apiErrors = createEffect(() => this.actions$.pipe(
    ofType(
      treatmentsAction.loadTreatmentsFail,
      treatmentsAction.addTreatmentFail,
      treatmentsAction.updateTreatmentFail,
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


