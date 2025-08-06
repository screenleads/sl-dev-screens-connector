import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ChatMessage } from 'src/app/shared/models/ChatMessage';

export type ToastType = 'success' | 'warning' | 'danger' | 'info';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private toastController = inject(ToastController);

    async show(message: string, type: ToastType = 'info', duration = 50000) {
        message = `Sistema : ${message}`;
        const toast = await this.toastController.create({
            message,
            duration,
            position: 'top',
            // color: this.mapToastTypeToColor(type),
            buttons: [],
            cssClass: 'sl-toast'
        });
        await toast.present();
    }

    async showFromChat(message: ChatMessage) {
        const msgText = message?.message || 'Mensaje recibido';
        const type = message.metadata["type"] || 'info';
        await this.show(msgText, type);
    }

    private mapToastTypeToColor(type: string): string {
        switch (type) {
            case 'success':
                return 'success';
            case 'warning':
                return 'warning';
            case 'danger':
            case 'error':
                return 'danger';
            default:
                return 'primary'; // fallback
        }
    }
}
