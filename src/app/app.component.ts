import { Component, effect, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DeviceStore } from './stores/device.store';
import { WebsocketStateStore } from './stores/webscoket.store';
import { AuthStore } from './stores/auth.store';
import { WebsocketEventHandlerService } from './shared/services/websocket-event-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private deviceStore = inject(DeviceStore);
  private authStore = inject(AuthStore);
  private wsStore = inject(WebsocketStateStore);

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
}

