// notification.service.ts
import { Injectable, inject } from '@angular/core';
import { ChatMessage } from 'src/app/shared/models/ChatMessage';
import { ToastService, ToastType } from './toast.service';
import { ChatMessageAdapterService } from './chat-message-adapter.service';
import { ErrorLoggerService } from './error-logger.service';
import { LoggingService } from './logging.service';


@Injectable({ providedIn: 'root' })
export class NotificationService {
    private toast = inject(ToastService);
    private chatAdapter = inject(ChatMessageAdapterService);
    private errorLogger = inject(ErrorLoggerService);
    private logger = inject(LoggingService);

    async show(message: string, type: ToastType = 'info', duration = 5000) {
        this.logger.info('[NotificationService] Mostrando notificación', { message, type, duration });
        await this.toast.show(`Sistema: ${message}`, type, duration);
        this.logger.info('[NotificationService] Notificación mostrada', { message, type, duration });
    }

    async showFromChat(msg: ChatMessage) {
        this.logger.debug('[NotificationService] showFromChat iniciado', { msg });
        try {
            const { text, level } = this.chatAdapter.extractToastData(msg);
            this.logger.debug('[NotificationService] showFromChat extraído', { text, level });
            await this.show(text, level);
            this.logger.debug('[NotificationService] showFromChat completado', { text, level });
        } catch (e) {
            this.errorLogger.error('[NotificationService] Error mostrando notificación de chat', { msg, error: e });
        }
    }
}
