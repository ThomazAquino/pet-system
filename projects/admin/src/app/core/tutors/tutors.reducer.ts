import {
  Action,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Tutor } from './tutors.model';
import * as TutorsActions from './tutors.actions';
import { AppState } from '../core.state';
import { selectRouterState } from '../core.module';

export const tutorsFeatureKey = 'tutors';

export interface TutorsState extends EntityState<Tutor> {
  // additional entities state properties
}

export const tutorAdapter: EntityAdapter<Tutor> = createEntityAdapter<Tutor>();

export const initialState: TutorsState = tutorAdapter.getInitialState({
  // additional entity state properties
  ids: ['id-person-1', 'id-person-2'],
  entities: {
    'id-person-1': {
      id: 'id-person-1',
      name: 'João',
      lastName: 'Silva',
      image: '',
      cellPhone: '99129912',
      tel: '32323333',
      street: 'name of street',
      streetNumber: '1212',
      postalCode: '0000000',
      birthday: '21/12/1992',
      cpf: '001.000.000-00',
      pets: ['id-pet-1', 'id-pet-2']
    },
    'id-person-2': {
      id: 'id-person-2',
      name: 'Mariah',
      lastName: 'Tereza',
      image: '',
      cellPhone: '99129912',
      tel: '32323333',
      street: 'name of street',
      streetNumber: '1212',
      postalCode: '0000000',
      birthday: '21/12/1992',
      cpf: '002.000.000-00',
      pets: ['id-pet-3']
    }
  }
});

const reduce = createReducer(
  initialState,
  on(TutorsActions.addTutor, (state, action) =>
    tutorAdapter.addOne(action.tutor, state)
  ),
  on(TutorsActions.upsertTutor, (state, action) =>
    tutorAdapter.upsertOne(action.tutor, state)
  ),
  on(TutorsActions.addTutors, (state, action) =>
    tutorAdapter.addMany(action.tutors, state)
  ),
  on(TutorsActions.upsertTutors, (state, action) =>
    tutorAdapter.upsertMany(action.tutors, state)
  ),
  on(TutorsActions.updateTutor, (state, action) =>
    tutorAdapter.updateOne(action.tutor, state)
  ),
  on(TutorsActions.updateTutors, (state, action) =>
    tutorAdapter.updateMany(action.tutors, state)
  ),
  on(TutorsActions.deleteTutor, (state, action) =>
    tutorAdapter.removeOne(action.id, state)
  ),
  on(TutorsActions.deleteTutors, (state, action) =>
    tutorAdapter.removeMany(action.ids, state)
  ),
  on(TutorsActions.loadTutors, (state, action) =>
    tutorAdapter.addAll(action.tutors, state)
  ),
  on(TutorsActions.clearTutors, (state) => tutorAdapter.removeAll(state))
);

export function tutorsReducer(state: TutorsState | undefined, action: Action) {
  return reduce(state, action);
}

export const {
  selectIds,
  selectEntities: tutorEntities,
  selectAll: alltutors
} = tutorAdapter.getSelectors((state: AppState) => state.tutors);

// select the array of tutors
export const selectAllTutors = alltutors;

// select the array of widget ids
export const selectTutorsIds = selectIds;

// select the dictionary of widget entities
export const selectTutorsEntities = tutorEntities;

export const selectTutorsById = createSelector(
  selectTutorsEntities,
  (entities, props: string) => entities[props]
);
