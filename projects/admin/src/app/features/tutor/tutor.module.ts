import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorRoutingModule } from './tutor-routing.module';
import { TutorProfileComponent } from './tutor-profile/tutor-profile.component';
import { TutorCreatorComponent } from './tutor-creator/tutor-creator.component';
import { TutorContainerComponent } from './tutor-container/tutor-container.component';
import { TutorListComponent } from './tutor-list/tutor-list.component';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [TutorProfileComponent, TutorCreatorComponent, TutorContainerComponent, TutorListComponent],
  imports: [
    CommonModule,
    TutorRoutingModule,
    SharedModule,
    FontAwesomeModule,
    MatTableModule,
    MatSortModule,
    SharedModule
  ]
})
export class TutorModule { }
