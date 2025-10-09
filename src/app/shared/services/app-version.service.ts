import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/config/environment';

@Injectable({ providedIn: 'root' })
export class AppVersionService {
    private logger = inject(NGXLogger);
    private http = inject(HttpClient);
    private notifier = inject(NotificationService);

    async checkForUpdates() {

        this.logger.info('[AppVersionService] Comprobando versión de la app...');
        const platform = Capacitor.getPlatform(); // 'ios', 'android', 'web', etc.
        if (typeof platform === 'string' && isNaN(Number(platform))) {
            this.logger.info(`[AppVersionService] Plataforma '${platform}' detectada, usando endpoint /app-versions/latest/${platform} ...`);
            const appInfo = await App.getInfo();
            this.http.get<any>(`${environment.apiUrl}/app-versions/latest/${platform}`).subscribe({
                next: versionInfo => {
                    const latestVersion = versionInfo.version;
                    const downloadUrl = versionInfo.downloadUrl || versionInfo.url;
                    const currentVersion = appInfo.version;
                    if (latestVersion && currentVersion) {
                        const isOutdated = this.isVersionLower(currentVersion, latestVersion);
                        if (isOutdated) {
                            this.logger.warn(`[AppVersionService] Actualización requerida. Versión actual: ${currentVersion}, última: ${latestVersion}`);
                            if (downloadUrl) {
                                this.downloadFile(downloadUrl);
                            } else {
                                this.logger.warn(`[AppVersionService] No se encontró downloadUrl ni url para plataforma '${platform}'.`);
                            }
                        } else {
                            this.logger.info(`[AppVersionService] La app está actualizada. Versión actual: ${currentVersion}, última: ${latestVersion}`);
                        }
                    } else if (downloadUrl) {
                        // Si no hay info de versión, descargar por defecto
                        this.logger.info(`[AppVersionService] No se pudo comparar versiones, descargando por defecto.`);
                        this.downloadFile(downloadUrl);
                    } else {
                        this.logger.warn(`[AppVersionService] No se encontró downloadUrl ni url para plataforma '${platform}'.`);
                    }
                },
                error: err => {
                    this.logger.error(`[AppVersionService] Error al obtener información de versión para plataforma '${platform}':`, err);
                }
            });
            return;
        }
        const appInfo = await App.getInfo();
        this.logger.info('[AppVersionService] Versión actual:', appInfo.version);

        this.http.get<any>(`${environment.apiUrl}/app-versions/${platform}`).subscribe({
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

    private downloadFile(url: string) {
        // Crea un enlace temporal y simula un click para descargar el archivo
        const a = document.createElement('a');
        a.href = url;
        a.download = '';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
