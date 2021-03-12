import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamRoutingModule } from './team-routing.module';
import { TeamContainerComponent } from './team-container/team-container.component';
import { TeamListComponent } from './team-list/team-list.component';
import { SharedModule } from '../../shared/shared.module';
import { TeamProfileComponent } from './team-profile/team-profile.component';


@NgModule({
  declarations: [TeamContainerComponent, TeamListComponent, TeamProfileComponent],
  imports: [
    CommonModule,
    TeamRoutingModule,
    SharedModule
  ]
})
export class TeamModule { }
