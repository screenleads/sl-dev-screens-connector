import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { WebsocketService } from '../core/services/websocket/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent],
})
export class HomePage {
  constructor(private _websocketSrv: WebsocketService) {
    _websocketSrv.connect();
  }
}
