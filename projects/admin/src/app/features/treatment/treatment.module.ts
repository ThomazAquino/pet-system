import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreatmentRoutingModule } from './treatment-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { TreatmentContainerComponent } from './treatment-container/treatment-container.component';
import { TreatmentListComponent } from './treatment-list/treatment-list.component';
import { TreatmentComponent } from './treatment/treatment.component';
import { TreatmentCreationComponent } from './treatment-creation/treatment-creation.component';
import { TreatmentTextAreaComponent } from './treatment/treatment-text-area/treatment-text-area.component';
import { RoutineTableComponent } from './treatment/routine-table/routine-table.component';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FrequencyPipe } from './treatment/routine-table/frequency.pipe';


@NgModule({
  declarations: [
    TreatmentContainerComponent,
    TreatmentListComponent,
    TreatmentComponent,
    TreatmentCreationComponent,
    TreatmentTextAreaComponent,
    RoutineTableComponent,
    FrequencyPipe
  ],
  imports: [
    CommonModule,
    TreatmentRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule
  ],
  providers: [FrequencyPipe]
})
export class TreatmentModule { }
