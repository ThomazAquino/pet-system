import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pet } from '../pets/pets.model';
import { Treatment } from '../treatments/treatments.model';
import { Tutor } from '../tutors/tutors.model';
import { environment as env } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public auth: Observable<Tutor>;

  private authSubject: BehaviorSubject<Tutor>;
  private refreshTokenTimeout;


  constructor(
      private router: Router,
      private http: HttpClient
  ) {
      this.authSubject = new BehaviorSubject<Tutor>(null);
      this.auth = this.authSubject.asObservable();
  }

  public get authValue(): Tutor {
      return this.authSubject.value;
  }

  /* *********** USERS *********** */

  getAllUsers() {
      return this.http.get<Tutor[]>(`${env.apiPrefix}/accounts`);
  }

  getUserById(id: string) {
      return this.http.get<Tutor>(`${env.apiPrefix}/accounts/${id}`);
  }

  getManyUsersByIds(ids: string[]) {
      return this.http.get<Tutor[]>(`${env.apiPrefix}/accounts/many/${ids}`);
  }
  
  createUser(params) {
    const formData = buildFormData(params);
    return this.http.post(`${env.apiPrefix}/accounts`, formData);
  }
  
  updateUser(id, params) {
    const formData = buildFormData(params.changes);

    return this.http.put(`${env.apiPrefix}/accounts/${id}`, formData)
      .pipe(map((account: any) => {
        //   // update the current account if it was updated
        //   if (account.id === this.authValue.id) {
        //       // publish updated account to subscribers
        //       account = { ...this.authValue, ...account };
        //       this.authSubject.next(account);
        //   }
          return account;
      }));
  }
  
  deleteUser(id: string) {
      return this.http.delete(`${env.apiPrefix}/accounts/${id}`)
          // .pipe(finalize(() => {
          //     // auto logout if the logged in account was deleted
          //     if (id === this.authValue.id)
          //         this.logout();
          // }));
  }


   /* *********** PETS *********** */

  getAllPets() {
    return this.http.get<Pet[]>(`${env.apiPrefix}/pets`);
  }

  getPetById(id: string) {
    return this.http.get<Pet>(`${env.apiPrefix}/pets/${id}`);
  }

  getManyPetsByIds(ids: string[]) {
    return this.http.get<Pet[]>(`${env.apiPrefix}/pets/many/${ids}`);
  }

  createPet(params) {
    const formData = buildFormData(params);
    return this.http.post(`${env.apiPrefix}/pets`, formData);
  }

  updatePet(id, params) {
    const formData = buildFormData(params.changes);
    return this.http.put(`${env.apiPrefix}/pets/${id}`, formData)
      .pipe(map((account: any) => {
          return account;
    }));
  }

  deletePet(id: string) {
    return this.http.delete(`${env.apiPrefix}/pets/${id}`)
  }



  /* *********** TREATMENTS *********** */

  getAllTreatments() {
    return this.http.get<Treatment[]>(`${env.apiPrefix}/treatments`);
  }

  getTreatmentById(id: string) {
    return this.http.get<Treatment>(`${env.apiPrefix}/treatments/${id}`);
  }

  getManyTreatmentsByIds(ids: string[]) {
    return this.http.get<Treatment[]>(`${env.apiPrefix}/treatments/many/${ids}`);
  }

  createTreatment(params) {
    return this.http.post(`${env.apiPrefix}/treatments`, params);
  }

  updateTreatment(id, params) {
    return this.http.put<any>(`${env.apiPrefix}/treatments/${id}`, params);
  }

  closeTreatment(id) {
    return this.http.put<any>(`${env.apiPrefix}/treatments/close/${id}`, null)
  }

  deleteTreatment(id: string) {
    return this.http.delete(`${env.apiPrefix}/treatments/${id}`)
  }
}

function buildFormData(objectForm) {
  const formData = new FormData();
  Object.keys(objectForm).forEach(field => {
    // ForData cannot send arrays.
    if (field === 'treatments') {
      formData.append(field, JSON.stringify(objectForm[field]));
      return
    }
    formData.append(field, objectForm[field]);
  });

  return formData;
}