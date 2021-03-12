import { createSelector } from '@ngrx/store';
import { ListComponent, ListComponentDataItem, ListListComponentItemInfo } from '../../shared/list/list.component';
import { selectRouterState } from '../core.state';
import { selectPetsEntities } from '../pets/pets.reducer';
import { selectAllTreatments, selectTreatmentsEntities } from './treatments.reducer';

export const selectSelectedTreatment = createSelector(
  selectTreatmentsEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);

export const selectTreatmentById = createSelector(
  selectTreatmentsEntities,
  (entities, props: string) => entities[props]
);


export const selectOpenTreatments = createSelector(
  selectAllTreatments,
  (treatments) => treatments.filter((treatment) => treatment.status === 'open')
);

// export const selectOpenTreatmentsForHomeTable = createSelector(
//   selectOpenTreatments,
//   selectPetsEntities,
//   (treatments, pets) =>
//     treatments.map((treatment) => {
//       return {
//         photo: pets[treatment.petId].avatar,
//         name: pets[treatment.petId].name,
//         enterDate: treatment.enterDate,
//         belongsToVet: treatment.belongsToVet,
//         clinicEvoResume: treatment.clinicEvoResume,
//         qrCode: pets[treatment.petId].qrCode
//       };
//     })
// );

export const selectTreatmentsByIdsForListComponent = createSelector(
  selectTreatmentsEntities,
  (entities, props: string[]) => {
    const treatmentsNotFound = props.filter(id => !entities[id]);
    if (treatmentsNotFound) { treatmentsNotFound.forEach(t => console.error(`Treatment: "${t}" not found in store.`)) }

    return {
      data: props.filter(id => entities[id]).map((id) => {
        return {
          id: entities[id].id,
          column1: './assets/images/treatment-placeholder.png',
          column2: entities[id].enterDate,
          column3: entities[id].conclusiveReportShort,
          column4: entities[id].status
        };
      }),
      info: {
        id:      { included: false, type: 'string', label: '', sort: false, width: ''},
        column1: { included: true, type: 'image', label: '', sort: false, width: '70px'},
        column2: { included: true, type: 'date', label: 'Enter Date', sort: false, width: '190px'},
        column3: { included: true, type: 'string', label: 'Laúdo', sort: true, width: ''},
        column4: { included: true, type: 'string', label: 'Status', sort: true, width: '70px'}
      }
    };
  }
);

export const selectOpenTreatmentsForListComponent = createSelector(
  selectAllTreatments,
  selectPetsEntities,
  (treatments, pets) => {
    return {
      data: treatments.filter((treatment) => treatment.status === 'open').map((treatment) => {
          return {
            id: treatment.id,
            column1: pets[treatment.petId].avatar,
            column2: pets[treatment.petId].name,
            column3: treatment.enterDate,
            column4: treatment.vetName,
            column5: treatment.clinicEvoResume,
            column6: treatment.status,
            column7: pets[treatment.petId].qrCode
          } as ListComponentDataItem;
        }
      ),
      info: {
        id: { included: false, label: '', sort: false, width: '' } as ListListComponentItemInfo,
        column1: { included: true, type: 'image', label: '', sort: false, width: '70px' } as ListListComponentItemInfo,
        column2: { included: true, type: 'string', label: 'Name', sort: true, width: '' } as ListListComponentItemInfo,
        column3: { included: true, type: 'date', label: 'Enter date', sort: true, width: '' } as ListListComponentItemInfo,
        column4: { included: true, type: 'string', label: 'Veterinário', sort: true, width: '' } as ListListComponentItemInfo,
        column5: { included: true, type: 'string', label: 'Evo.', sort: true, width: '' } as ListListComponentItemInfo,
        column6: { included: true, type: 'string', label: 'Status', sort: true, width: '' } as ListListComponentItemInfo,
        column7: { included: true, type: 'string', label: 'Qr Code', sort: true, width: '' } as ListListComponentItemInfo,
      }
    }
  }

);

export const selectAllTreatmentsForListComponent = createSelector(
  selectAllTreatments,
  selectPetsEntities,
  (treatments, pets) => {
    return {
      data: treatments.map((treatment) => {
        return {
          id: treatment.id,
          column1: pets[treatment.petId]?.avatar,
          column2: pets[treatment.petId]?.name,
          column3: treatment.enterDate,
          column4: treatment.vetName,
          column5: treatment.clinicEvoResume,
          column6: treatment.status,
          column7: pets[treatment.petId]?.qrCode
        } as ListComponentDataItem;
      }),
      info: {
        id: { included: false, label: '', sort: false, width: '' } as ListListComponentItemInfo,
        column1: { included: true, type: 'image', label: '', sort: false, width: '70px' } as ListListComponentItemInfo,
        column2: { included: true, type: 'string', label: 'Name', sort: true, width: '' } as ListListComponentItemInfo,
        column3: { included: true, type: 'date', label: 'Enter date', sort: true, width: '' } as ListListComponentItemInfo,
        column4: { included: true, type: 'string', label: 'Veterinário', sort: true, width: '' } as ListListComponentItemInfo,
        column5: { included: true, type: 'string', label: 'Evo.', sort: true, width: '' } as ListListComponentItemInfo,
        column6: { included: true, type: 'string', label: 'Status', sort: true, width: '' } as ListListComponentItemInfo,
        column7: { included: true, type: 'string', label: 'Qr Code', sort: true, width: '' } as ListListComponentItemInfo,
      }
    }
  }
);