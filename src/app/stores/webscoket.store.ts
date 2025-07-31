import { Injectable, signal, WritableSignal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebsocketStateStore {
  private connected: WritableSignal<boolean> = signal(false);
  private room: WritableSignal<string | null> = signal(null);

  readonly isConnected = computed(() => this.connected());
  readonly currentRoom = computed(() => this.room());

  setConnectionStatus(status: boolean) {
    this.connected.set(status);
  }

  setRoom(roomId: string) {
    this.room.set(roomId);
  }

  reset() {
    this.connected.set(false);
    this.room.set(null);
  }
}
