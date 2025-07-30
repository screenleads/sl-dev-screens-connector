import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom, lastValueFrom, map, toArray } from 'rxjs';
import { WebsocketstompService } from 'src/app/core/services/websocket/websocketstomp.service';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  private uuid = uuidv4();
  private isRegisteredDevice: WritableSignal<boolean> = signal(false);
  deviceTypes: WritableSignal<any[]> = signal([]);
  private device: WritableSignal<any> = signal(null);

  public getIsRegisteredDevice: Signal<boolean> = this.isRegisteredDevice.asReadonly();
  public getDevice: Signal<any> = this.device.asReadonly();
  private config = inject(APP_CONFIG);

  constructor(private _http: HttpClient, private _websocketSrv: WebsocketstompService, private _router: Router) {
    const storedDevice = localStorage.getItem('device');
    if (storedDevice) {
      const parsed = JSON.parse(storedDevice);
      this.device.set(parsed);
      this.isRegisteredDevice.set(true);
      this._websocketSrv.initconnectionSocket(parsed.uuid);
      let deviceAux = { ...this.device() };
      this.uuid = deviceAux.uuid;
      console.log("UUID::::::::::::::", this.uuid);
    } else {
      console.log("PRIMER USO DEL DISPOSITIVO UUID::::::::::::::", this.uuid);
    }
  }

  registerDevice() {
    return this._http.post(`${this.config.apiUrl}/devices`, this.createDeviceObject(), { responseType: 'json' }).subscribe((device: any) => {
      this._websocketSrv.initconnectionSocket(device["uuid"]);
      this.device.set(device);
      this.isRegisteredDevice.set(true);
      localStorage.setItem('device', JSON.stringify(device));
      this._router.navigate(['connect']);
    });
  }

  updateDeviceName(descriptionName: string) {
    let deviceAux = { ...this.device() };
    deviceAux["descriptionName"] = descriptionName;

    return this._http.put(`${this.config.apiUrl}/devices/${deviceAux.id}`, deviceAux, { responseType: 'json' }).subscribe((device: any) => {
      this.device.set(device);
      localStorage.setItem('device', JSON.stringify(device));
    });
  }

  getDeviceTypes() {
    this._http.get<any[]>(`${this.config.apiUrl}/devices/types`).subscribe((deviceTypes: any) => {
      this.deviceTypes.set(deviceTypes);
    });
  }

  createDeviceObject() {

    const width = window.innerWidth;
    const company = localStorage.getItem('company');
    const height = window.innerHeight;
    let deviceType;

    if (width <= 768) {
      deviceType = this.deviceTypes().find(a => a.type === "mobile");
    } else if (width <= 1024) {
      deviceType = this.deviceTypes().find(a => a.type === "tablet");
    } else {
      deviceType = this.deviceTypes().find(a => a.type === "tv");
    }

    return {
      uuid: this.uuid,
      descriptionName: '',
      width,
      height,
      type: deviceType,
      company: { id: company }
    };
  }
}
