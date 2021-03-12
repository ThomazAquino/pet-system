import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamContainerComponent } from './team-container/team-container.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamProfileComponent } from './team-profile/team-profile.component';

const routes: Routes = [
  {
    path: '',
    component: TeamContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: TeamListComponent,
        data: { title: 'pet.examples.menu.list' }
      },
      {
        path: 'profile',
        component: TeamProfileComponent,
        data: { title: 'pet.examples.menu.profile' }
      },
      {
        path: 'profile/:id',
        component: TeamProfileComponent,
        data: { title: 'pet.examples.menu.profile' }
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule { }
