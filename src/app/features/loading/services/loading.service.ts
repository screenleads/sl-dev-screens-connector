import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { Router } from '@angular/router';

import { NGXLogger } from 'ngx-logger';
import { WebsocketStompService } from 'src/app/core/services/websocket/websocketstomp.service';

@Injectable({ providedIn: 'root' })
export class DevicesService {
  private uuid = uuidv4();
  private device: WritableSignal<any> = signal(null);
  private deviceTypes: WritableSignal<any[]> = signal([]);
  private isRegisteredDevice: WritableSignal<boolean> = signal(false);

  public getDevice: Signal<any> = this.device.asReadonly();
  public getDeviceTypes: Signal<any[]> = this.deviceTypes.asReadonly();
  public getIsRegisteredDevice: Signal<boolean> = this.isRegisteredDevice.asReadonly();

  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);
  private router = inject(Router);
  private logger = inject(NGXLogger);
  private wsService = inject(WebsocketStompService);

  constructor() {
    const stored = localStorage.getItem('device');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.device.set(parsed);
      this.uuid = parsed.uuid;
      this.isRegisteredDevice.set(true);
      this.logger.info(`[DeviceService] Dispositivo encontrado con UUID: ${this.uuid}`);
      this.wsService.connect(parsed.uuid);
    } else {
      this.logger.info(`[DeviceService] Primer uso. Generado UUID: ${this.uuid}`);
    }
  }

  registerDevice() {
    const body = this.createDeviceObject();
    this.http.post<any>(`${this.config.apiUrl}/devices`, body).subscribe({
      next: (device) => {
        this.logger.info('[DeviceService] Dispositivo registrado:', device);
        this.device.set(device);
        this.isRegisteredDevice.set(true);
        localStorage.setItem('device', JSON.stringify(device));
        this.wsService.connect(device.uuid);
        this.wsService.joinRoom();
        this.router.navigate(['/connect']);
      },
      error: (err) => this.logger.error('[DeviceService] Error al registrar dispositivo', err),
    });
  }

  updateDeviceName(name: string) {
    const dev = { ...this.device(), descriptionName: name };
    this.http.put<any>(`${this.config.apiUrl}/devices/${dev.id}`, dev).subscribe({
      next: (updated) => {
        this.device.set(updated);
        localStorage.setItem('device', JSON.stringify(updated));
        this.logger.info('[DeviceService] Nombre del dispositivo actualizado');
      },
      error: (err) => this.logger.error('[DeviceService] Error actualizando nombre del dispositivo', err),
    });
  }

  fetchDeviceTypes() {
    this.http.get<any[]>(`${this.config.apiUrl}/devices/types`).subscribe({
      next: (types) => {
        this.deviceTypes.set(types);
        this.logger.debug('[DeviceService] Tipos de dispositivos cargados');
      },
      error: (err) => this.logger.error('[DeviceService] Error cargando tipos de dispositivos', err),
    });
  }

  private createDeviceObject() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const company = localStorage.getItem('company');
    const types = this.deviceTypes();

    const type = width <= 768
      ? types.find(t => t.type === 'mobile')
      : width <= 1024
        ? types.find(t => t.type === 'tablet')
        : types.find(t => t.type === 'tv');

    return {
      uuid: this.uuid,
      descriptionName: '',
      width,
      height,
      type,
      company: { id: company },
    };
  }
}
