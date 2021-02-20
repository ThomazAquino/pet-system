import { TreatmentComponent } from './treatment/treatment.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TreatmentContainerComponent } from './treatment-container/treatment-container.component';
import { TreatmentCreationComponent } from './treatment-creation/treatment-creation.component';
import { TreatmentListComponent } from './treatment-list/treatment-list.component';

const routes: Routes = [
  {
    path: '',
    component: TreatmentContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: TreatmentListComponent,
        data: { title: 'pet.examples.menu.list' }
      },
      {
        path: 'add',
        component: TreatmentCreationComponent,
        data: { title: 'pet.examples.menu.list' }
      },
      {
        path: ':id',
        component: TreatmentComponent,
        data: { title: 'pet.examples.menu.profile' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreatmentRoutingModule { }
