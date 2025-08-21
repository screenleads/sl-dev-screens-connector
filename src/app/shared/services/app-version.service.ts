import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AppVersionService {
    private logger = inject(NGXLogger);
    private http = inject(HttpClient);
    private notifier = inject(NotificationService);

    async checkForUpdates() {
        const platform = Capacitor.getPlatform();
        const appInfo = await App.getInfo();
        this.logger.info('[AppVersionService] Versión actual:', appInfo.version);

        this.http.get<any>(`https://TU_BACKEND_URL/api/app-version/${platform}`).subscribe({
            next: versionInfo => {
                const currentVersion = appInfo.version;
                const minVersion = versionInfo.minVersion;
                const latestVersion = versionInfo.latestVersion;
                const downloadUrl = versionInfo.downloadUrl;

                const isOutdated = this.isVersionLower(currentVersion, minVersion);
                const hasUpdate = this.isVersionLower(currentVersion, latestVersion);

                if (isOutdated) {
                    this.logger.warn('[AppVersionService] Actualización forzada requerida.');
                    this.notifier.showForceUpdate(downloadUrl);
                } else if (hasUpdate) {
                    this.logger.info('[AppVersionService] Hay una versión nueva disponible.');
                    this.notifier.showOptionalUpdate(downloadUrl);
                } else {
                    this.logger.info('[AppVersionService] La app está actualizada.');
                }
            },
            error: err => {
                this.logger.error('[AppVersionService] Error al comprobar versión:', err);
            }
        });
    }

    private isVersionLower(current: string, target: string): boolean {
        const c = current.split('.').map(Number);
        const t = target.split('.').map(Number);
        for (let i = 0; i < Math.max(c.length, t.length); i++) {
            const a = c[i] || 0;
            const b = t[i] || 0;
            if (a < b) return true;
            if (a > b) return false;
        }
        return false;
    }
}
