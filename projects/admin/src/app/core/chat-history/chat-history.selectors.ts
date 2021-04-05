import { createSelector } from '@ngrx/store';
import { selectRouterState, selectTutorsState } from '../core.state';
import { Role, Status, Tutor } from './chat-history.model';
import { tutorAdapter, TutorsState } from './chat-history.reducer';

const { selectEntities, selectAll, selectIds } = tutorAdapter.getSelectors();
export const selectAllTutors = createSelector(selectTutorsState, selectAll);
export const selectTutorsEntities = createSelector(selectTutorsState, selectEntities);
export const selectTutorsIds = createSelector(selectTutorsState, selectIds);


export const selectSelectedTutor = createSelector(
  selectTutorsEntities,
  selectRouterState,
  (tutorEntities, params) => params && tutorEntities[params.state.params.id]
);

export const selectTutorById = createSelector(
  selectTutorsEntities,
  (entities, props: string) => entities[props]
);

export const selectTutorsForListComponent = createSelector(
  selectAllTutors,
  (tutors, params?: Role) => {
    const filteredTutors = params ? tutors.filter((tutor) => tutor.role === params) : tutors;
    return {
      data: filteredTutors.map((tutor) => {
        return {id: tutor.id,
          column1: tutor.avatar,
          column2: `${tutor.firstName} ${tutor.lastName}`,
          column3: tutor.cellphone,
          column4: tutor.cpf
        };
      }),
      info: {
        id: { included: false, label: '', sort: false, width: '' },
        column1: {included: true,type: 'image',label: '',sort: false,width: '70px' },
        column2: {included: true,type: 'string',label: 'Name',sort: true,width: '' },
        column3: {included: true,type: 'string',label: 'Cellphone',sort: true,width: '' },
        column4: {included: false,type: '',label: '',sort: false,width: '0px' }
      }
    };
  }
);

export const selectFilteredUsersForListComponent = createSelector(
  selectAllTutors,
  (tutors, params?: Role) => {

    const filteredTutors = params ? tutors.filter((tutor) => tutor.role === params) : 
                                    tutors.filter((tutor) => tutor.role !== Role.User);
    return {
      data: filteredTutors.map((tutor: Tutor) => {
        return {
          id: tutor.id,
          column1: tutor.avatar,
          column2: `${tutor.firstName} ${tutor.lastName}`,
          column3: tutor.role,
          column4: tutor.cellphone,
          column5: tutor.status || Status.offline,
          column6: tutor.cpf
        };
      }),
      info: {
        id: { included: false, label: '', sort: false, width: '' },
        column1: {included: true,type: 'image',label: '',sort: false,width: '70px'},
        column2: {included: true,type: 'string',label: 'Name',sort: true,width: ''},
        column3: {included: true,type: 'string',label: 'Função', sort: true,width: ''},
        column4: {included: true,type: 'string',label: 'Cellphone',sort: true,width: ''},
        column5: {included: true,type: 'string',label: 'Status',sort: true, width: ''},
        column6: {included: false,type: '',label: '',sort: false,width: '0px'}
      }
    };
  }
);

export const selectTutorsByRole = createSelector(
  selectAllTutors,
  (tutors, params: Role) => {
    return  tutors.filter((tutor) => tutor.role === params);

  }
);


// export const selectTutorsEntities = createSelector(
//   selectTutorsState,
//   selectEntities
// );