import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly tokenKey = 'access_token';
  private readonly companyKey = 'company';

  constructor(private router: Router) { }

  loginSuccess(res: any) {
    console.log(res);
    console.log(res.token);
    console.log(res.user);
    console.log(res.user.company.id);
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.companyKey, res.user.company.id);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Opcional: decodificar y validar expiración del token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp > now;
    } catch (e) {
      return false;
    }
  }

  getUserPayload(): any {
    const token = this.getToken();
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  }
}
