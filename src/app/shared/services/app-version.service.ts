import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { Capacitor } from '@capacitor/core';
// import { App } from '@capacitor/app';
import { APP_VERSION } from '../../../environments/version';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/config/environment';
import { Device } from '@capacitor/device';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Permissions } from '@capacitor/permissions';

@Injectable({ providedIn: 'root' })
export class AppVersionService {
    private logger = inject(NGXLogger);
    private http = inject(HttpClient);
    private notifier = inject(NotificationService);

    async checkForUpdates() {
        this.logger.info('[AppVersionService] Comprobando versión de la app...');
        const platform = Capacitor.getPlatform();
        const deviceInfo = await Device.getInfo();

        if (platform === 'android' && deviceInfo.model?.toLowerCase().includes('tv')) {
            this.logger.info('[AppVersionService] Dispositivo detectado: Smart TV con Android.');
        }

        if (await this.checkAndRequestPermissions()) {
            this.logger.info('[AppVersionService] Permisos concedidos.');
        } else {
            this.logger.warn('[AppVersionService] Permisos denegados. No se puede proceder con la descarga.');
            return;
        }

        if (typeof platform === 'string' && isNaN(Number(platform))) {
            this.logger.info(`[AppVersionService] Plataforma '${platform}' detectada, usando endpoint /app-versions/latest/${platform} ...`);
            this.http.get<any>(`${environment.apiUrl}/app-versions/latest/${platform}`).subscribe({
                next: versionInfo => {
                    const latestVersion = versionInfo.version;
                    const downloadUrl = versionInfo.downloadUrl || versionInfo.url;
                    const forceUpdate = !!versionInfo.forceUpdate;
                    this.logger.info(`[AppVersionService] currentVersion: ${currentVersion}, latestVersion: ${latestVersion}, forceUpdate: ${forceUpdate}, downloadUrl: ${downloadUrl}`);
                    if (latestVersion && currentVersion) {
                        const isOutdated = this.isVersionLower(currentVersion, latestVersion);
                        if (isOutdated) {
                            this.logger.warn(`[AppVersionService] Actualización requerida. Versión actual: ${currentVersion}, última: ${latestVersion}`);
                            if (downloadUrl) {
                                if (forceUpdate) {
                                    this.notifier.showForceUpdate(downloadUrl, versionInfo.message || undefined);
                                } else {
                                    this.notifier.showOptionalUpdate(downloadUrl, versionInfo.message || undefined);
                                }
                            } else {
                                this.logger.warn(`[AppVersionService] No se encontró downloadUrl ni url para plataforma '${platform}'.`);
                            }
                        } else {
                            this.logger.info(`[AppVersionService] La app está actualizada. Versión actual: ${currentVersion}, última: ${latestVersion}`);
                        }
                    } else if (downloadUrl) {
                        // Si no hay info de versión, mostrar modal por defecto
                        this.logger.info(`[AppVersionService] No se pudo comparar versiones, mostrando modal de descarga por defecto.`);
                        this.notifier.showOptionalUpdate(downloadUrl, versionInfo.message || undefined);
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
        this.logger.info('[AppVersionService] Versión actual:', currentVersion);

        this.http.get<any>(`${environment.apiUrl}/app-versions/${platform}`).subscribe({
            next: versionInfo => {
                const minVersion = versionInfo.minVersion;
                const latestVersion = versionInfo.latestVersion;
                const downloadUrl = versionInfo.downloadUrl;
                const forceUpdate = !!versionInfo.forceUpdate;
                this.logger.info(`[AppVersionService] currentVersion: ${currentVersion}, minVersion: ${minVersion}, latestVersion: ${latestVersion}, forceUpdate: ${forceUpdate}, downloadUrl: ${downloadUrl}`);
                const isOutdated = this.isVersionLower(currentVersion, minVersion);
                const hasUpdate = this.isVersionLower(currentVersion, latestVersion);

                if (isOutdated) {
                    this.logger.warn('[AppVersionService] Actualización forzada requerida.');
                    this.notifier.showForceUpdate(downloadUrl, versionInfo.message || undefined);
                } else if (hasUpdate) {
                    this.logger.info('[AppVersionService] Hay una versión nueva disponible.');
                    this.notifier.showOptionalUpdate(downloadUrl, versionInfo.message || undefined);
                } else {
                    this.logger.info('[AppVersionService] La app está actualizada.');
                }
            },
            error: err => {
                this.logger.error('[AppVersionService] Error al comprobar versión:', err);
            }
        });
    }

    private async checkAndRequestPermissions(): Promise<boolean> {
        try {
            const status = await Permissions.query({ name: 'filesystem' });
            if (status.state !== 'granted') {
                const requestStatus = await Permissions.request({ name: 'filesystem' });
                return requestStatus.state === 'granted';
            }
            return true;
        } catch (error) {
            this.logger.error('[AppVersionService] Error al comprobar o solicitar permisos:', error);
            return false;
        }
    }

    private async downloadFile(url: string) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64data = reader.result as string;
                const fileName = url.split('/').pop() || 'update.apk';

                await Filesystem.writeFile({
                    path: fileName,
                    data: base64data.split(',')[1], // Remove the base64 prefix
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8
                });

                this.logger.info(`[AppVersionService] Archivo descargado y guardado como ${fileName}`);
            };

            reader.readAsDataURL(blob);
        } catch (error) {
            this.logger.error('[AppVersionService] Error al descargar el archivo:', error);
        }
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
