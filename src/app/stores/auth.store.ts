import { LoggingService } from 'src/app/shared/services/logging.service';
import { Injectable, computed, signal, inject } from '@angular/core';
// ...existing code...
import { ApiConnectionService } from 'src/app/shared/services/api-connection.service';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { ErrorLoggerService } from 'src/app/shared/services/error-logger.service';

import { Credentials } from 'src/app/shared/models/Credentials';
import { JwtResponse, UserDto } from 'src/app/shared/models/LoginResponse';
import { environment } from 'src/environments/config/environment';
// import { AppVersionService } from 'src/app/shared/services/app-version.service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  /**
   * Devuelve el usuario actual con logs de depuración sobre el nivel de rol.
   */
  getUserWithDebug(): UserDto | null {
    const user = localStorage.getItem('user');
    if (!user) {
      this.logger.log('[auth.store] No hay usuario en localStorage' as any);
      return null;
    }
    try {
      const parsed = JSON.parse(user);
      this.logger.log('[auth.store] Usuario extraído de localStorage:', parsed as any);
      if (parsed?.role?.level != null) {
        this.logger.log('[auth.store] Nivel de rol:', parsed.role.level as any);
      } else if (Array.isArray(parsed?.roles) && parsed.roles.length) {
        this.logger.log('[auth.store] Niveles de roles:', parsed.roles.map((r: any) => r?.level) as any);
      } else {
        this.logger.log('[auth.store] Usuario sin nivel de rol definido' as any);
      }
      return parsed;
    } catch (e) {
      this.logger.log('[auth.store] Error al parsear usuario:', e as any);
      return null;
    }
  }
  private readonly _user = signal<UserDto | null>(null);
  private readonly _token = signal<string | null>(localStorage.getItem('access_token'));
  private _tokenExpiration: number | null = null;
  private _tokenIssuedAt: number | null = null;

  readonly user = computed(() => this._user());
  readonly isLoggedIn = computed(() => !!this._token());

  private api = inject(ApiConnectionService);
  private router = inject(Router);
  private errorLogger = inject(ErrorLoggerService);
  private logger = inject(LoggingService);
  // private appVersionService = inject(AppVersionService);

  constructor() {
    this.logger.log('[AuthStore] Inicializado' as any);
    if (this._token()) {
      this.logger.log('[AuthStore] Token encontrado, decodificando...' as any);
      this.decodeTokenMetadata();
      this.scheduleTokenCheck();
      setTimeout(() => this.fetchUserProfile());
    } else {
      this.logger.log('[AuthStore] No hay token al iniciar se redirigira al Login' as any);
    }
  }

  login(credentials: Credentials) {
    this.api.post<JwtResponse>(`auth/login`, credentials.toJSON())
      .subscribe({
        next: res => {
          this._token.set(res.accessToken);
          this._user.set(res.user ?? null);
          localStorage.setItem('access_token', res.accessToken);
          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
            if (res.user.company) {
              localStorage.setItem('company', JSON.stringify(res.user.company));
            } else {
              localStorage.removeItem('company');
            }
          }
          this.decodeTokenMetadata();
          this.scheduleTokenCheck();
          this.logger.log('[AuthStore] Login exitoso' as any);
          this.router.navigate(['/connect']);
        },
        error: err => this.logger.error('[AuthStore] Error de login', err as any)
      });
  }

  logout() {
    this.logger.log('[AuthStore] Logout ejecutado' as any);
    this._token.set(null);
    this._user.set(null);
    this._tokenExpiration = null;
    this._tokenIssuedAt = null;
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('/login');
  }

  private fetchUserProfile() {
    this.logger.log('[AuthStore] Obteniendo perfil de usuario...' as any);
    this.api.get<UserDto>(`auth/me`).subscribe({
      next: res => {
        this.logger.log('[AuthStore] Perfil cargado' as any);
        this._user.set(res);
        localStorage.setItem('user', JSON.stringify(res));
        if (res.company) {
          localStorage.setItem('company', JSON.stringify(res.company));
        } else {
          localStorage.removeItem('company');
        }
      },
      error: err => {
        this.errorLogger.error('[AuthStore] Error al obtener perfil. Cerrando sesión', err);
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

      this.logger.log(`[AuthStore] Token válido. Expira en ${Math.floor(duration / 60)} min` as any);
      this.logger.log(`[AuthStore] Tiempo restante hasta la expiración del token: ${days}d ${hours}h ${minutes}m ${seconds}s` as any);
    } catch (err) {
      this.errorLogger.error('[AuthStore] Error decodificando token', err);
    }
  }

  private scheduleTokenCheck() {
    interval(15_000).subscribe(() => {
      const now = Date.now();
      if (!this._tokenExpiration || !this._tokenIssuedAt) return;

      const totalLifetime = this._tokenExpiration - this._tokenIssuedAt;
      const timeLeft = this._tokenExpiration - now;
      const ratio = timeLeft / totalLifetime;

      this.logger.log(`[AuthStore] Tiempo restante del token: ${Math.floor(timeLeft / 1000)}s (${Math.round(ratio * 100)}%)` as any);

      if (timeLeft <= 0) {
        this.logger.log('[AuthStore] Token expirado' as any);
        this.logout();
      } else if (ratio < 0.15) {
        this.logger.log('[AuthStore] Tiempo crítico: renovando token...' as any);
        this.refreshToken();
      }
    });
  }

  private refreshToken() {
    this.logger.log('[AuthStore] Solicitando renovación de token...');
    this.api.post<JwtResponse>(`auth/refresh`, {})
      .subscribe({
        next: res => {
          this._token.set(res.accessToken);
          this._user.set(res.user ?? null);
          localStorage.setItem('access_token', res.accessToken);
          if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
          this.decodeTokenMetadata();
          this.logger.log('[AuthStore] Token renovado correctamente');
        },
        error: err => {
          this.errorLogger.error('[AuthStore] Fallo al renovar token. Cerrando sesión.', err);
          this.logout();
        }
      });
  }

  get token(): string | null {
    return this._token();
  }
}
