import { Component, inject, effect, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { DeviceStore } from 'src/app/stores/device.store';

import {
  SlButtonComponent,
  SlIconComponent,
  SlModuleTitleComponent,
  SlTextFieldModule
} from 'sl-dev-components';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SlButtonComponent,
    SlTextFieldModule,
    SlIconComponent,
    SlModuleTitleComponent,
    IonContent
  ]
})
export class ConnectionPage {
  private deviceStore = inject(DeviceStore);
  private router = inject(Router);
  private logger = inject(NGXLogger);

  device = this.deviceStore.device;
  deviceName: WritableSignal<string> = signal('');

  constructor() {
    effect(() => {
      const currentDevice = this.device();
      if (currentDevice) {
        this.deviceName.set(currentDevice.descriptionName || '');
        this.logger.debug('[ConnectionPage] Dispositivo cargado:', currentDevice);
      }
    });
  }

  saveNameAndContinue() {
    const name = this.deviceName();
    if (!name.trim()) {
      this.logger.warn('[ConnectionPage] Nombre vacío, no se puede continuar');
      return;
    }

    this.logger.info('[ConnectionPage] Guardando nombre del dispositivo:', name);
    this.deviceStore.updateDeviceName(name);
    this.router.navigate(['/advices']);
  }
}
