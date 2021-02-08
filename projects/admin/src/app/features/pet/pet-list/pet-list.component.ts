import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllPetsForListComponent } from '../../../core/pets/pets.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'pet-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetListComponent implements OnInit {
  pets$: Observable<any>;

  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void {
    this.pets$ = this.store.select(
      selectAllPetsForListComponent
    );
  }

  onPetListClick(pet) {
    this.router.navigate(['pet/profile', pet.id]);
  }

}
