import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Treatment } from './treatment.model';
import * as TreatmentActions from './treatment.actions';
import { AppState } from '../core.state';

export const treatmentFeatureKey = 'treatments';

export interface TreatmentState extends EntityState<Treatment> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Treatment> = createEntityAdapter<Treatment>();

export const initialState: TreatmentState = adapter.getInitialState({
  // additional entity state properties
  ids: ['id-treatment-1', 'id-treatment-2'],
  entities: {
    'id-treatment-1' : {
      id: 'id-treatment-1',
      status: 'interned',
      enterDate: '11/12/2020',
      dischargeDate: null,
      medications: [],
      food: [],
      conclusiveReport: null,
      dischargeCare: null,
      clinicEvo: null,
      clinicEvoResume: 3,
      petId: 'id-pet-1',
      belongsToVet: 'id-vet-1'
    },
    'id-treatment-2' : {
      id: 'id-treatment-2',
      status: 'interned',
      enterDate: '11/12/2020',
      dischargeDate: null,
      medications: [],
      food: [],
      conclusiveReport: null,
      dischargeCare: null,
      clinicEvo: null,
      clinicEvoResume: 2,
      petId: 'id-pet-2',
      belongsToVet: 'id-vet-2'
    }
  }
});

const reduce = createReducer(
  initialState,
  on(TreatmentActions.addTreatment,
    (state, action) => adapter.addOne(action.treatment, state)
  ),
  on(TreatmentActions.upsertTreatment,
    (state, action) => adapter.upsertOne(action.treatment, state)
  ),
  on(TreatmentActions.addTreatments,
    (state, action) => adapter.addMany(action.treatments, state)
  ),
  on(TreatmentActions.upsertTreatments,
    (state, action) => adapter.upsertMany(action.treatments, state)
  ),
  on(TreatmentActions.updateTreatment,
    (state, action) => adapter.updateOne(action.treatment, state)
  ),
  on(TreatmentActions.updateTreatments,
    (state, action) => adapter.updateMany(action.treatments, state)
  ),
  on(TreatmentActions.deleteTreatment,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(TreatmentActions.deleteTreatments,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(TreatmentActions.loadTreatments,
    (state, action) => adapter.addAll(action.treatments, state)
  ),
  on(TreatmentActions.clearTreatments,
    state => adapter.removeAll(state)
  ),
);

export function treatmentReducer(state: TreatmentState | undefined, action: Action) {
  return reduce(state, action);
}

export const {
  selectIds,
  selectEntities: treatmentsEntities,
  selectAll: allTreatments,
} = adapter.getSelectors((state: AppState) => state.treatment);

// select the array of owners
export const selectAllTreatments = allTreatments;

// select the array of widget ids
export const selectOwnersIds = selectIds;

// select the dictionary of widget entities
export const selectTreatmentsEntities = treatmentsEntities;


