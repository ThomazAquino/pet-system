import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { OwnerProfileComponent } from './owner-profile/owner-profile.component';
import { OwnerCreatorComponent } from './owner-creator/owner-creator.component';
import { OwnerContainerComponent } from './owner-container/owner-container.component';
import { OwnerListComponent } from './owner-list/owner-list.component';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [OwnerProfileComponent, OwnerCreatorComponent, OwnerContainerComponent, OwnerListComponent],
  imports: [
    CommonModule,
    OwnerRoutingModule,
    SharedModule,
    FontAwesomeModule,
    MatTableModule,
    MatSortModule,
    SharedModule
  ]
})
export class OwnerModule { }
