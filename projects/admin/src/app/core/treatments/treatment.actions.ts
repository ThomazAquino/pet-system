import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Treatment } from './treatment.model';

export const loadTreatments = createAction(
  '[Treatment/API] Load Treatments', 
  props<{ treatments: Treatment[] }>()
);

export const addTreatment = createAction(
  '[Treatment/API] Add Treatment',
  props<{ treatment: Treatment }>()
);

export const upsertTreatment = createAction(
  '[Treatment/API] Upsert Treatment',
  props<{ treatment: Treatment }>()
);

export const addTreatments = createAction(
  '[Treatment/API] Add Treatments',
  props<{ treatments: Treatment[] }>()
);

export const upsertTreatments = createAction(
  '[Treatment/API] Upsert Treatments',
  props<{ treatments: Treatment[] }>()
);

export const updateTreatment = createAction(
  '[Treatment/API] Update Treatment',
  props<{ treatment: Update<Treatment> }>()
);

export const updateTreatments = createAction(
  '[Treatment/API] Update Treatments',
  props<{ treatments: Update<Treatment>[] }>()
);

export const deleteTreatment = createAction(
  '[Treatment/API] Delete Treatment',
  props<{ id: string }>()
);

export const deleteTreatments = createAction(
  '[Treatment/API] Delete Treatments',
  props<{ ids: string[] }>()
);

export const clearTreatments = createAction(
  '[Treatment/API] Clear Treatments'
);
