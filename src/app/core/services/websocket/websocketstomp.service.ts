import { Injectable, inject } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NGXLogger } from 'ngx-logger';

import { ChatMessage } from 'src/app/shared/models/ChatMessage';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { WebsocketStateStore } from 'src/app/stores/webscoket.store';

@Injectable({ providedIn: 'root' })
export class WebsocketStompService {
  private stompClient: any;
  private roomId: string = '';

  private logger = inject(NGXLogger);
  private store = inject(WebsocketStateStore);
  private config = inject(APP_CONFIG);

  private socketUrl = `//${this.config.apiHost}/chat-socket`;

  connect(roomId: string) {
    this.roomId = roomId;
    this.store.setRoom(roomId);
    this.logger.debug(`[WebSocket] Conectando a ${this.socketUrl}`);
  }

  joinRoom() {
    const socket = new SockJS(this.socketUrl);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      this.logger.info(`[WebSocket] Conectado al room ${this.roomId}`);
      this.store.setConnectionStatus(true);

      this.stompClient.subscribe(`/topic/${this.roomId}`, (msg: any) => {
        const message = JSON.parse(msg.body);
        this.logger.debug('[WebSocket] Mensaje recibido:', message);
      });
    }, (error: any) => {
      this.logger.error('[WebSocket] Error de conexión', error);
    });
  }

  sendMessage(roomId: string, message: ChatMessage) {
    if (this.stompClient && this.store.isConnected()) {
      this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(message));
      this.logger.debug('[WebSocket] Mensaje enviado:', message);
    } else {
      this.logger.warn('[WebSocket] No conectado. Mensaje no enviado.');
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        this.logger.warn('[WebSocket] Desconectado del socket');
        this.store.reset();
      });
    }
  }
}
