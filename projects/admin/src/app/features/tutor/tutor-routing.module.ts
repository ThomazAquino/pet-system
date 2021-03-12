import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorContainerComponent } from './tutor-container/tutor-container.component';
import { TutorCreatorComponent } from './tutor-creator/tutor-creator.component';
import { TutorListComponent } from './tutor-list/tutor-list.component';
import { TutorProfileComponent } from './tutor-profile/tutor-profile.component';

const routes: Routes = [
  {
    path: '',
    component: TutorContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: TutorListComponent,
        data: { title: 'pet.examples.menu.list' }
      },
      {
        path: 'profile',
        component: TutorProfileComponent,
        data: { title: 'pet.examples.menu.profile' }
      },
      {
        path: 'profile/:id',
        component: TutorProfileComponent,
        data: { title: 'pet.examples.menu.profile' }
      },
      // {
      //   path: 'add',
      //   component: TutorCreatorComponent,
      //   data: { title: 'pet.examples.menu.add' }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorRoutingModule {}
