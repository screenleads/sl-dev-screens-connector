// notification.service.ts
import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NotificationUpdateModalComponent } from 'src/app/shared/components/notification-update-modal.component';
import { toastController as coreToastController } from '@ionic/core';
import { ChatMessage } from 'src/app/shared/models/ChatMessage';

export type ToastType = 'success' | 'warning' | 'danger' | 'info';


@Injectable({ providedIn: 'root' })
export class NotificationService {
    constructor(
        private toastController: ToastController
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
            message: `Sistema: ${message}`,
            duration,
            position: 'middle',                 // en tablet es lo más fiable
            color: this.mapToastTypeToColor(type),
            cssClass: 'sl-toast'
        } as const;

        // 1) Intento con Angular ToastController
        try {
            const t = await this.toastController.create(options);
            await t.present();
            return;
        } catch (e) {
            console.warn('[NotificationService] Angular ToastController falló, probando core', e);
        }

        // 2) Intento con @ionic/core toastController
        try {
            const t = await coreToastController.create(options as any);
            await t.present();
            return;
        } catch (e) {
            console.warn('[NotificationService] Core toastController falló, creando manualmente', e);
        }

        // 3) Intento MANUAL: crear <ion-toast> y presentarlo
        try {
            // Asegura que el custom element existe

            const el = document.createElement('ion-toast') as HTMLIonToastElement;
            (Object.assign(el, options) as any);
            document.body.appendChild(el);
            await (el as any).present?.();
        } catch (e) {
            console.error('[NotificationService] Fallback manual también falló', e);
            alert(`Sistema: ${message}`); // último recurso para no perder la notificación
        }
    }

    async showFromChat(msg: ChatMessage) {
        const meta: any = (msg && typeof msg === 'object' && msg.metadata) ? msg.metadata : {};
        const level = (meta.level || meta.type || 'info') as ToastType;
        const raw = (msg as any)?.message ?? '';

        // Si algún día te llega JSON en message, lo soportamos
        let parsed: any = null;
        if (typeof raw === 'string') {
            try { parsed = JSON.parse(raw); } catch { parsed = null; }
        }

        const text =
            (typeof meta?.text === 'string' && meta.text) ? meta.text :
                (parsed && typeof parsed.text === 'string') ? parsed.text :
                    (typeof raw === 'string' && raw) ? raw :
                        'Mensaje recibido';

        console.debug('[NotificationService] showFromChat', { text, level, meta });
        await this.show(String(text), level);
    }

}
