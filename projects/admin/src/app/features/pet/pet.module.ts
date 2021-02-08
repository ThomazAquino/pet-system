import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetRoutingModule } from './pet-routing.module';
import { PetContainerComponent } from './pet-container/pet-container.component';
import { PetListComponent } from './pet-list/pet-list.component';
import { PetProfileComponent } from './pet-profile/pet-profile.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    PetContainerComponent,
    PetListComponent,
    PetProfileComponent
  ],
  imports: [
    CommonModule,
    PetRoutingModule,
    SharedModule
  ]
})
export class PetModule { }
