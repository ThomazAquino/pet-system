import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Treatment } from './treatment.model';
import * as TreatmentActions from './treatment.actions';
import { AppState } from '../core.state';
import { selectAllPets, selectPetEntities } from '../pets/pet.reducer';

export const treatmentFeatureKey = 'treatments';

export interface TreatmentState extends EntityState<Treatment> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Treatment> = createEntityAdapter<Treatment>();

export const initialState: TreatmentState = adapter.getInitialState({
  // additional entity state properties
  ids: ['id-treatment-1', 'id-treatment-2', 'id-treatment-3'],
  entities: {
    'id-treatment-1' : {
      id: 'id-treatment-1',
      status: 'open',
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
      status: 'open',
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
    },
    'id-treatment-3' : {
      id: 'id-treatment-3',
      status: 'close',
      enterDate: '11/12/2020',
      dischargeDate: null,
      medications: [],
      food: [],
      conclusiveReport: null,
      dischargeCare: null,
      clinicEvo: null,
      clinicEvoResume: 2,
      petId: 'id-pet-2',
      belongsToVet: 'id-vet-3'
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


export const selectOpenTreatments = createSelector(
  allTreatments,
 (treatments) => treatments.filter(treatment => treatment.status === 'open')
 );

export const selectOpenTreatmentsForTable = createSelector(
  selectOpenTreatments,
  selectPetEntities,
 (treatments, pets) => treatments.map(treatment => {
    return {
      photo: pets[treatment.petId].photo,
      name: pets[treatment.petId].name,
      enterDate: treatment.enterDate,
      belongsToVet: treatment.belongsToVet,
      clinicEvoResume: treatment.clinicEvoResume,
      qrCode: pets[treatment.petId].qrCode
    }
  })
 );

