import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { WebsocketstompService } from 'src/app/core/services/websocket/websocketstomp.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ConnectionPage implements OnInit {

  constructor(private _websocketSrv: WebsocketstompService) { }

  ngOnInit() {
    this._websocketSrv.initconnectionSocket
  }

}
