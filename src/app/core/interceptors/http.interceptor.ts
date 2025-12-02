import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { LoggingService } from 'src/app/shared/services/logging.service';
import { ErrorLoggerService } from 'src/app/shared/services/error-logger.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { APP_CONFIG } from 'src/environments/config/app-config.token';

type AppConfig = {
  apiUrl: string;
  environment?: string;     // 'development' | 'preproduction' | 'production' | etc.
  traceEnabled?: boolean;   // override opcional
};

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const logger: LoggingService = inject(LoggingService);
  const errorLogger: ErrorLoggerService = inject(ErrorLoggerService);
  const authStore = inject(AuthStore);
  const config = inject<AppConfig>(APP_CONFIG);

  const token = authStore.token;

  // Zona horaria del cliente
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
  const offsetMinutes = -new Date().getTimezoneOffset(); // minutos al ESTE de UTC

  // Headers base (siempre enviamos zona horaria)
  const setHeaders: Record<string, string> = {
    'X-Timezone': tz,
    'X-Timezone-Offset': String(offsetMinutes),
  };
  if (token) {
    setHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Solo trazas en dev/preprod (o si lo fuerzas con traceEnabled)
  const env = (config?.environment ?? '').toLowerCase();
  const isDevOrPre =
    ['dev', 'develop', 'development', 'pre', 'preprod', 'preproduction', 'staging'].includes(env) ||
    !!config?.traceEnabled;

  // Limitar a llamadas de API (evitar assets, cdn, etc.)
  const isApiCall = !!config?.apiUrl && req.url.startsWith(config.apiUrl);

  let url = req.url;

  if (isDevOrPre && isApiCall) {
    // Añadir trace=true si no está presente
    try {
      const u = new URL(url, window.location.origin);
      // if (!u.searchParams.has('trace')) {
      //   u.searchParams.set('trace', 'true');
      // }
      url = u.toString();
    } catch {
      // Fallback para URLs relativas raras
      const hasQuery = url.includes('?');
      const hasTrace = /([?&])trace=/.test(url);
      if (!hasTrace) {
        url = url + (hasQuery ? '&' : '?') + 'trace=true';
      }
    }
  }

  logger.info('[HTTP Interceptor] Petición interceptada', { url, method: req.method, headers: setHeaders });
  const cloned = req.clone({
    url,
    setHeaders,
  });

  return next(cloned).pipe(
    tap({
      next: (event: any) => {
        logger.debug('[HTTP Interceptor] Respuesta recibida', { url, event });
      },
      error: (err: any) => {
        errorLogger.error('[HTTP Interceptor] Error en petición', { url, error: err });
      }
    })
  );
};
