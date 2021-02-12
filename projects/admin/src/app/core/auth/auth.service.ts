import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Tutor } from '../tutors/tutors.model';

// import { environment } from '@environments/environment';

// const baseUrl = `${environment.apiUrl}/accounts`;
const baseUrl = 'http://localhost:4000/accounts';

@Injectable({ providedIn: 'root' })
export class AuthService {
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

    login(email: string, password: string) {
        return this.http.post<any>(`${baseUrl}/authenticate`, { email, password }, { withCredentials: true })
            .pipe(map(auth => {
                this.authSubject.next(auth);
                this.startRefreshTokenTimer();
                return auth;
            }));
    }

    logout() {
        this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.authSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    refreshToken() {
        return this.http.post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map((auth) => {
                this.authSubject.next(auth);
                this.startRefreshTokenTimer();
                return auth;
            }));
    }

    register(account: Tutor) {
        return this.http.post(`${baseUrl}/register`, account);
    }

    verifyEmail(token: string) {
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }
    
    forgotPassword(email: string) {
        return this.http.post(`${baseUrl}/forgot-password`, { email });
    }
    
    validateResetToken(token: string) {
        return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }
    
    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }

    getAll() {
        return this.http.get<Tutor[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Tutor>(`${baseUrl}/${id}`);
    }
    
    create(params) {
        return this.http.post(baseUrl, params);
    }
    
    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((account: any) => {
                // update the current account if it was updated
                if (account.id === this.authValue.id) {
                    // publish updated account to subscribers
                    account = { ...this.authValue, ...account };
                    this.authSubject.next(account);
                }
                return account;
            }));
    }
    
    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (id === this.authValue.id)
                    this.logout();
            }));
    }

    // helper methods


    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.authValue.jwtToken.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}