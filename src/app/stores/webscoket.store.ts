import { Injectable, signal, computed, WritableSignal, inject } from '@angular/core';
import { Stomp, Client, StompSubscription, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ErrorLoggerService } from 'src/app/shared/services/error-logger.service';
import { LoggingService } from 'src/app/shared/services/logging.service';
// ...existing code...
import { ApiConnectionService } from 'src/app/shared/services/api-connection.service';
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

  private api = inject(ApiConnectionService);
  private errorLogger = inject(ErrorLoggerService);
  private logger = inject(LoggingService);
  private authStore = inject(AuthStore);

  private stompClient: any | null = null;
  private roomSub: StompSubscription | null = null;
  private socketUrl = `https://${(this.api as any).config.apiHost}/chat-socket`;
  private intendedRoom: string | null = null; // para re-suscripciones

  connect(roomId: string) {
    this.logger.log('[WebsocketStore] Solicitud de conexión', { socketUrl: this.socketUrl, roomId });
    const token = this.authStore.token;
    if (!token) {
      this.errorLogger.error('[WebsocketStore] No se pudo conectar: no hay token JWT');
      return;
    }

    // ✅ Idempotencia: si ya estamos conectados a esta misma sala, no hagas nada
    if (this.stompClient?.connected && this._connected() && this._room() === roomId) {
      this.logger.log('[WebsocketStore] Ya conectado a la misma sala. Ignorando.');
      return;
    }

    // Si hay un cliente previo (otra sala o reconexión), ciérralo limpio
    if (this.stompClient) {
      this.logger.log('[WebsocketStore] Había un cliente previo. Cerrando antes de reconectar.');
      try { this.roomSub?.unsubscribe(); } catch { }
      this.roomSub = null;
      try { this.stompClient.deactivate(); } catch { }
      this.stompClient = null;
      this._connected.set(false);
    }

    this.intendedRoom = roomId;
    this._room.set(roomId);

    // Crea el cliente SockJS + STOMP
    const sock = new SockJS(this.socketUrl);
    const client = Stomp.over(sock);
    // Opcional: silenciar logs de debug en prod
    // client.debug = (msg) => this.logger.debug('[STOMP]', msg);

    // Heartbeats (opcional)
    client.heartbeatIncoming = 10000;
    client.heartbeatOutgoing = 10000;

    // Conecta
    client.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        this.stompClient = client;
        this._connected.set(true);
        this.logger.log('[WebsocketStore] Conectado', { session: (client as any)?.sessionId ?? 'n/a' });

        // Re-suscribe de forma segura/idempotente a la sala actual
        if (this.intendedRoom) {
          this.subscribeToRoom(this.intendedRoom);
        }
      },
      (error: any) => {
        this._connected.set(false);
        this.errorLogger.error('[WebsocketStore] Error de conexión', error);
      }
    );
  }

  private subscribeToRoom(roomId: string) {
    if (!this.stompClient?.connected) {
      this.logger.log('[WebsocketStore] subscribeToRoom llamado sin conexión.');
      return;
    }

    if (this.roomSub) {
      try { this.roomSub.unsubscribe(); } catch { }
      this.roomSub = null;
    }

    const topic = `/topic/${roomId}`;
    this.roomSub = this.stompClient.subscribe(topic, (msg: IMessage) => {
      try {
        const raw: any = this.api.safeJsonParse(msg.body);
        if (!raw) throw new Error('JSON inválido');

        // Fallback de id si el backend aún no lo pone
        raw.id ||= `${raw.type}|${raw.message}|${raw.senderId}|${raw.timestamp ?? ''}`;

        // ✅ NO volver a JSON.parse: ya es objeto
        // Opción A: tipado directo
        // const message = raw as ChatMessage;

        // Opción B (recomendada si tu clase tiene getters/setters):
        const message = new ChatMessage(raw);

        this.logger.log('[WebsocketStore] Mensaje recibido', { message });
        this._messages.update(prev => [...prev, message]);
      } catch (e) {
        this.errorLogger.error('[WebsocketStore] Error parseando mensaje STOMP', e);
      }
    });

    this.logger.log('[WebsocketStore] Suscrito a', { topic, id: this.roomSub?.id });
  }


  sendMessage(message: ChatMessage) {
    const roomId = this._room();
    const token = this.authStore.token;

    if (this.stompClient?.connected && this._connected() && roomId) {
      this.stompClient.send(
        `/app/chat/${roomId}`,
        { Authorization: `Bearer ${token}` },
        JSON.stringify(message)
      );
      this.logger.log('[WebsocketStore] Mensaje enviado', { message });
    } else {
      this.logger.log('[WebsocketStore] No conectado. Mensaje no enviado');
    }
  }

  disconnect() {
    try { this.roomSub?.unsubscribe(); } catch { }
    this.roomSub = null;

    if (this.stompClient) {
      this.stompClient.deactivate?.();
      this.stompClient = null;
    }
    this._connected.set(false);
    this._room.set(null);
    this._messages.set([]);
    this.logger.log('[WebsocketStore] Desconectado del socket');
  }
}
