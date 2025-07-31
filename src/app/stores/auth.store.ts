// ✅ auth.store.ts
import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { LoginResponse } from 'src/app/shared/models/LoginResponse';
import { Credentials } from 'src/app/shared/models/credentials';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/config/environment';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<string | null>(localStorage.getItem('access_token'));

  readonly user = computed(() => this._user());
  readonly isLoggedIn = computed(() => !!this._token());

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    if (this._token()){
      console.log('Token found, fetching user profile and checking if is expired');
      setTimeout(() => this.fetchUserProfile());
    }else{

    }
  }

  login(credentials: Credentials) {
    this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials.toJSON())
      .subscribe({
        next: res => {
          const loginData = new LoginResponse(res);
          this._token.set(loginData.token);
          this._user.set(new User(loginData.user));
          localStorage.setItem('access_token', loginData.token);
          this.router.navigate(['/connect']);
        },
        error: err => console.error('Login failed', err)
      });
  }

  logout() {
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('/login');
  }

  private fetchUserProfile() {
    this.http.get<User>(`${environment.apiUrl}/auth/me`)
      .subscribe({
        next: res => this._user.set(new User(res)),
        error: (err) => {
         console.error('Failed to fetch user profile', err);
          this.logout()
        }
      });
  }

  get token(): string | null {
    return this._token();
  }
}
