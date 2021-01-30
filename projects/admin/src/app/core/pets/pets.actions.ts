import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Pet } from './pets.model';

export const loadPets = createAction(
  '[Pets/API] Load Pets', 
  props<{ pets: Pet[] }>()
);

export const addPet = createAction(
  '[Pets/API] Add Pet',
  props<{ pet: Pet }>()
);

export const upsertPet = createAction(
  '[Pets/API] Upsert Pet',
  props<{ pet: Pet }>()
);

export const addPets = createAction(
  '[Pets/API] Add Pets',
  props<{ pets: Pet[] }>()
);

export const upsertPets = createAction(
  '[Pets/API] Upsert Pets',
  props<{ pets: Pet[] }>()
);

export const updatePet = createAction(
  '[Pets/API] Update Pet',
  props<{ pet: Update<Pet> }>()
);

export const updatePets = createAction(
  '[Pets/API] Update Pets',
  props<{ pets: Update<Pet>[] }>()
);

export const deletePet = createAction(
  '[Pets/API] Delete Pet',
  props<{ id: string }>()
);

export const deletePets = createAction(
  '[Pets/API] Delete Pets',
  props<{ ids: string[] }>()
);

export const clearPets = createAction(
  '[Pets/API] Clear Pets'
);
