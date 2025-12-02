import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { toastController as coreToastController } from '@ionic/core';
import { ErrorLoggerService } from './error-logger.service';
import { LoggingService } from './logging.service';

export type ToastType = 'success' | 'warning' | 'danger' | 'info';

@Injectable({ providedIn: 'root' })
export class ToastService {
    constructor(
        private toastController: ToastController,
        private errorLogger: ErrorLoggerService,
        private logger: LoggingService
    ) { }

    private mapToastTypeToColor(type: string): string {
        switch (type) {
            case 'success': return 'success';
            case 'warning': return 'warning';
            case 'danger':
            case 'error': return 'danger';
            case 'info':
            default: return 'primary';
        }
    }

    async show(message: string, type: ToastType = 'info', duration = 5000) {
        const options = {
            message,
            duration,
            position: 'middle',
            color: this.mapToastTypeToColor(type),
            cssClass: 'sl-toast'
        } as const;

        this.logger.log('[ToastService] Intentando mostrar toast (Angular)', { options });
        // 1) Angular ToastController
        try {
            const t = await this.toastController.create(options);
            await t.present();
            this.logger.log('[ToastService] Toast mostrado con Angular ToastController', { options });
            return;
        } catch (e) {
            this.logger.warn('[ToastService] Angular ToastController falló, probando core', e);
        }

        this.logger.log('[ToastService] Intentando mostrar toast (Ionic core)', { options });
        // 2) Ionic core toastController
        try {
            const t = await coreToastController.create(options as any);
            await t.present();
            this.logger.log('[ToastService] Toast mostrado con Ionic core', { options });
            return;
        } catch (e) {
            this.logger.warn('[ToastService] Core toastController falló, creando manualmente', e);
        }

        this.logger.log('[ToastService] Intentando mostrar toast manualmente', { options });
        // 3) Manual fallback
        try {
            const el = document.createElement('ion-toast') as HTMLIonToastElement;
            (Object.assign(el, options) as any);
            document.body.appendChild(el);
            await (el as any).present?.();
            this.logger.log('[ToastService] Toast mostrado manualmente', { options });
        } catch (e) {
            this.errorLogger.error('[ToastService] Fallback manual también falló', e);
            alert(message);
        }
    }
}
