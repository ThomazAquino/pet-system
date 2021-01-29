import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Owner } from './owner.model';

export const loadOwners = createAction(
  '[Owner/API] Load Owners', 
  props<{ owners: Owner[] }>()
);

export const addOwner = createAction(
  '[Owner/API] Add Owner',
  props<{ owner: Owner }>()
);

export const upsertOwner = createAction(
  '[Owner/API] Upsert Owner',
  props<{ owner: Owner }>()
);

export const addOwners = createAction(
  '[Owner/API] Add Owners',
  props<{ owners: Owner[] }>()
);

export const upsertOwners = createAction(
  '[Owner/API] Upsert Owners',
  props<{ owners: Owner[] }>()
);

export const updateOwner = createAction(
  '[Owner/API] Update Owner',
  props<{ owner: Update<Owner> }>()
);

export const updateOwners = createAction(
  '[Owner/API] Update Owners',
  props<{ owners: Update<Owner>[] }>()
);

export const deleteOwner = createAction(
  '[Owner/API] Delete Owner',
  props<{ id: string }>()
);

export const deleteOwners = createAction(
  '[Owner/API] Delete Owners',
  props<{ ids: string[] }>()
);

export const clearOwners = createAction(
  '[Owner/API] Clear Owners'
);
