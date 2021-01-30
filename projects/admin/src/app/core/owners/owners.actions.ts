import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Owner } from './owners.model';

export const loadOwners = createAction(
  '[Owners/API] Load Owners', 
  props<{ owners: Owner[] }>()
);

export const addOwner = createAction(
  '[Owners/API] Add Owner',
  props<{ owner: Owner }>()
);

export const upsertOwner = createAction(
  '[Owners/API] Upsert Owner',
  props<{ owner: Owner }>()
);

export const addOwners = createAction(
  '[Owners/API] Add Owners',
  props<{ owners: Owner[] }>()
);

export const upsertOwners = createAction(
  '[Owners/API] Upsert Owners',
  props<{ owners: Owner[] }>()
);

export const updateOwner = createAction(
  '[Owners/API] Update Owner',
  props<{ owner: Update<Owner> }>()
);

export const updateOwners = createAction(
  '[Owners/API] Update Owners',
  props<{ owners: Update<Owner>[] }>()
);

export const deleteOwner = createAction(
  '[Owners/API] Delete Owner',
  props<{ id: string }>()
);

export const deleteOwners = createAction(
  '[Owners/API] Delete Owners',
  props<{ ids: string[] }>()
);

export const clearOwners = createAction(
  '[Owners/API] Clear Owners'
);
