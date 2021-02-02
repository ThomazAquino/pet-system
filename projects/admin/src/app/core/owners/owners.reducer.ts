import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Owner } from './owners.model';
import * as OwnersActions from './owners.actions';
import { AppState } from '../core.state';

export const ownersFeatureKey = 'owners';

export interface OwnersState extends EntityState<Owner> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Owner> = createEntityAdapter<Owner>();

export const initialState: OwnersState = adapter.getInitialState({
  // additional entity state properties
  ids: ['id-person-1', 'id-person-2'],
  entities: {
    'id-person-1' : {
      id: 'id-person-1',
      name: 'João',
      lastName: 'Silva',
      cellPhone: '99129912',
      tel: '32323333',
      street: 'name of street',
      streetNumber: '1212',
      postalCode: '0000000',
      birthday: '21/12/1992',
      cpf: '001.000.000-00',
      pets: ['id-pet-1', 'id-pet-2'],
    },
    'id-person-2' : {
      id: 'id-person-2',
      name: 'Mariah',
      lastName: 'Tereza',
      cellPhone: '99129912',
      tel: '32323333',
      street: 'name of street',
      streetNumber: '1212',
      postalCode: '0000000',
      birthday: '21/12/1992',
      cpf: '002.000.000-00',
      pets: ['id-pet-3'],
    }
  }
});

const reduce = createReducer(
  initialState,
  on(OwnersActions.addOwner,
    (state, action) => adapter.addOne(action.owner, state)
  ),
  on(OwnersActions.upsertOwner,
    (state, action) => adapter.upsertOne(action.owner, state)
  ),
  on(OwnersActions.addOwners,
    (state, action) => adapter.addMany(action.owners, state)
  ),
  on(OwnersActions.upsertOwners,
    (state, action) => adapter.upsertMany(action.owners, state)
  ),
  on(OwnersActions.updateOwner,
    (state, action) => adapter.updateOne(action.owner, state)
  ),
  on(OwnersActions.updateOwners,
    (state, action) => adapter.updateMany(action.owners, state)
  ),
  on(OwnersActions.deleteOwner,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(OwnersActions.deleteOwners,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(OwnersActions.loadOwners,
    (state, action) => adapter.addAll(action.owners, state)
  ),
  on(OwnersActions.clearOwners,
    state => adapter.removeAll(state)
  ),
);

export function ownersReducer(state: OwnersState | undefined, action: Action) {
  return reduce(state, action);
}

export const {
  selectIds,
  selectEntities: ownerEntities,
  selectAll: allOwners,
} = adapter.getSelectors((state: AppState) => state.owners);

// select the array of owners
export const selectAllOwners = allOwners;

// select the array of widget ids
export const selectOwnersIds = selectIds;

// select the dictionary of widget entities
export const selectOwnerEntities = ownerEntities;

export const selectOwnerById = createSelector(
  selectOwnerEntities,
  (entities, props: string) => entities[props]
);


