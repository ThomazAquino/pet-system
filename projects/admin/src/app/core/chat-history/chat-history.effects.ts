import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { catchError, first, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';


import * as tutorsAction from './tutors.actions';
import * as petsActions from '../pets/pets.actions';


import { selectTutorsState } from '../core.state';
import { DataService } from '../_data/data.service';
import { Role, Tutor } from './chat-history.model';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';
import { loadTutorById } from './tutors.actions';
import { Update } from '@ngrx/entity';
import { selectTutorById } from './tutors.selectors';

export const TUTORS_KEY = 'tutors';

@Injectable()
export class TutorsEffects {
  persistTutors = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          tutorsAction.addTutorSuccess,
          tutorsAction.updateTutorSuccess,
          tutorsAction.upsertTutor,
          tutorsAction.loadTutorSuccess,
          tutorsAction.loadTutorsSuccess,
          tutorsAction.addPropertyToArrayInTutor,
          
        ),
        withLatestFrom(this.store.pipe(select(selectTutorsState))),
        tap(([action, tutors]) =>
          this.localStorageService.setItem(TUTORS_KEY, tutors)
        )
      ),
    { dispatch: false }
  );

  loadAllTutors = createEffect(() => this.actions$.pipe(
    ofType(tutorsAction.loadAllTutors),
    switchMap(() => this.dataService.getAllUsers().pipe(
      map((tutors: Tutor[]) => tutorsAction.loadTutorsSuccess({ tutors: tutors })),
      catchError(err => of(tutorsAction.loadTutorsFail({error:  err.error.message})))
    )),
    catchError(err => of(tutorsAction.loadTutorsFail({error:  err.error.message})))
      ),
    { dispatch: true }
  );

  loadTutorById = createEffect(() => this.actions$.pipe(
    ofType(tutorsAction.loadTutorById),
    switchMap((action) => this.dataService.getUserById(action.id).pipe(
      map((tutor: Tutor) => tutorsAction.loadTutorSuccess({ tutor: tutor })),
      catchError(err => of(tutorsAction.loadTutorsFail({error:  err.error.message})))
    )),
    catchError(err => of(tutorsAction.loadTutorsFail({error:  err.error.message})))
      ),
    { dispatch: true }
  );

  loadManyTutorsByIds = createEffect(() => this.actions$.pipe(
    ofType(tutorsAction.loadManyTutorsByIds),
    switchMap((action) => this.dataService.getManyUsersByIds(action.ids).pipe(
      map((tutors: Tutor[]) => tutorsAction.loadTutorsSuccess({ tutors: tutors })),
      catchError(err => of(tutorsAction.loadTutorsFail({error:  err.error.message})))
    )),
    catchError(err => of(tutorsAction.loadTutorsFail({error:  err.error.message})))
      ),
    { dispatch: true }
  );

  addTutor = createEffect(() => this.actions$.pipe(
    ofType(tutorsAction.addTutor),
    switchMap(action => 
      this.dataService.createUser(action.tutor).pipe(
        map((response: {userId: string, avatar: string }) => {
          const tutor = {...action.tutor, id:response.userId, avatar: response.avatar, password: null, confirmPassword: null, pets: []};
          if (!tutor.role) { tutor.role = Role.User}
          return tutorsAction.addTutorSuccess({ tutor: tutor });
        }),
        catchError(err => of(tutorsAction.addTutorFail({error: err.error.message})))
      )  
    ),
    catchError(err => of(tutorsAction.addTutorFail({error: err.error.message})))
    ),
    { dispatch: true }
  );

  addTutorSuccess = createEffect(() => this.actions$.pipe(
    ofType(tutorsAction.addTutorSuccess),
    tap((action) => {
      if (!action.tutor.role || action.tutor.role === Role.User) {
        this.notificationService.success('Tutor adicionado com sucesso.');
        this.router.navigate(['tutor/profile', action.tutor.id]);
      } else {
        this.notificationService.success('Membro adicionado com sucesso.');
        this.router.navigate(['team/profile', action.tutor.id]);
      }
      return of({})
    })),
    { dispatch: false }
  );

  updateTutor = createEffect(() => this.actions$.pipe(
    ofType(tutorsAction.updateTutor),
    switchMap(action => {  return this.dataService.updateUser(action.tutor.id, action.tutor).pipe(
      map((tutor: Update<Tutor>) => {  return tutorsAction.updateTutorSuccess({tutor: tutor })}),
      catchError(err => of(tutorsAction.updateTutorFail({error: err.error.message})))
    )}),
    catchError(err => of(tutorsAction.updateTutorFail({error: err.error.message})))
      ),
    { dispatch: true }
  );

  deleteTutor = createEffect(() => this.actions$.pipe(
    ofType(tutorsAction.deleteTutor),
    switchMap(action => this.dataService.deleteUser(action.id).pipe(
      withLatestFrom(this.store.pipe(select(selectTutorById, action.id))),
        switchMap(([_, tutor]) => {
          
          if (!tutor.role || tutor.role === Role.User) {
            this.notificationService.success('Tutor deletado com sucesso.');
            setTimeout(() => this.router.navigate(['tutor/list']), 200);
          } else {
            this.notificationService.success('Membro deletado com sucesso.');
            setTimeout(() => this.router.navigate(['team/list']), 200);
          }
          return [
            tutorsAction.deleteTutorSuccess({ id: tutor.id}),
            petsActions.deleteTreatmentsBeforeDeletePet({ids: tutor.pets}),
            petsActions.deletePets({ids: tutor.pets})
          ];
        }),
        catchError(err => of(tutorsAction.deleteTutorFail({error: err.error.message})))
      )
    ),
    catchError(err => of(tutorsAction.deleteTutorFail({error: err.error.message})))
      ),
    { dispatch: true }
  );

  apiErrors = createEffect(() => this.actions$.pipe(
    ofType(
      tutorsAction.addTutorFail,
      tutorsAction.updateTutorFail,
      tutorsAction.loadTutorsFail,
      tutorsAction.deleteTutorFail,
    ),
    tap((action) => {
      this.notificationService.error(action.error);
      return of({})
    })),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private localStorageService: LocalStorageService,
    private dataService: DataService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}
}
let scopeHandle;
