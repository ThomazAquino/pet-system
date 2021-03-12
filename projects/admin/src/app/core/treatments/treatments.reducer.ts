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
  ids: [],
  entities: {}
});

const reduce = createReducer(
  initialState,
  on(TreatmentsActions.addTreatmentSuccess, (state, action) =>
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
  on(TreatmentsActions.updateTreatmentSuccess, (state, action) =>
    treatmentsAdapter.updateOne(action.treatment, state)
  ),
  // on(TreatmentsActions.addPropertyToArrayInTreatment, (state, action) => {
  //   const arrayValue = [...state.entities[action.treatmentId][action.propertyName], action.value];
  //   const changes = {}
  //   changes[action.propertyName] = arrayValue;
  //   return treatmentsAdapter.updateOne({
  //     id: action.treatmentId,
  //     changes: changes
  //   },
  //   state)
  // }),
  // on(TreatmentsActions.updatePropertyToArrayInTreatment, (state, action) => {
  //   const arrayValue = [...state.entities[action.treatmentId][action.propertyName]];
  //   const newArrayValue = arrayValue.map(value => {
  //     return value.id === action.value.id ? action.value : value;
  //   })

  //   const changes = {}
  //   changes[action.propertyName] = newArrayValue;
  //   return treatmentsAdapter.updateOne({
  //     id: action.treatmentId,
  //     changes: changes
  //   },
  //   state)
  // }),

  on(TreatmentsActions.updateTreatments, (state, action) =>
    treatmentsAdapter.updateMany(action.treatments, state)
  ),
  on(TreatmentsActions.deleteTreatment, (state, action) =>
    treatmentsAdapter.removeOne(action.id, state)
  ),
  on(TreatmentsActions.deleteTreatments, (state, action) => {
    // debugger;
    return treatmentsAdapter.removeMany(action.ids, state)
  }),
  on(TreatmentsActions.loadTreatmentsSuccess, (state, action) =>
    treatmentsAdapter.upsertMany(action.treatments, state)
  ),  
  on(TreatmentsActions.loadTreatmentSuccess, (state, action) =>
    treatmentsAdapter.upsertOne(action.treatment, state)
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

