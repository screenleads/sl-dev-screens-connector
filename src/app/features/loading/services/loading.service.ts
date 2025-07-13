import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { DeviceUUID } from 'device-uuid';
import { firstValueFrom, lastValueFrom, map, toArray } from 'rxjs';
import { WebsocketstompService } from 'src/app/core/services/websocket/websocketstomp.service';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  private uuid = new DeviceUUID().get();
  private du = new DeviceUUID().parse();
  private isRegisteredDevice: WritableSignal<boolean> = signal(false);
  deviceTypes: WritableSignal<any[]> = signal([]);
  private device: WritableSignal<any> = signal(null);


  public getIsRegisteredDevice: Signal<boolean> = this.isRegisteredDevice.asReadonly();
  public getDevice: Signal<any> = this.device.asReadonly();
  constructor(private _http: HttpClient, private _websocketSrv: WebsocketstompService) {


  }

  registerDevice() {

    return this._http.post(`https://sl-dev-backend-7ab91220ba93.herokuapp.com/devices`, this.createDeviceObject(), { responseType: 'json' }).subscribe((device: any) => {
      this._websocketSrv.initconnectionSocket(device["uuid"]);
      this.device.set(device);
      this.isRegisteredDevice.set(true);
    });

  }

  getDeviceTypes() {
    try {
      this._http.get<any[]>(`https://sl-dev-backend-7ab91220ba93.herokuapp.com/devices/types`).subscribe((deviceTypes: any) => {
        console.log("DEVICETYPES", deviceTypes);
        this.deviceTypes.set(deviceTypes);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }


  }


  createDeviceObject() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let deviceType;
    if (width <= 768) {
      console.log("MOBILE", width);
      deviceType = this.deviceTypes().find(a => a.type == "MOBILE");
    } else if (width <= 1024) {
      console.log("TABLET", width);
      deviceType = this.deviceTypes().find(a => a.type == "TABLET");
    } else {
      console.log("TV", width);
      deviceType = this.deviceTypes().find(a => a.type == "TV");
      console.log("TV", deviceType, this.deviceTypes);


    }
    return {
      "uuid": this.uuid,
      "descriptionName": "",
      "width": width,
      "height": height,
      "type": deviceType
    }

  }



  updateDeviceName(descriptionName: String) {
    let deviceAux = this.device();
    deviceAux["descriptionName"] = descriptionName;
    this.device.set(deviceAux);
    return this._http.put(`https://sl-dev-backend-7ab91220ba93.herokuapp.com/devices/${this.device()["id"]}`, this.device(), { responseType: 'json' }).subscribe((device: any) => {
      this.device.set(device);
    });

  }

  // getDevice() {
  //   return this._http.get(`https://sl-dev-backend-7ab91220ba93.herokuapp.com/devices`, { responseType: 'json' });
  // }

}
