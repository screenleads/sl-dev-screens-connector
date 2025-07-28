import { Component, effect } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DevicesService } from './features/loading/services/loading.service';
import { WebsocketstompService } from './core/services/websocket/websocketstomp.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  constructor(private _devicesSrv: DevicesService, private _websocketSrv: WebsocketstompService) {
    effect(() => {
      if (this._devicesSrv.deviceTypes().length > 0) {
        console.log("REGISTRA EL DISPOSITIVO");
        this._devicesSrv.registerDevice();
      }
    })

  }

  ngOnInit() {
    this._devicesSrv.getDeviceTypes();
  }
}
