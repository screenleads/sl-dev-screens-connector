import { Injectable, signal, computed, WritableSignal, inject } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NGXLogger } from 'ngx-logger';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { ChatMessage } from 'src/app/shared/models/ChatMessage';
import { AuthStore } from './auth.store';


@Injectable({ providedIn: 'root' })
export class WebsocketStateStore {
  private _connected: WritableSignal<boolean> = signal(false);
  private _room: WritableSignal<string | null> = signal(null);
  private _messages: WritableSignal<ChatMessage[]> = signal([]);

  readonly isConnected = computed(() => this._connected());
  readonly currentRoom = computed(() => this._room());
  readonly messages = computed(() => this._messages());

  private config = inject(APP_CONFIG);
  private logger = inject(NGXLogger);
  private authStore = inject(AuthStore);

  private stompClient: any;
  private socketUrl = `https://${this.config.apiHost}/chat-socket`;

  connect(roomId: string) {
    this.logger.debug(`[WebsocketStore] Conectando a ${this.socketUrl} para la sala ${roomId}`);
    this._room.set(roomId);

    const token = this.authStore.token;
    if (!token) {
      this.logger.error('[WebsocketStore] No se pudo conectar: no hay token JWT');
      return;
    }

    const socket = new SockJS(this.socketUrl);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      {
        Authorization: `Bearer ${token}`, // Cabecera personalizada con JWT
      },
      () => {
        this._connected.set(true);
        this.logger.info(`[WebsocketStore] Conectado a la sala ${roomId}`);
        this.subscribeToRoom(roomId);
      },
      (error: any) => {
        this._connected.set(false);
        this.logger.error('[WebsocketStore] Error de conexión', error);
      }
    );
  }

  private subscribeToRoom(roomId: string) {
    this.stompClient.subscribe(`/topic/${roomId}`, (msg: any) => {
      const message: ChatMessage = JSON.parse(msg.body);
      this.logger.info('[WebsocketStore] Mensaje recibido:', message);
      this._messages.update(prev => [...prev, message]);
    });
  }

  sendMessage(message: ChatMessage) {
    const roomId = this._room();
    const token = this.authStore.token;

    if (this.stompClient && this._connected() && roomId) {
      this.stompClient.send(
        `/app/chat/${roomId}`,
        {
          Authorization: `Bearer ${token}`, // También en el envío, si tu backend lo requiere
        },
        JSON.stringify(message)
      );
      this.logger.debug('[WebsocketStore] Mensaje enviado:', message);
    } else {
      this.logger.warn('[WebsocketStore] No conectado. Mensaje no enviado');
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        this._connected.set(false);
        this._room.set(null);
        this._messages.set([]);
        this.logger.warn('[WebsocketStore] Desconectado del socket');
      });
    }
  }
}
