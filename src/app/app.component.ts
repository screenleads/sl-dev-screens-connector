import { Component, effect, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DeviceStore } from './stores/device.store';
import { WebsocketStateStore } from './stores/webscoket.store';
import { AuthStore } from './stores/auth.store';
import { WebsocketEventHandlerService } from './shared/services/websocket-event-handler.service';
import { NotifyCenterComponent } from './shared/components/notify-center/notify-center.component';
import { AppVersionService } from './shared/services/app-version.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, NotifyCenterComponent],
})
export class AppComponent implements OnInit {
  private deviceStore = inject(DeviceStore);
  private authStore = inject(AuthStore);
  private wsStore = inject(WebsocketStateStore);
  private appVersionService = inject(AppVersionService);
  isTV = false;

  ngOnInit() {
    this.isTV = this.detectIfTV();

  }
  constructor(websocketEvents: WebsocketEventHandlerService) {
    // Este efecto se ejecuta al iniciar y observa cambios en los tipos de dispositivo
    effect(() => {
      const types = this.deviceStore.deviceTypes();
      const isRegistered = this.deviceStore.isRegistered();

      if (types.length > 0 && !isRegistered) {
        this.deviceStore.registerDevice();
      }
    });
    effect(() => {
      if (this.authStore.isLoggedIn()) {
        this.wsStore.connect(this.deviceStore.device().uuid);
      } else {
        this.wsStore.disconnect();
      }

    });
  }

  private detectIfTV(): boolean {
    // Detección por userAgent común en Smart TVs (LG, Samsung, Android TV, etc.)
    const userAgent = navigator.userAgent.toLowerCase();
    const tvKeywords = ['smart-tv', 'smarttv', 'appletv', 'googletv', 'hbbtv', 'netcast', 'viera', 'aquos', 'dtv', 'roku', 'aft', 'tv'];

    return tvKeywords.some(keyword => userAgent.includes(keyword));
  }
}

