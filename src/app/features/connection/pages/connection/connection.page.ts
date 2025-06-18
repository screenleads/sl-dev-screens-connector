import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { WebsocketstompService } from 'src/app/core/services/websocket/websocketstomp.service';
import { DevicesService } from 'src/app/features/loading/services/loading.service';
import { Router } from '@angular/router';
import { ScaButtonComponent } from 'sl-dev-components';
@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ScaButtonComponent]
})
export class ConnectionPage implements OnInit {
  descriptionName = "dispositivo de pruebas";
  constructor(private _router: Router, private _websocketSrv: WebsocketstompService, private _devicesSrv: DevicesService) { }

  ngOnInit() {
    this._websocketSrv.initconnectionSocket();
    this._websocketSrv.joinRoom(this._devicesSrv.getDevice()["uuid"]);
  }

  updateDevice() {
    this._devicesSrv.updateDeviceName(this.descriptionName);
    this._router.navigate(["/advices"]);
  }

}
