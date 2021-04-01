import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Tutor } from './chat-history.model';

export const loadAllTutors = createAction(
  '[Tutors/API] Load All Tutors'
);

export const loadTutorById = createAction(
  '[Tutors/API] Load Tutor By Id',
  props<{ id: string }>()
);

export const loadManyTutorsByIds = createAction(
  '[Tutors/API] Load Tutors By Ids',
  props<{ ids: string[] }>()
);

export const loadTutorsSuccess = createAction(
  '[Tutors/API] Load Tutors Success', 
  props<{ tutors: Tutor[] }>()
);

export const loadTutorSuccess = createAction(
  '[Tutors/API] Load Tutor Success', 
  props<{ tutor: Tutor }>()
);

export const loadTutorsFail = createAction(
  '[Tutors/API] Load Tutors Fail', 
  props<{ error: any }>()
);

export const addTutor = createAction(
  '[Tutors/API] Add Tutor',
  props<{ tutor: Tutor }>()
);

export const addTutorSuccess = createAction(
  '[Tutors/API] Add Tutor Success',
  props<{ tutor: Tutor }>()
);

export const addTutorFail = createAction(
  '[Tutors/API] Add Tutor Fail ',
  props<{ error: any }>()
);

export const upsertTutor = createAction(
  '[Tutors/API] Upsert Tutor',
  props<{ tutor: Tutor }>()
);

export const addTutors = createAction(
  '[Tutors/API] Add Tutors',
  props<{ tutors: Tutor[] }>()
);

export const upsertTutors = createAction(
  '[Tutors/API] Upsert Tutors',
  props<{ tutors: Tutor[] }>()
);

export const updateTutor = createAction(
  '[Tutors/API] Update Tutor',
  props<{ tutor: Update<Tutor> }>()
);

export const updateTutorSuccess = createAction(
  '[Tutors/API] Update Tutor Success',
  props<{ tutor: Update<Tutor> }>()
);

export const updateTutorFail = createAction(
  '[Tutors/API] Update Tutor Fail',
  props<{ error: any }>()
);

export const updateTutors = createAction(
  '[Tutors/API] Update Tutors',
  props<{ tutors: Update<Tutor>[] }>()
);

export const deleteTutor = createAction(
  '[Tutors/API] Delete Tutor',
  props<{ id: string }>()
);

export const deleteTutorSuccess = createAction(
  '[Tutors/API] Delete Tutor Success',
  props<{ id: string }>()
);

export const deleteTutorFail = createAction(
  '[Tutors/API] Delete Tutor Fail',
  props<{ error: any }>()
);

export const deleteTutors = createAction(
  '[Tutors/API] Delete Tutors',
  props<{ ids: string[] }>()
);

export const clearTutors = createAction(
  '[Tutors/API] Clear Tutors'
);

export const addPropertyToArrayInTutor = createAction(
  '[Tutors/API] Add property to array.',
  props<{ tutorId: string,  propertyName: string, value: any}>()
);

export const removePropertyToArrayInTutor = createAction(
  '[Tutors/API] Remove property to array.',
  props<{ tutorId: string,  propertyName: string, value: any}>()
);
