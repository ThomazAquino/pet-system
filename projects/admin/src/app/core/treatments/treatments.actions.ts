import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Treatment } from './treatments.model';



export interface GeneralUpdate<T> {
  id: string;
  changes: Partial<T>;
  operation?: string;
  isNested?: boolean;
}

export const loadAllTreatments = createAction(
  '[Treatments/API] Load All Treatments'
);

export const loadManyTreatmentsByIds = createAction(
  '[Treatments/API] Load Many Treatments By Ids',
  props<{ ids: string[] }>()
);

export const loadTreatmentById = createAction(
  '[Treatments/API] Load Treatment By Id',
  props<{ id: string }>()
);

export const loadTreatmentSuccess = createAction(
  '[Treatments/API] Load Single Treatment Success', 
  props<{ treatment: Treatment }>()
);

export const loadTreatmentsSuccess = createAction(
  '[Treatments/API] Load Treatments Success', 
  props<{ treatments: Treatment[] }>()
);

export const loadTreatmentsFail = createAction(
  '[Treatments/API] Load Treatments Fail', 
  props<{ error: any }>()
);

export const addTreatment = createAction(
  '[Treatments/API] Add Treatment',
  props<{ treatment: Treatment }>()
);

export const addTreatmentSuccess = createAction(
  '[Treatments/API] Add Treatment Success',
  props<{ treatment: Treatment }>()
);

export const addTreatmentFail = createAction(
  '[Treatments/API] Add Treatment Fail',
  props<{ error: any }>()
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
  props<{ treatment: GeneralUpdate<Treatment> }>()
);

export const updateTreatmentSuccess = createAction(
  '[Treatments/API] Update Treatment Success',
  props<{ treatment: Update<Treatment> | any }>()
);

export const updateTreatmentFail = createAction(
  '[Treatments/API] Update Treatment Fail',
  props<{ error: any }>()
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

export const closeTreatment = createAction(
  '[Treatments/API] Close Treatment',
  props<{ id: string }>()
);

export const closeTreatmentSuccess = createAction(
  '[Treatments/API] Close Treatment Success',
  props<{ id: string }>()
);

export const closeTreatmentFail = createAction(
  '[Treatments/API] Close Treatment Fail',
  props<{ error: any }>()
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

