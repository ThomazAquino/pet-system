import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  constructor(
    private translateService: TranslateService,
    private title: Title
  ) {}

  setTitle(
    snapshot: ActivatedRouteSnapshot,
    lazyTranslateService?: TranslateService
  ) {
    let lastChild = snapshot;
    while (lastChild.children.length) {
      lastChild = lastChild.children[0];
    }
    const { title } = lastChild.data;
    const translate = lazyTranslateService || this.translateService;

    if (title) {
      translate
        .get(title)
        .pipe(filter((translatedTitle) => translatedTitle !== title))
        .subscribe((translatedTitle) =>
          this.title.setTitle(`${translatedTitle} - ${env.appName}`)
        );
    } else {
      this.title.setTitle(env.appName);
    }
  }
}

let state = {
  owners: {
    'id-person-1' : {
      name: 'João',
      cel: '99129912',
      tel: '32323333',
      street: 'name name ',
      streetNumber: '1212',
      postalCode: '0000000',
      birthday: '21/12/1992',
      pets: ['id-pet-1', 'id-pet-2'],
    },
    'id-person-2' : {
      name: 'Mariah',
      cel: '99129912',
      tel: '32323333',
      street: 'name name ',
      streetNumber: '1212',
      postalCode: '0000000',
      birthday: '21/12/1992',
      pets: ['id-pet-3'],
    },
    allIds : ['id-person-1', 'id-person-2']
  },
  pets: {
    'id-pet-1' : {
      name: 'Lecy',
      type: 'dog',
      breed: 'Buldog',
      color: 'yellow',
      status: 'interned',
      ownerId: 'id-person-1',
      treatments: ['id-treatment-1', 'id-treatment-2'],
    },
    'id-pet-2' : {
      name: 'Lecy',
      type: 'dog',
      breed: 'Buldog',
      color: 'yellow',
      status: 'in-home',
      ownerId: 'id-person-1',
      treatments: ['id-treatment-3', 'id-treatment-4'],
    },
    'id-pet-3' : {
      name: 'Lecy',
      type: 'dog',
      breed: 'Buldog',
      color: 'yellow',
      status: 'in-home',
      ownerId: 'id-person-2',
      treatments: ['id-treatment-5', 'id-treatment-6'],
    },
    allIds : ['id-pet-1', 'id-pet-2', 'id-pet-3']
  },
  treatments: {
    'id-treatment-1' : {
      enterDate: '12/12/1992',
      status: 'open',
      moreData: 'blabla',
    },
    'id-treatment-2' : {
      enterDate: '12/12/1992',
      status: 'open',
      moreData: 'blabla',
    },
    allIds : ['id-treatment-1', 'id-treatment-2']
  }
}

let qstate = {
  clients: {
    'id-person-1' : {
      name: 'João',
      cel: '99129912',
      tel: '32323333',
      street: 'name name ',
      streetNumber: '1212',
      postalCode: '0000000',
      birthday: '21/12/1992',
      pets: ['id-pet-1', 'id-pet-2'],
    },
    'id-person-2' : {
      name: 'Mariah',
      cel: '99129912',
      tel: '32323333',
      street: 'name name ',
      streetNumber: '1212',
      postalCode: '0000000',
      birthday: '21/12/1992',
      pets: ['id-pet-3'],
    },
    allIds : ['id-person-1', 'id-person-1']
  },
  pets: {
    'id-pet-1' : {
      owner: 'id-person-1',
      name: 'Lecy',
      type: 'dog',
      breed: 'Buldog',
      color: 'yellow',
      status: 'interned',
      treatments: ['id-treatment-1', 'id-treatment-2'],
    },
    'id-pet-2' : {
      owner: 'id-person-1',
      name: 'bobby',
      type: 'cat',
      breed: '',
      color: 'white',
      status: 'in-home',
      treatments: ['id-treatment-3', 'id-treatment-4'],
    },
    'id-pet-3' : {
      owner: 'id-person-3',
      name: 'Rufus',
      type: 'dog',
      breed: 'pit bull',
      color: 'yellow',
      status: 'in-home',
      treatments: ['id-treatment-5', 'id-treatment-6'],
    },
    allIds : ['id-pet-1', 'id-pet-2', 'id-pet-3']
  },
  treatments: {
    'id-treatment-1' : {
      enterDate: '12/12/1992',
      status: 'open',
      moreData: 'foo bar',
    },
    'id-treatment-2' : {
      enterDate: '12/12/1992',
      status: 'open',
      moreData: 'foo bar',
    },
    allIds : ['id-treatment-1', 'id-treatment-2']
  }
}
