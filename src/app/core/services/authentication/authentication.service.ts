import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly tokenKey = 'access_token';

  constructor(private router: Router) {}

  loginSuccess(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserPayload(): any {
    const token = this.getToken();
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  }
}
