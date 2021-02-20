import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Treatment } from './treatments.model';

export interface UpdateStr<T> {
  id: string;
  changes: Partial<T>;
}
export interface UpdateNum<T> {
  id: number;
  changes: Partial<T>;
}
export declare type MyUpdate<T> = UpdateStr<T> | UpdateNum<T>;



export const loadTreatments = createAction(
  '[Treatments/API] Load Treatments', 
  props<{ treatments: Treatment[] }>()
);

export const addTreatment = createAction(
  '[Treatments/API] Add Treatment',
  props<{ treatment: Treatment }>()
);

export const upsertTreatment = createAction(
  '[Treatments/API] Upsert Treatment',
  props<{ treatment: Treatment }>()
);

export const addTreatments = createAction(
  '[Treatments/API] Add Treatments',
  props<{ treatments: Treatment[] }>()
);

export const upsertTreatments = createAction(
  '[Treatments/API] Upsert Treatments',
  props<{ treatments: Treatment[] }>()
);

export const updateTreatment = createAction(
  '[Treatments/API] Update Treatment',
  props<{ treatment: Update<Treatment> }>()
);

export const addPropertyToArrayInTreatment = createAction(
  '[Treatments/API] Add property to array.',
  props<{ treatmentId: string,  propertyName: string, value: any}>()
);

export const updatePropertyToArrayInTreatment = createAction(
  '[Treatments/API] Update property in array.',
  props<{ treatmentId: string,  propertyName: string, value: any}>()
);

export const updateTreatments = createAction(
  '[Treatments/API] Update Treatments',
  props<{ treatments: Update<Treatment>[] }>()
);

export const deleteTreatment = createAction(
  '[Treatments/API] Delete Treatment',
  props<{ id: string }>()
);

export const deleteTreatments = createAction(
  '[Treatments/API] Delete Treatments',
  props<{ ids: string[] }>()
);

export const clearTreatments = createAction(
  '[Treatments/API] Clear Treatments'
);
