import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Pet } from './pets.model';
import { Treatment } from '../treatments/treatments.model';

export const navigate = createAction(
  '[General/API] Navigate',
  props<{ route: string[] }>()
);
export const loadAllPets = createAction(
  '[Pets/API] Load All Pets'
);

export const loadManyPetsByIds = createAction(
  '[Pets/API] Load Many Pets By Ids',
  props<{ ids: string[] }>()
);

export const loadPetById = createAction(
  '[Pets/API] Load Pet By Id',
  props<{ id: string }>()
);

export const loadPetSuccess = createAction(
  '[Pets/API] Load Pet Success', 
  props<{ pet: Pet }>()
);

export const loadPetsSuccess = createAction(
  '[Pets/API] Load Pets Success', 
  props<{ pets: Pet[] }>()
);

export const loadPetsFail = createAction(
  '[Pets/API] Load Pets Fail', 
  props<{ error: any }>()
);


export const addPet = createAction(
  '[Pets/API] Add Pet',
  props<{ pet: Pet }>()
);

export const addPetSuccess = createAction(
  '[Pets/API] Add Pet Success',
  props<{ pet: Pet }>()
);

export const addPetFail = createAction(
  '[Pets/API] Add Pet Fail',
  props<{ error: any }>()
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

export const updatePetSuccess = createAction(
  '[Pets/API] Update Pet Success',
  props<{ pet: Update<Pet> }>()
);

export const updatePetFail = createAction(
  '[Pets/API] Update Pet Fail',
  props<{ error: any }>()
);

export const updatePets = createAction(
  '[Pets/API] Update Pets',
  props<{ pets: Update<Pet>[] }>()
);

export const deletePet = createAction(
  '[Pets/API] Delete Pet',
  props<{ id: string }>()
);

export const deletePetSuccess = createAction(
  '[Pets/API] Delete Pet Success',
  props<{ id: string }>()
);

export const deletePetFail = createAction(
  '[Pets/API] Delete Pet Fail',
  props<{ error: any }>()
);

export const deletePets = createAction(
  '[Pets/API] Delete Pets',
  props<{ ids: string[] }>()
);

export const deleteTreatmentsBeforeDeletePet = createAction(
  '[Pets/API] Delete Treatments before delete Pets',
  props<{ ids: string[] }>()
);

export const clearPets = createAction(
  '[Pets/API] Clear Pets'
);

export const addPropertyToArrayInPets = createAction(
  '[Pet/API] Add property to array.',
  props<{ petId: string,  propertyName: string, value: any}>()
);

export const createTreatmentForPet = createAction(
  '[Pet/API] Create Treatment For Pet.',
  props<{ treatment: Treatment }>()
);
