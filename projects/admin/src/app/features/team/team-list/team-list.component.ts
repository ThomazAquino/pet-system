import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { loadAllTutors } from '../../../core/tutors/tutors.actions';
import { Observable } from 'rxjs';
import { Role, Tutor } from '../../../core/tutors/tutors.model';
import { selectFilteredUsersForListComponent, selectTutorsForListComponent } from '../../../core/tutors/tutors.selectors';
import { Router } from '@angular/router';

enum TeamFilter {
  aAll = 'Todos',
  bVet = 'Veterinários',
  cNurse = 'Enfermeiros',
  dNurse = 'Admin',
}

@Component({
  selector: 'pet-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {
  roles: { value: Role, label: string }[] = [
    {value: null, label: 'Todos'},
    {value: Role.Vet, label: 'Veterinário'},
    {value: Role.Nurse, label: 'Enfermeiro'},
    {value: Role.Admin, label: 'Administrador'}
  ];

  activeLink: string;

  users$: Observable<any>

  constructor(
    private store: Store,
    private router: Router
  ) { }

  ngOnInit() {
    this.store.dispatch(loadAllTutors());   
    this.users$ = this.store.select(selectFilteredUsersForListComponent);
  }
  
  filterByRole(param: string): void {
    this.activeLink = param;
    console.log(param)

    this.users$ = this.store.select(selectFilteredUsersForListComponent, param);  
  }

  onUserListClick(user): void {
    this.router.navigate(['team/profile', user.id]);
  }

  onAddUserClick(): void {
    this.router.navigate(['team/profile/add']);
  }

}
