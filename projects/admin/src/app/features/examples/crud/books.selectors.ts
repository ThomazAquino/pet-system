import { createSelector } from '@ngrx/store';

import { selectRouterState } from '../../../core/core.module';
import { selectTutorsEntities } from '../../../core/tutors/tutors.reducer';
import { selectExamples, ExamplesState } from '../examples.state';

import { bookAdapter } from './books.reducer';

const { selectEntities, selectAll } = bookAdapter.getSelectors();

export const selectBooks = createSelector(
  selectExamples,
  (state: ExamplesState) => state.books
);

export const selectAllBooks = createSelector(selectBooks, selectAll);
export const selectBooksEntities = createSelector(selectBooks, selectEntities);

export const selectSelectedBook = createSelector(
  selectBooksEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);

export const selectSelectedTutorTEST = createSelector(
  selectTutorsEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);