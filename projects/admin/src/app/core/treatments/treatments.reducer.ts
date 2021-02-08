import {
  Action,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Treatment } from './treatments.model';
import * as TreatmentsActions from './treatments.actions';
import { AppState } from '../core.state';
import { selectPetsEntities } from '../pets/pets.reducer';

export const treatmentsFeatureKey = 'treatments';

export interface TreatmentsState extends EntityState<Treatment> {
  // additional entities state properties
}

export const treatmentsAdapter: EntityAdapter<Treatment> = createEntityAdapter<Treatment>();

export const initialState: TreatmentsState = treatmentsAdapter.getInitialState({
  // additional entity state properties
  ids: ['id-treatment-1', 'id-treatment-2', 'id-treatment-3'],
  entities: {
    'id-treatment-1': {
      id: 'id-treatment-1',
      status: 'close',
      enterDate: '11/12/2019',
      dischargeDate: '19/12/2019',
      medications: [],
      food: [],
      conclusiveReport: null,
      conclusiveReportShort: 'Parvovirose',
      dischargeCare: null,
      clinicEvo: null,
      clinicEvoResume: 3,
      petId: 'id-pet-1',
      belongsToVet: 'id-vet-1'
    },
    'id-treatment-2': {
      id: 'id-treatment-2',
      status: 'open',
      enterDate: '21/04/2021',
      dischargeDate: null,
      medications: [],
      food: [],
      conclusiveReport: null,
      dischargeCare: null,
      clinicEvo: null,
      clinicEvoResume: 2,
      petId: 'id-pet-1',
      belongsToVet: 'id-vet-2'
    },
    'id-treatment-3': {
      id: 'id-treatment-3',
      status: 'close',
      enterDate: '11/12/2020',
      dischargeDate: '17/12/2020',
      medications: [],
      food: [],
      conclusiveReport: null,
      conclusiveReportShort: 'Otite canina',
      dischargeCare: null,
      clinicEvo: null,
      clinicEvoResume: 2,
      petId: 'id-pet-2',
      belongsToVet: 'id-vet-3'
    },
    'id-treatment-4': {
      id: 'id-treatment-4',
      status: 'close',
      enterDate: '01/01/2021',
      dischargeDate: '09/01/2021',
      medications: [],
      food: [],
      conclusiveReport: null,
      conclusiveReportShort: 'Insuficiência renal',
      dischargeCare: null,
      clinicEvo: null,
      clinicEvoResume: 2,
      petId: 'id-pet-2',
      belongsToVet: 'id-vet-3'
    },
    'id-treatment-5': {
      id: 'id-treatment-5',
      status: 'close',
      enterDate: '01/01/2020',
      dischargeDate: '09/01/2020',
      medications: [],
      food: [],
      conclusiveReport: null,
      conclusiveReportShort: 'Raiva',
      dischargeCare: null,
      clinicEvo: null,
      clinicEvoResume: 2,
      petId: 'id-pet-3',
      belongsToVet: 'id-vet-3'
    }
  }
});

const reduce = createReducer(
  initialState,
  on(TreatmentsActions.addTreatment, (state, action) =>
    treatmentsAdapter.addOne(action.treatment, state)
  ),
  on(TreatmentsActions.upsertTreatment, (state, action) =>
    treatmentsAdapter.upsertOne(action.treatment, state)
  ),
  on(TreatmentsActions.addTreatments, (state, action) =>
    treatmentsAdapter.addMany(action.treatments, state)
  ),
  on(TreatmentsActions.upsertTreatments, (state, action) =>
    treatmentsAdapter.upsertMany(action.treatments, state)
  ),
  on(TreatmentsActions.updateTreatment, (state, action) =>
    treatmentsAdapter.updateOne(action.treatment, state)
  ),
  on(TreatmentsActions.updateTreatments, (state, action) =>
    treatmentsAdapter.updateMany(action.treatments, state)
  ),
  on(TreatmentsActions.deleteTreatment, (state, action) =>
    treatmentsAdapter.removeOne(action.id, state)
  ),
  on(TreatmentsActions.deleteTreatments, (state, action) =>
    treatmentsAdapter.removeMany(action.ids, state)
  ),
  on(TreatmentsActions.loadTreatments, (state, action) =>
    treatmentsAdapter.addAll(action.treatments, state)
  ),
  on(TreatmentsActions.clearTreatments, (state) => treatmentsAdapter.removeAll(state))
);

export function treatmentsReducer(
  state: TreatmentsState | undefined,
  action: Action
) {
  return reduce(state, action);
}

// export const {
//   selectIds,
//   selectEntities: treatmentsEntities,
//   selectAll: allTreatments
// } = treatmentsAdapter.getSelectors((state: AppState) => state.treatments);

// // select the array of treatments
// export const selectAllTreatments = allTreatments;

// // select the array of widget ids
// export const selectTreatmentsIds = selectIds;

// // select the dictionary of widget entities
// export const selectTreatmentsEntities = treatmentsEntities;


export const { selectIds, selectEntities, selectAll } = 
treatmentsAdapter.getSelectors((state: AppState) => state.treatments);

export const selectAllTreatments = selectAll;
export const selectTreatmentsEntities = selectEntities;
export const selectTreatmentsIds = selectIds;

