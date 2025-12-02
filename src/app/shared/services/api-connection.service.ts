import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { ErrorLoggerService } from './error-logger.service';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class ApiConnectionService {
    private http = inject(HttpClient);
    private config = inject(APP_CONFIG) as {
        apiUrl?: string;
        apiHost?: string;
    };
    private errorLogger = inject(ErrorLoggerService);
    private logger = inject(LoggingService);

    // Construye la URL base usando apiUrl o apiHost
    private buildUrl(path: string): string {
        let base = '';
        if (this.config?.apiUrl) {
            base = this.config.apiUrl;
        } else if (this.config?.apiHost) {
            base = this.config.apiHost.startsWith('http')
                ? this.config.apiHost
                : `https://${this.config.apiHost}`;
        } else {
            const errorMsg = 'No API base URL configurada';
            this.errorLogger.error(errorMsg, { config: this.config } as any);
            throw new Error(errorMsg);
        }
        return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    }

    // GET genérico
    get<T>(path: string) {
        this.logger.log('[ApiConnectionService] GET', { path });
        const url = this.buildUrl(path);
        return this.http.get<T>(url);
    }

    // POST genérico
    post<T>(path: string, body: any) {
        this.logger.log('[ApiConnectionService] POST', { path, body });
        const url = this.buildUrl(path);
        return this.http.post<T>(url, body);
    }

    // PUT genérico
    put<T>(path: string, body: any) {
        this.logger.log('[ApiConnectionService] PUT', { path, body });
        const url = this.buildUrl(path);
        return this.http.put<T>(url, body);
    }

    // DELETE genérico
    delete<T>(path: string) {
        this.logger.log('[ApiConnectionService] DELETE', { path });
        const url = this.buildUrl(path);
        return this.http.delete<T>(url);
    }

    // Parseo seguro de JSON
    safeJsonParse<T>(input: string): T | null {
        try {
            return JSON.parse(input);
        } catch (e) {
            this.errorLogger.error('Error parseando JSON', { input, error: e });
            return null;
        }
    }
}
