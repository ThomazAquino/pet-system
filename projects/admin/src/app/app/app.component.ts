import browser from 'browser-detect';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment as env } from '../../environments/environment';

import {
  authLogin,
  authLogout,
  routeAnimations,
  LocalStorageService,
  selectIsAuthenticated,
  selectSettingsStickyHeader,
  selectSettingsLanguage,
  selectEffectiveTheme
} from '../core/core.module';
import {
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeLanguage
} from '../core/settings/settings.actions';
import { selectOwners } from '../core/core.state';
import { selectAllOwners, selectOwnerEntities } from '../core/owners/owners.reducer';
import { upsertOwner } from '../core/owners/owners.actions';
import { selectAllPets } from '../core/pets/pets.reducer';
import { upsertPet } from '../core/pets/pets.actions';
import { selectAllTreatments, selectOpenTreatments } from '../core/treatments/treatments.reducer';
import { Treatment } from '../core/treatments/treatments.model';
import { upsertTreatment } from '../core/treatments/treatments.actions';
import { Owner } from '../core/owners/owners.model';

@Component({
  selector: 'pet-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {
  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = require('../../assets/logo.png').default;
  languages = ['en', 'de', 'sk', 'fr', 'es', 'pt-br', 'zh-cn', 'he'];
  navigation = [
    { link: 'about', label: 'pet.menu.about' },
    { link: 'feature-list', label: 'pet.menu.features' },
    { link: 'examples', label: 'pet.menu.examples' }
  ];
  navigationSideMenu = [
    ...this.navigation,
    { link: 'settings', label: 'pet.menu.settings' }
  ];

  isAuthenticated$: Observable<boolean>;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;


  owners$: Observable<any> = this.store.pipe(select(selectAllOwners));
  pets$: Observable<any> = this.store.pipe(select(selectAllPets));
  treatments$: Observable<any> = this.store.pipe(select(selectAllTreatments));
  openTreatments$: Observable<any> = this.store.pipe(select(selectOpenTreatments));


  selectedOwner$: Observable<any> = this.store.pipe(select(selectAllPets));

  constructor(
    private store: Store,
    private storageService: LocalStorageService
  ) {}

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnInit(): void {
    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        actionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }

    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
  }

  upsertOwner() {
    const owner: Owner = {
      id: 'asasa',
      name: 'New name',
      lastName: 'New last name',
      cellPhone: '000-000',
      tel: '000-000',
      street: '000-000',
      streetNumber: '000-000',
      postalCode: '000-000',
      birthday: '000-000',
      cpf: '000-000',
      pets: []
    };

    this.store.dispatch(upsertOwner({owner}));
  }
  upsertPet() {
    const pet = {
        id: 'id-pet-5',
        photo: '',
        name: 'new dog',
        type: 'dog',
        breed: 'poodle',
        color: 'white',
        status: 'in-home',
        ownerId: 'id-person-5',
        treatments: [],
        qrCode: ''
    };

    this.store.dispatch(upsertPet({pet}));
  }
  upsertTreatment() {
    const treatment: Treatment = {
      id: 'id-treatment-5',
      status: 'open',
      enterDate: '28/01/2021',
      dischargeDate: null,
      medications: [],
      food: [],
      conclusiveReport: null,
      dischargeCare: null,
      clinicEvo: null,
      clinicEvoResume: 2,
      petId: 'id-pet-5',
      belongsToVet: 'id-vet-3'
    };

    this.store.dispatch(upsertTreatment({treatment}));
  }

  onLoginClick() {
    this.store.dispatch(authLogin());
  }

  onLogoutClick() {
    this.store.dispatch(authLogout());
  }

  onLanguageSelect({ value: language }) {
    this.store.dispatch(actionSettingsChangeLanguage({ language }));
  }
}

// export const signinRouter = RouterModule.forChild(SIGN_IN_ROUTER);

// let doctors = [{name: 'Zé', id: '1'},{name: 'alex', id: '2'}, {name: 'bruno', id: '3'}]

// let atendimentos = [{name: "Atendimento 1", doctorId: "1"},
//                     {name: "Atendimento 2", doctorId: "1"},
//                     {name: "Atendimento 3", doctorId: "1"},
//                     {name: "Atendimento 4", doctorId: "2"},
//                     {name: "Atendimento 5", doctorId: "3"}];

// let filtered = doctors.map(doctor => {
//   return Object.assign({}, {
//     ...doctor,
//     atendimentos: atendimentos.filter(atendimento => atendimento.doctorId === doctor.id)
//   })
// })
