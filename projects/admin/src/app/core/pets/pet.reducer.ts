import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as PetActions from './pet.actions';
import { AppState } from '../core.state';
import { Pet } from './pet.model';

export const petsFeatureKey = 'pets';

export interface PetState extends EntityState<Pet> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Pet> = createEntityAdapter<Pet>();

export const initialState: PetState = adapter.getInitialState({
  // additional entity state properties
  ids: ['id-pet-1', 'id-pet-2', 'id-pet-3'],
  entities: {
    'id-pet-1' : {
      id: 'id-pet-1',
      name: 'Lecy',
      type: 'dog',
      breed: 'Buldog',
      color: 'yellow',
      status: 'interned',
      ownerId: 'id-person-1',
      treatments: ['id-treatment-1', 'id-treatment-2']
    },
    'id-pet-2' : {
      id: 'id-pet-2',
      name: 'boby',
      type: 'dog',
      breed: 'poodle',
      color: 'white',
      status: 'in-home',
      ownerId: 'id-person-1',
      treatments: ['id-treatment-3', 'id-treatment-4']
    },
    'id-pet-3' : {
      id: 'id-pet-3',
      name: 'Rufus',
      type: 'cat',
      breed: 'Angora',
      color: 'black',
      status: 'in-home',
      ownerId: 'id-person-2',
      treatments: ['id-treatment-5']
    },
  }
});

const reduce = createReducer(
  initialState,
  on(PetActions.addPet,
    (state, action) => adapter.addOne(action.pet, state)
  ),
  on(PetActions.upsertPet,
    (state, action) => adapter.upsertOne(action.pet, state)
  ),
  on(PetActions.addPets,
    (state, action) => adapter.addMany(action.pets, state)
  ),
  on(PetActions.upsertPets,
    (state, action) => adapter.upsertMany(action.pets, state)
  ),
  on(PetActions.updatePet,
    (state, action) => adapter.updateOne(action.pet, state)
  ),
  on(PetActions.updatePets,
    (state, action) => adapter.updateMany(action.pets, state)
  ),
  on(PetActions.deletePet,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(PetActions.deletePets,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(PetActions.loadPets,
    (state, action) => adapter.addAll(action.pets, state)
  ),
  on(PetActions.clearPets,
    state => adapter.removeAll(state)
  ),
);

export function petReducer(state: PetState | undefined, action: Action) {
  return reduce(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
} = adapter.getSelectors((state: AppState) => state.pet);

// select the array of pets
export const selectAllPets = selectAll;

// select the array of pets ids
export const selectPetsIds = selectIds;

// select the dictionary of pets entities
export const selectPetEntities = selectEntities;


