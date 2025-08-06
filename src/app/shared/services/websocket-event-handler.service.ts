// websocket-event-handler.service.ts
import { Injectable, effect, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { WebsocketStateStore } from 'src/app/stores/webscoket.store';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { ChatMessage } from '../models/ChatMessage';
import { NotificationService } from './notification.service';
import { WallSyncService } from './wall-sync.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class WebsocketEventHandlerService {
    private logger = inject(NGXLogger);
    private store = inject(WebsocketStateStore);
    private notifier = inject(NotificationService);
    private wallSync = inject(WallSyncService);
    private auth = inject(AuthStore);
    private router = inject(Router);
    constructor() {
        // Escuchar cambios en los mensajes
        effect(() => {
            this.logger.info('[WebsocketEventHandler] Mensaje recibido en el servicio');
            const messages = this.store.messages();
            const last = messages[messages.length - 1];
            if (last) this.handleMessage(last);
        });
    }

    private handleMessage(message: any) {

        this.logger.info('[WebsocketEventHandler] Mensaje recibido:', message);
        if (!message || !message.type) return;


        switch (message.type) {
            case 'REFRESH_ADS':
                this.refreshAds();
                break;
            case 'RESTART_APP':
                this.restartApplication();
                break;
            case 'MAINTENANCE_MODE':
                this.enableMaintenanceMode();
                break;
            case 'NOTIFY':
                this.showNotification(message);
                break;
            default:
                this.logger.warn('[WebsocketEventHandler] Tipo de mensaje desconocido:', message.type);
                break;
        }
    }

    private refreshAds() {
        this.logger.info('[WebsocketEventHandler] Refrescando anuncios...');
        this.wallSync.triggerRefresh();
    }

    private restartApplication() {
        this.logger.info('[WebsocketEventHandler] Reiniciando aplicación...');

        const platform = Capacitor.getPlatform();
        if (platform === 'web') {
            this.logger.info('[WebsocketEventHandler] Plataforma: web – recargando página');
            window.location.reload();
        } else {
            this.logger.info(`[WebsocketEventHandler] Plataforma: ${platform} – cerrando app`);
            // App.exitApp(); // ⚠️ solo funciona en apps nativas
            localStorage.clear();
            this.auth.logout();
            this.router.navigateByUrl('/', { replaceUrl: true });
        }
    }

    private enableMaintenanceMode() {
        this.logger.info('[WebsocketEventHandler] Activando modo mantenimiento...');
        // Lógica para mostrar modal o bloquear uso
        // e.g. this.maintenanceService.activate()
    }

    private showNotification(message: ChatMessage) {
        this.logger.info('[WebsocketEventHandler] Notificación:', message.message);
        // Mostrar un snackbar, toast, etc.
        this.notifier.showFromChat(message);
    }
}
