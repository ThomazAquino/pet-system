import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Pet } from '../pets/pets.model';
import { Treatment } from '../treatments/treatments.model';
import { Tutor } from '../tutors/tutors.model';


const environment = {
  production: false,
  apiUrl: '/api'
};

const baseUrl = `${environment.apiUrl}`;
// const baseUrl = 'http://localhost:4000';

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
      return this.http.get<Tutor[]>(`${baseUrl}/accounts`);
  }

  getUserById(id: string) {
      return this.http.get<Tutor>(`${baseUrl}/accounts/${id}`);
  }

  getManyUsersByIds(ids: string[]) {
      return this.http.get<Tutor[]>(`${baseUrl}/accounts/many/${ids}`);
  }
  
  createUser(params) {
      return this.http.post(`${baseUrl}/accounts`, params);
  }
  
  updateUser(id, params) {
    return this.http.put(`${baseUrl}/accounts/${id}`, params)
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
      return this.http.delete(`${baseUrl}/accounts/${id}`)
          // .pipe(finalize(() => {
          //     // auto logout if the logged in account was deleted
          //     if (id === this.authValue.id)
          //         this.logout();
          // }));
  }


   /* *********** PETS *********** */

  getAllPets() {
    return this.http.get<Pet[]>(`${baseUrl}/pets`);
  }

  getPetById(id: string) {
    return this.http.get<Pet>(`${baseUrl}/pets/${id}`);
  }

  getManyPetsByIds(ids: string[]) {
    return this.http.get<Pet[]>(`${baseUrl}/pets/many/${ids}`);
  }

  createPet(params) {
    return this.http.post(`${baseUrl}/pets`, params);
  }

  updatePet(id, params) {
    return this.http.put(`${baseUrl}/pets/${id}`, params)
      .pipe(map((account: any) => {
          return account;
    }));
  }

  deletePet(id: string) {
    return this.http.delete(`${baseUrl}/pets/${id}`)
  }



  /* *********** TREATMENTS *********** */

  getAllTreatments() {
    return this.http.get<Treatment[]>(`${baseUrl}/treatments`);
  }

  getTreatmentById(id: string) {
    return this.http.get<Treatment>(`${baseUrl}/treatments/${id}`);
  }

  getManyTreatmentsByIds(ids: string[]) {
    return this.http.get<Treatment[]>(`${baseUrl}/treatments/many/${ids}`);
  }

  createTreatment(params) {
    return this.http.post(`${baseUrl}/treatments`, params);
  }

  updateTreatment(id, params) {
    return this.http.put<any>(`${baseUrl}/treatments/${id}`, params);
  }

  closeTreatment(id) {
    return this.http.put<any>(`${baseUrl}/treatments/close/${id}`, null)
  }

  deleteTreatment(id: string) {
    return this.http.delete(`${baseUrl}/treatments/${id}`)
  }
}