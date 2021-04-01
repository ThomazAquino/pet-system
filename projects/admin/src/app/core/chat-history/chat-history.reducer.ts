import {
  Action,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Tutor } from './chat-history.model';
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
  ids: [],
  entities: {}
});

const reduce = createReducer(
  initialState,
  on(TutorsActions.addTutorSuccess, (state, action) => {
    return tutorAdapter.addOne(action.tutor, state)
  }
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
  on(TutorsActions.updateTutorSuccess, (state, action) =>
    tutorAdapter.updateOne(action.tutor, state)  
  ),
  on(TutorsActions.updateTutors, (state, action) =>
    tutorAdapter.updateMany(action.tutors, state)
  ),
  on(TutorsActions.deleteTutorSuccess, (state, action) =>
    tutorAdapter.removeOne(action.id, state)
  ),
  on(TutorsActions.deleteTutors, (state, action) =>
    tutorAdapter.removeMany(action.ids, state)
  ),
  on(TutorsActions.loadTutorSuccess, (state, action) =>
    tutorAdapter.upsertOne(action.tutor, state)
  ),
  on(TutorsActions.loadTutorsSuccess, (state, action) =>
    tutorAdapter.upsertMany(action.tutors, state)
  ),
  on(TutorsActions.addPropertyToArrayInTutor, (state, action) => {
    const arrayValue = [...state.entities[action.tutorId][action.propertyName], action.value];
    const changes = {}
    changes[action.propertyName] = arrayValue;
    return tutorAdapter.updateOne({
      id: action.tutorId,
      changes: changes
    },
    state)
  }),
  on(TutorsActions.removePropertyToArrayInTutor, (state, action) => {
    const arrayValue = state.entities[action.tutorId][action.propertyName];
    console.log('before',arrayValue)
    const newArrayValue = arrayValue.filter(value => value !== action.value);
    console.log('after',newArrayValue)

    const changes = {}
    changes[action.propertyName] = newArrayValue;
    return tutorAdapter.updateOne({
      id: action.tutorId,
      changes: changes
    },
    state)
  }),
  // on('@ngrx/store/update-reducers' as any, (state, action) => {
  //   debugger;
  //   return state
  // }),
  on(TutorsActions.clearTutors, (state) => tutorAdapter.removeAll(state))
);

export function tutorsReducer(state: TutorsState | undefined, action: Action) {
  return reduce(state, action);
}
