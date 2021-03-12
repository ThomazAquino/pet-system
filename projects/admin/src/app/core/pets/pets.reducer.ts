import {
  Action,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as PetsActions from './pets.actions';
import { AppState, selectPetsState } from '../core.state';
import { Pet } from './pets.model';
import { addPropertyToArrayInPets } from './pets.actions';

export const petsFeatureKey = 'pets';

export interface PetsState extends EntityState<Pet> {
  // additional entities state properties
}

export const petAdapter: EntityAdapter<Pet> = createEntityAdapter<Pet>();

export const initialState: PetsState = petAdapter.getInitialState({
  // additional entity state properties
  ids: [],
  entities: {}
});

const reduce = createReducer(
  initialState,
  on(PetsActions.addPetSuccess, (state, action) => {
    return petAdapter.addOne(action.pet, state)
  } 
    
  ),
  on(PetsActions.upsertPet, (state, action) =>
    petAdapter.upsertOne(action.pet, state)
  ),
  on(PetsActions.addPets, (state, action) =>
    petAdapter.addMany(action.pets, state)
  ),
  on(PetsActions.upsertPets, (state, action) =>
    petAdapter.upsertMany(action.pets, state)
  ),
  on(PetsActions.updatePetSuccess, (state, action) => {
    // debugger;
    return petAdapter.updateOne(action.pet, state)
  }),
  on(PetsActions.updatePets, (state, action) =>
    petAdapter.updateMany(action.pets, state)
  ),
  on(PetsActions.deletePetSuccess, (state, action) =>
    petAdapter.removeOne(action.id, state)
  ),
  on(PetsActions.deletePets, (state, action) => {
    // debugger; 
    return petAdapter.removeMany(action.ids, state)

    }
  ),
  on(PetsActions.loadPetSuccess, (state, action) =>
    petAdapter.upsertOne(action.pet, state)
  ),
  on(PetsActions.loadPetsSuccess, (state, action) =>
    petAdapter.upsertMany(action.pets, state)
  ),
  on(PetsActions.addPropertyToArrayInPets, (state, action) => {
    const arrayValue = [...state.entities[action.petId][action.propertyName], action.value];
    const changes = {}
    changes[action.propertyName] = arrayValue;
    return petAdapter.updateOne({
      id: action.petId,
      changes: changes
    },
    state)
  }),

  on(PetsActions.clearPets, (state) => petAdapter.removeAll(state))
);

export function petsReducer(state: PetsState | undefined, action: Action) {
  return reduce(state, action);
}

export const { selectIds, selectEntities, selectAll } = 
  petAdapter.getSelectors((state: AppState) => state.pets);

export const selectAllPets = selectAll;
export const selectPetsEntities = selectEntities;
export const selectPetsIds = selectIds;


// const { selectEntities, selectAll, selectIds } = petAdapter.getSelectors();
// export const selectAllPets = createSelector(selectPetsState, selectAll);
// export const selectPetsEntities = createSelector(selectPetsState, selectEntities);
// export const selectPetsIds = createSelector(selectPetsState, selectIds);

