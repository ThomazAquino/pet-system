import { createSelector } from '@ngrx/store';
import { selectRouterState } from '../core.state';
import { selectPetsState, AppState, NO_ID_PROVIDED } from '../core.state';
import { petAdapter, PetsState, selectAllPets, selectPetsEntities } from './pets.reducer';


export const selectSelectedPet = createSelector(
  selectPetsEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);

export const selectPetById = createSelector(
  selectPetsEntities,
  (entities, props: string) => entities[props]
);

export const selectPetsByIds = createSelector(
  selectPetsEntities,
  (entities, props: string[]) => props.map((id) => entities[id])
);

export const selectAllPetsForListComponent = createSelector(
  selectAllPets,
  (pets) => {
    return {
      data: pets.map((pet) => {
        return {
          id: pet.id,
          column1: pet.avatar,
          column2: pet.name,
          column3: `${pet.type} ${pet.breed} ${pet.color}`,
          column4: pet.status
        };
      }),
      info: {
        id: {
          included: false,
          label: '',
          sort: false,
          width: ''
        },
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
          label: 'Informações',
          sort: true,
          width: ''
        },
        column4: {
          included: true,
          type: 'string',
          label: 'Status',
          sort: true,
          width: ''
        }
      }
    };
  }
);

export const selectPetsByIdsForListComponent = createSelector(
  selectPetsEntities,
  (entities, props: string[]) => {
    const petsNotFound = props.filter(id => !entities[id]);
    if (petsNotFound) { petsNotFound.forEach(t => console.error(`Pet "${t}" not found in store.`)) }

    return {
      data: props.filter(id => entities[id]).map((id) => {
        return {
          id: entities[id].id,
          column1: entities[id].avatar,
          column2: entities[id].name,
          column3: `${entities[id].type} ${entities[id].breed} ${entities[id].color}`,
          column4: entities[id].status
        };
      }),
      info: {
        id: {
          included: false,
          label: '',
          sort: false,
          width: ''
        },
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
          label: 'Informações',
          sort: true,
          width: ''
        },
        column4: {
          included: true,
          type: 'string',
          label: 'Status',
          sort: true,
          width: ''
        }
      }
    };
  }
);
