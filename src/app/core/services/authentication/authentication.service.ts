import { Injectable } from '@angular/core';
import { Credentials } from 'src/app/shared/models/credentials';
import { AuthStore } from 'src/app/stores/auth.store';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private authStore: AuthStore) {}

  login(credentials: Credentials) {
    this.authStore.login(credentials);
  }

  logout() {
    this.authStore.logout();
  }

  get isAuthenticated() {
    return this.authStore.isLoggedIn;
  }

  get currentUser() {
    return this.authStore.user;
  }

  get token(): string | null {
    return this.authStore.token;
  }
}
