import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Tutor } from './tutors.model';

export const loadTutors = createAction(
  '[Tutors/API] Load Tutors', 
  props<{ tutors: Tutor[] }>()
);

export const addTutor = createAction(
  '[Tutors/API] Add Tutor',
  props<{ tutor: Tutor }>()
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

export const updateTutors = createAction(
  '[Tutors/API] Update Tutors',
  props<{ tutors: Update<Tutor>[] }>()
);

export const deleteTutor = createAction(
  '[Tutors/API] Delete Tutor',
  props<{ id: string }>()
);

export const deleteTutors = createAction(
  '[Tutors/API] Delete Tutors',
  props<{ ids: string[] }>()
);

export const clearTutors = createAction(
  '[Tutors/API] Clear Tutors'
);
