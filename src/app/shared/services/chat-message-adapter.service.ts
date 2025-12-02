import { Injectable, inject } from '@angular/core';
import { ChatMessage } from 'src/app/shared/models/ChatMessage';
import { ChatMessageMetadata } from 'src/app/shared/models/ChatMessageMetadata';
import { ToastType } from './toast.service';
import { ErrorLoggerService } from './error-logger.service';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class ChatMessageAdapterService {
    private errorLogger = inject(ErrorLoggerService);
    private logger = inject(LoggingService);

    extractToastData(msg: ChatMessage): { text: string, level: ToastType } {
        this.logger.log('[ChatMessageAdapterService] Adaptando mensaje de chat', { msg });
        const meta: ChatMessageMetadata = (msg && typeof msg === 'object' && msg.metadata) ? msg.metadata as ChatMessageMetadata : {};
        const level = (meta.level || meta.type || 'info') as ToastType;
        const raw = msg?.message ?? '';

        let parsed: Partial<{ text: string }> | null = null;
        if (typeof raw === 'string') {
            try {
                parsed = JSON.parse(raw);
                this.logger.log('[ChatMessageAdapterService] Mensaje de chat parseado correctamente', { raw, parsed });
            } catch (e) {
                parsed = null;
                this.errorLogger.error('Error parseando mensaje de chat', { raw, error: e });
            }
        }

        const text =
            (typeof meta?.text === 'string' && meta.text) ? meta.text :
                (parsed && typeof parsed.text === 'string') ? parsed.text :
                    (typeof raw === 'string' && raw) ? raw : '';
        this.logger.log('[ChatMessageAdapterService] Resultado de adaptación', { text, level });
        return { text, level };
    }
}
