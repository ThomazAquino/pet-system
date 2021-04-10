import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Tutor } from '../tutors/tutors.model';
import { environment as env } from '../../../environments/environment';

// import { environment } from '@environments/environment';

// const env.apiPrefix = `${environment.apiUrl}/accounts`;
// const baseUrl = 'http://localhost:4000/accounts';
// const baseUrl = '/apis/accounts';

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
        return this.http.post<any>(`${env.apiPrefix}/accounts/authenticate`, { email, password }, { withCredentials: true })
        .pipe(map(auth => {
            this.authSubject.next(auth);
            this.startRefreshTokenTimer();
                return auth;
            }));
    }

    logout() {
        this.http.post<any>(`${env.apiPrefix}/accounts/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.authSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    refreshToken() {
        return this.http.post<any>(`${env.apiPrefix}/accounts/refresh-token`, {}, { withCredentials: true })
            .pipe(map((auth) => {
                this.authSubject.next(auth);
                this.startRefreshTokenTimer();
                return auth;
            }));
    }

    register(account: Tutor) {
        return this.http.post(`${env.apiPrefix}/accounts/register`, account);
    }

    verifyEmail(token: string) {
        return this.http.post(`${env.apiPrefix}/accounts/verify-email`, { token });
    }
    
    forgotPassword(email: string) {
        return this.http.post(`${env.apiPrefix}/accounts/forgot-password`, { email });
    }
    
    validateResetToken(token: string) {
        return this.http.post(`${env.apiPrefix}/accounts/validate-reset-token`, { token });
    }
    
    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${env.apiPrefix}/accounts/reset-password`, { token, password, confirmPassword });
    }

    getAll() {
        return this.http.get<Tutor[]>(env.apiPrefix);
    }

    getById(id: string) {
        return this.http.get<Tutor>(`${env.apiPrefix}/accounts/${id}`);
    }
    
    create(params) {
        return this.http.post(env.apiPrefix, params);
    }
    
    update(id, params) {
        return this.http.put(`${env.apiPrefix}/accounts/${id}`, params)
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
        return this.http.delete(`${env.apiPrefix}/accounts/${id}`)
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