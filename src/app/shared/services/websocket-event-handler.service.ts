import { Injectable, effect, inject, untracked } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { WebsocketStateStore } from 'src/app/stores/webscoket.store';
import { Capacitor } from '@capacitor/core';
import { WallSyncService } from './wall-sync.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class WebsocketEventHandlerService {
    private logger = inject(NGXLogger);
    private store = inject(WebsocketStateStore);
    private wallSync = inject(WallSyncService);
    private auth = inject(AuthStore);
    private router = inject(Router);

    private processed = new Set<string>();
    private lastIndex = -1;

    constructor() {
        effect(() => {
            const messages = this.store.messages();

            untracked(() => {
                // 👇 Si el array se vació/encogió (disconnect/reconnect), resetea punteros
                if (this.lastIndex >= messages.length) {
                    this.logger.debug('[WebsocketEventHandler] Reset por shrink: lastIndex', this.lastIndex, '-> -1');
                    this.lastIndex = -1;
                    this.processed.clear();
                }

                for (let i = this.lastIndex + 1; i < messages.length; i++) {
                    const m: any = messages[i];
                    const id = m?.id || `${m?.type}|${m?.message}|${m?.senderId}|${m?.timestamp ?? ''}`;
                    if (this.processed.has(id)) continue;
                    this.processed.add(id);
                    this.handleMessage(m);
                }
                this.lastIndex = messages.length - 1;
            });
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
        const platform = Capacitor.getPlatform();
        if (platform === 'web') {
            window.location.reload();
        } else {
            localStorage.clear();
            this.auth.logout();
            this.router.navigateByUrl('/', { replaceUrl: true });
        }
    }

    private enableMaintenanceMode() {
        this.logger.info('[WebsocketEventHandler] Activando modo mantenimiento...');
    }
}
