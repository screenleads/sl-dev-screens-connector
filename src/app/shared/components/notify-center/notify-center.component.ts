import { Component, effect, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { WebsocketStateStore } from 'src/app/stores/webscoket.store';
import { ChatMessage } from 'src/app/shared/models/ChatMessage';
import { NGXLogger } from 'ngx-logger';

type Level = 'success' | 'warning' | 'danger' | 'info';

interface NotifyItem {
  id: number;
  text: string;
  level: Level;
  createdAt: number;
}

@Component({
  selector: 'app-notify-center',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './notify-center.component.html',
  styleUrls: ['./notify-center.component.scss']
})
export class NotifyCenterComponent {
  private store = inject(WebsocketStateStore);
  private logger = inject(NGXLogger);

  items = signal<NotifyItem[]>([]);
  private seq = 0;

  constructor() {
    // Reacciona al último mensaje recibido y si es NOTIFY lo pinta
    effect(() => {
      const messages = this.store.messages();
      const last = messages[messages.length - 1];
      if (!last) return;
      if ((last as any).type === 'NOTIFY') {
        this.pushFromChat(last);
      }
    });
  }

  private pushFromChat(msg: ChatMessage) {
    const text = (msg as any).message ?? 'Notificación';
    const meta = (msg as any).metadata ?? {};
    const level: Level = (meta.level as Level) ?? 'info';
    this.push(text, level);
  }

  push(text: string, level: Level = 'info') {
    const id = ++this.seq;
    const item: NotifyItem = { id, text, level, createdAt: Date.now() };
    this.items.update(list => [item, ...list]);
    // Auto dismiss
    setTimeout(() => this.dismiss(id), 5000);
    this.logger.debug('[NotifyCenter] push', item);
  }

  dismiss(id: number) {
    this.items.update(list => list.filter(i => i.id !== id));
  }

  classFor(level: Level) {
    switch (level) {
      case 'success': return 'notify-item success';
      case 'warning': return 'notify-item warning';
      case 'danger': return 'notify-item danger';
      default: return 'notify-item info';
    }
  }
}
