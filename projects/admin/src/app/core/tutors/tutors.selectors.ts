import { createSelector } from '@ngrx/store';

import { selectRouterState } from '../core.module';
import { selectTutorsState } from '../core.state';

import { tutorAdapter, TutorsState } from './tutors.reducer';

const { selectEntities, selectAll } = tutorAdapter.getSelectors();


export const selectTutors = createSelector(
  selectTutorsState,
  (state: TutorsState) => state
);

export const selectAllTutors = createSelector(selectTutors, selectAll);
export const selectTutorsEntities = createSelector(selectTutors, selectEntities);

export const selectSelectedTutor = createSelector(
  selectTutorsEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);