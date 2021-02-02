import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { v4 as uuid } from 'uuid';
import { select, State, Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { selectOwnerById } from '../../../core/owners/owners.reducer';
import { Owner } from '../../../core/owners/owners.model';
import { merge, Observable } from 'rxjs';
import { selectPetsByIds } from '../../../core/pets/pets.reducer';
import { Pet } from '../../../core/pets/pets.model';


@Component({
  selector: 'pet-owner-profile',
  templateUrl: './owner-profile.component.html',
  styleUrls: ['./owner-profile.component.scss'],
  host: { 'class': 'section'},
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnerProfileComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  bookFormGroup = this.fb.group(OwnerProfileComponent.createBook());


  isEditing: boolean;
  owner: Owner;
  pets: Pet[];


  constructor(
    public store: Store,
    public fb: FormBuilder,
    private router: ActivatedRoute
  ) { }

  static createBook(): any {
    return {
      id: uuid(),
      title: '',
      author: '',
      description: ''
    };
  }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.store.select(selectOwnerById, params['id']).subscribe((owner: Owner) => {
        this.owner = owner;
         this.store.select(selectPetsByIds, owner.pets).subscribe(pets => {
           this.pets = pets;
         })
      });
    });
  }
}
