import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PetContainerComponent } from './pet-container/pet-container.component';
import { PetListComponent } from './pet-list/pet-list.component';
import { PetProfileComponent } from './pet-profile/pet-profile.component';

const routes: Routes = [
  {
    path: '',
    component: PetContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: PetListComponent,
        data: { title: 'pet.examples.menu.list' }
      },
      {
        path: 'profile',
        component: PetProfileComponent,
        data: { title: 'pet.examples.menu.profile' }
      },
      {
        path: 'profile/:id',
        component: PetProfileComponent,
        data: { title: 'pet.examples.menu.profile' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetRoutingModule { }
