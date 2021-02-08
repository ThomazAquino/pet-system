import { createSelector } from '@ngrx/store';
import { selectPetsEntities } from '../pets/pets.reducer';
import { selectAllTreatments, selectTreatmentsEntities } from './treatments.reducer';

export const selectOpenTreatments = createSelector(
  selectAllTreatments,
  (treatments) => treatments.filter((treatment) => treatment.status === 'open')
);

export const selectOpenTreatmentsForHomeTable = createSelector(
  selectOpenTreatments,
  selectPetsEntities,
  (treatments, pets) =>
    treatments.map((treatment) => {
      return {
        photo: pets[treatment.petId].avatar,
        name: pets[treatment.petId].name,
        enterDate: treatment.enterDate,
        belongsToVet: treatment.belongsToVet,
        clinicEvoResume: treatment.clinicEvoResume,
        qrCode: pets[treatment.petId].qrCode
      };
    })
);

export const selectTreatmentsByIdsForListComponent = createSelector(
  selectTreatmentsEntities,
  (entities, props: string[]) => {
    return {
      data: props.map((id) => {
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
        column2: { included: true, type: 'string', label: 'Enter Date', sort: false, width: '190px'},
        column3: { included: true, type: 'string', label: 'Laúdo', sort: true, width: ''},
        column4: { included: true, type: 'string', label: 'Status', sort: true, width: '70px'}
      }
    };
  }
);