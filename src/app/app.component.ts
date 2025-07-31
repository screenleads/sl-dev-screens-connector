import { Component, effect, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DevicesService } from './features/loading/services/loading.service';
import { WebsocketStompService } from './core/services/websocket/websocketstomp.service';
import { WebsocketStateStore } from './stores/webscoket.store';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  private deviceService = inject(DevicesService);

  constructor() {
    effect(() => {
      if (this.deviceService.getDeviceTypes().length > 0 && !this.deviceService.getIsRegisteredDevice()) {
        console.log('[AppComponent] Registrando dispositivo...');
        this.deviceService.registerDevice();
      }
    });
  }

  ngOnInit() {
    this.deviceService.fetchDeviceTypes();
  }
}
