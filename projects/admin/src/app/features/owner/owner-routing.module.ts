import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnerContainerComponent } from './owner-container/owner-container.component';
import { OwnerCreatorComponent } from './owner-creator/owner-creator.component';
import { OwnerListComponent } from './owner-list/owner-list.component';
import { OwnerProfileComponent } from './owner-profile/owner-profile.component';

const routes: Routes = [
  {
    path: '',
    component: OwnerContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: OwnerListComponent,
        data: { title: 'pet.examples.menu.list' }
      },
      {
        path: 'profile:id',
        component: OwnerProfileComponent,
        data: { title: 'pet.examples.menu.profile' }
      },
      {
        path: 'add',
        component: OwnerCreatorComponent,
        data: { title: 'pet.examples.menu.add' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule { }
