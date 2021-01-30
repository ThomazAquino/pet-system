import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as PetsActions from './pets.actions';
import { AppState } from '../core.state';
import { Pet } from './pets.model';

export const petsFeatureKey = 'pets';

export interface PetsState extends EntityState<Pet> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Pet> = createEntityAdapter<Pet>();

export const initialState: PetsState = adapter.getInitialState({
  // additional entity state properties
  ids: ['id-pet-1', 'id-pet-2', 'id-pet-3'],
  entities: {
    'id-pet-1' : {
      id: 'id-pet-1',
      photo: '',
      name: 'Lecy',
      type: 'dog',
      breed: 'Buldog',
      color: 'yellow',
      status: 'interned',
      ownerId: 'id-person-1',
      treatments: ['id-treatment-1', 'id-treatment-2'],
      qrCode: ''
    },
    'id-pet-2' : {
      id: 'id-pet-2',
      photo: '',
      name: 'boby',
      type: 'dog',
      breed: 'poodle',
      color: 'white',
      status: 'in-home',
      ownerId: 'id-person-1',
      treatments: ['id-treatment-3', 'id-treatment-4'],
      qrCode: ''
    },
    'id-pet-3' : {
      id: 'id-pet-3',
      photo: '',
      name: 'Rufus',
      type: 'cat',
      breed: 'Angora',
      color: 'black',
      status: 'in-home',
      ownerId: 'id-person-2',
      treatments: ['id-treatment-5'],
      qrCode: ''
    },
  }
});

const reduce = createReducer(
  initialState,
  on(PetsActions.addPet,
    (state, action) => adapter.addOne(action.pet, state)
  ),
  on(PetsActions.upsertPet,
    (state, action) => adapter.upsertOne(action.pet, state)
  ),
  on(PetsActions.addPets,
    (state, action) => adapter.addMany(action.pets, state)
  ),
  on(PetsActions.upsertPets,
    (state, action) => adapter.upsertMany(action.pets, state)
  ),
  on(PetsActions.updatePet,
    (state, action) => adapter.updateOne(action.pet, state)
  ),
  on(PetsActions.updatePets,
    (state, action) => adapter.updateMany(action.pets, state)
  ),
  on(PetsActions.deletePet,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(PetsActions.deletePets,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(PetsActions.loadPets,
    (state, action) => adapter.addAll(action.pets, state)
  ),
  on(PetsActions.clearPets,
    state => adapter.removeAll(state)
  ),
);

export function petsReducer(state: PetsState | undefined, action: Action) {
  return reduce(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
} = adapter.getSelectors((state: AppState) => state.pets);

// select the array of pets
export const selectAllPets = selectAll;

// select the array of pets ids
export const selectPetsIds = selectIds;

// select the dictionary of pets entities
export const selectPetEntities = selectEntities;

export const selectPet = createSelector(
  selectEntities,
  (entities, props: string) => entities[props]
);


