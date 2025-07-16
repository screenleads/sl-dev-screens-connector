import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { WebsocketstompService } from 'src/app/core/services/websocket/websocketstomp.service';
import { DevicesService } from 'src/app/features/loading/services/loading.service';
import { Router } from '@angular/router';
import { SlButtonComponent, SlIconComponent, SlModuleTitleComponent, SlTextFieldModule } from 'sl-dev-components';
import { Filesystem } from '@capacitor/filesystem';
@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, SlButtonComponent, SlTextFieldModule, SlIconComponent, SlModuleTitleComponent]
})
export class ConnectionPage implements OnInit {
  descriptionName = "";
  constructor(private _router: Router, private _websocketSrv: WebsocketstompService, private _devicesSrv: DevicesService) { }

  async ngOnInit() {
    await this.requestFilesystemPermissions();
    this.descriptionName = this._devicesSrv.getDevice().descriptionName;
    // luego tu lógica actual
  }
  async requestFilesystemPermissions(): Promise<void> {
    try {
      const result = await Filesystem.requestPermissions();

      if (result.publicStorage === 'granted') {
        console.log('✅ Permisos de almacenamiento concedidos');
      } else {
        console.warn('❌ Permisos de almacenamiento denegados');
      }
    } catch (error) {
      console.error('❌ Error al solicitar permisos:', error);
    }
  }
  updateDevice() {
    this._devicesSrv.updateDeviceName(this.descriptionName);
    this._router.navigate(["/advices"]);
  }

}
