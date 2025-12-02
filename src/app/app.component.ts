import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DeviceStore } from './stores/device.store';
import { WebsocketStateStore } from './stores/webscoket.store';
import { AuthStore } from './stores/auth.store';
import { WebsocketEventHandlerService } from './shared/services/websocket-event-handler.service';
import { NotifyCenterComponent } from './shared/components/notify-center/notify-center.component';
import { SHARED_MODALS } from './shared/shared-modals';
import { AppVersion } from './shared/models/AppVersion';
// import { NotificationService } from './shared/services/notification.service';
import { Capacitor } from '@capacitor/core';
import { APP_VERSION } from '../environments/version';
import { environment } from '../environments/config/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet, NotifyCenterComponent, ...SHARED_MODALS],
})
export class AppComponent implements OnInit {
  private deviceStore = inject(DeviceStore);
  private authStore = inject(AuthStore);
  private wsStore = inject(WebsocketStateStore);
  // private notificationService = inject(NotificationService);
  private http = inject(HttpClient);
  private logger = inject(NGXLogger);
  isTV = false;

  showUpdateModal: boolean = false;
  updateInfo: AppVersion | null = null;

  ngOnInit() {
    this.isTV = this.detectIfTV();
  }

  private checkForUpdates() {
    const platform = Capacitor.getPlatform();
    const currentVersion = APP_VERSION;
    this.logger.info(`[UpdateCheck] Plataforma detectada: ${platform}, versión actual: ${currentVersion}`);
    if (typeof platform === 'string' && isNaN(Number(platform))) {
      const url = `${environment.apiUrl}/app-versions/latest/${platform}`;
      this.logger.debug(`[UpdateCheck] Consultando API de versiones: ${url}`);
      this.http.get<AppVersion>(url).subscribe({
        next: (versionInfo: AppVersion) => {
          this.logger.debug('[UpdateCheck] Respuesta de la API:', versionInfo);
          const latestVersion = versionInfo.version;
          const downloadUrl = versionInfo.url;
          const forceUpdate = !!versionInfo.forceUpdate;
          this.logger.info(`[UpdateCheck] Última versión disponible: ${latestVersion}, forceUpdate: ${forceUpdate}`);
          if (latestVersion && currentVersion) {
            const isOutdated = this.isVersionLower(currentVersion, latestVersion);
            this.logger.info(`[UpdateCheck] ¿Está desactualizada? ${isOutdated}`);
            if (isOutdated && downloadUrl) {
              this.logger.warn('[UpdateCheck] Mostrando modal de actualización');
              this.updateInfo = versionInfo;
              this.showUpdateModal = true;
            }
          } else if (downloadUrl) {
            this.logger.warn('[UpdateCheck] No se pudo comparar versiones, pero hay URL de descarga. Mostrando modal.');
            this.updateInfo = versionInfo;
            this.showUpdateModal = true;
          }
        },
        error: err => {
          this.logger.error('[UpdateCheck] Error al consultar la API de versiones', err);
        }
      });
    } else {
      this.logger.warn('[UpdateCheck] Plataforma no válida para comprobación de versiones:', platform);
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
  constructor(websocketEvents: WebsocketEventHandlerService) {
    // Este efecto se ejecuta al iniciar y observa cambios en los tipos de dispositivo
    effect(() => {
      const types = this.deviceStore.deviceTypes();
      const isRegistered = this.deviceStore.isRegistered();
      if (types.length > 0 && !isRegistered) {
        this.deviceStore.registerDevice();
      }
    });
    effect(() => {
      if (this.authStore.isLoggedIn() && this.deviceStore.device()) {
        this.wsStore.connect(this.deviceStore.device()!.uuid);
      } else {
        this.wsStore.disconnect();
      }
    });
    // Effect para comprobar updates tras login
    effect(() => {
      const logged = this.authStore.isLoggedIn();
      this.logger.debug(`[UpdateCheck] Effect ejecutado. ¿Logado?: ${logged}`);
      if (logged) {
        this.checkForUpdates();
      }
    });
  }

  private detectIfTV(): boolean {
    // Detección por userAgent común en Smart TVs (LG, Samsung, Android TV, etc.)
    const userAgent = navigator.userAgent.toLowerCase();
    const tvKeywords = ['smart-tv', 'smarttv', 'appletv', 'googletv', 'hbbtv', 'netcast', 'viera', 'aquos', 'dtv', 'roku', 'aft', 'tv'];

    return tvKeywords.some(keyword => userAgent.includes(keyword));
  }
}

