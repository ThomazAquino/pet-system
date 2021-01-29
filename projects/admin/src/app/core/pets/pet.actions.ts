import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Pet } from './pet.model';

export const loadPets = createAction(
  '[Pet/API] Load Pets', 
  props<{ pets: Pet[] }>()
);

export const addPet = createAction(
  '[Pet/API] Add Pet',
  props<{ pet: Pet }>()
);

export const upsertPet = createAction(
  '[Pet/API] Upsert Pet',
  props<{ pet: Pet }>()
);

export const addPets = createAction(
  '[Pet/API] Add Pets',
  props<{ pets: Pet[] }>()
);

export const upsertPets = createAction(
  '[Pet/API] Upsert Pets',
  props<{ pets: Pet[] }>()
);

export const updatePet = createAction(
  '[Pet/API] Update Pet',
  props<{ pet: Update<Pet> }>()
);

export const updatePets = createAction(
  '[Pet/API] Update Pets',
  props<{ pets: Update<Pet>[] }>()
);

export const deletePet = createAction(
  '[Pet/API] Delete Pet',
  props<{ id: string }>()
);

export const deletePets = createAction(
  '[Pet/API] Delete Pets',
  props<{ ids: string[] }>()
);

export const clearPets = createAction(
  '[Pet/API] Clear Pets'
);
