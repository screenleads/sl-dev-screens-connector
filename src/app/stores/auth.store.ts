import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

import { Credentials } from 'src/app/shared/models/Credentials';
import { LoginResponse } from 'src/app/shared/models/LoginResponse';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/config/environment';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<string | null>(localStorage.getItem('access_token'));
  private _tokenExpiration: number | null = null;
  private _tokenIssuedAt: number | null = null;

  readonly user = computed(() => this._user());
  readonly isLoggedIn = computed(() => !!this._token());

  private http = inject(HttpClient);
  private router = inject(Router);
  private logger = inject(NGXLogger);

  constructor() {
    this.logger.debug('[AuthStore] Inicializado');
    if (this._token()) {
      this.logger.info('[AuthStore] Token encontrado, decodificando...');
      this.decodeTokenMetadata();
      this.scheduleTokenCheck();
      setTimeout(() => this.fetchUserProfile());
    } else {
      this.logger.warn('[AuthStore] No hay token al iniciar se redirigira al Login');
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
          this.decodeTokenMetadata();
          this.scheduleTokenCheck();
          this.logger.info('[AuthStore] Login exitoso');
          this.router.navigate(['/connect']);
        },
        error: err => this.logger.error('[AuthStore] Error de login', err)
      });
  }

  logout() {
    this.logger.warn('[AuthStore] Logout ejecutado');
    this._token.set(null);
    this._user.set(null);
    this._tokenExpiration = null;
    this._tokenIssuedAt = null;
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('/login');
  }

  private fetchUserProfile() {
    this.logger.debug('[AuthStore] Obteniendo perfil de usuario...');
    this.http.get<User>(`${environment.apiUrl}/auth/me`).subscribe({
      next: res => {
        this.logger.info('[AuthStore] Perfil cargado');
        this._user.set(new User(res));
      },
      error: err => {
        this.logger.error('[AuthStore] Error al obtener perfil. Cerrando sesión', err);
        this.logout();
      }
    });
  }

  private decodeTokenMetadata() {
    const token = this._token();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this._tokenExpiration = payload.exp * 1000;
      this._tokenIssuedAt = payload.iat * 1000;

      const now = Date.now();
      const timeLeftMs = this._tokenExpiration - now;
      const totalLifetime = this._tokenExpiration - this._tokenIssuedAt;
      const duration = totalLifetime / 1000;

      const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

      this.logger.debug(`[AuthStore] Token válido. Expira en ${Math.floor(duration / 60)} min`);
      this.logger.info(`[AuthStore] Tiempo restante hasta la expiración del token: ${days}d ${hours}h ${minutes}m ${seconds}s`);
    } catch (err) {
      this.logger.error('[AuthStore] Error decodificando token', err);
    }
  }

  private scheduleTokenCheck() {
    interval(15_000).subscribe(() => {
      const now = Date.now();
      if (!this._tokenExpiration || !this._tokenIssuedAt) return;

      const totalLifetime = this._tokenExpiration - this._tokenIssuedAt;
      const timeLeft = this._tokenExpiration - now;
      const ratio = timeLeft / totalLifetime;

      this.logger.debug(`[AuthStore] Tiempo restante del token: ${Math.floor(timeLeft / 1000)}s (${Math.round(ratio * 100)}%)`);

      if (timeLeft <= 0) {
        this.logger.warn('[AuthStore] Token expirado');
        this.logout();
      } else if (ratio < 0.15) {
        this.logger.info('[AuthStore] Tiempo crítico: renovando token...');
        this.refreshToken();
      }
    });
  }

  private refreshToken() {
    this.logger.debug('[AuthStore] Solicitando renovación de token...');
    this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, {})
      .subscribe({
        next: res => {
          const refreshData = new LoginResponse(res);
          this._token.set(refreshData.token);
          this._user.set(new User(refreshData.user));
          localStorage.setItem('access_token', refreshData.token);
          this.decodeTokenMetadata();
          this.logger.info('[AuthStore] Token renovado correctamente');
        },
        error: err => {
          this.logger.error('[AuthStore] Fallo al renovar token. Cerrando sesión.', err);
          this.logout();
        }
      });
  }

  get token(): string | null {
    return this._token();
  }
}
