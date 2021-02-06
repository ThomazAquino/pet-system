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
export const selectTutorsEntities = createSelector(
  selectTutors,
  selectEntities
);

export const selectSelectedTutor = createSelector(
  selectTutorsEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);

export const selectTutorsForListComponent = createSelector(
  selectAllTutors,
  (entities) => {
    return {
      data: entities.map((tutor) => {
        return {
          id: tutor.id,
          column1: tutor.avatar,
          column2: `${tutor.name} ${tutor.lastName}`,
          column3: tutor.cellPhone,
          column4: tutor.cpf
        };
      }),
      info: {
        id: { included: false, label: '', sort: false, width: '' },
        column1: {
          included: true,
          type: 'image',
          label: '',
          sort: false,
          width: '70px'
        },
        column2: {
          included: true,
          type: 'string',
          label: 'Name',
          sort: true,
          width: ''
        },
        column3: {
          included: true,
          type: 'string',
          label: 'Cellphone',
          sort: true,
          width: ''
        },
        column4: {
          included: false,
          type: '',
          label: '',
          sort: false,
          width: '0px'
        }
      }
    };
  }
);
