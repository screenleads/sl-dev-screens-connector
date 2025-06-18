import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { DeviceUUID } from 'device-uuid';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  private uuid = new DeviceUUID().get();
  private du = new DeviceUUID().parse();
  private isRegisteredDevice: WritableSignal<boolean> = signal(false);
  private device: WritableSignal<any> = signal(null);


  public getIsRegisteredDevice: Signal<boolean> = this.isRegisteredDevice.asReadonly();
  public getDevice: Signal<any> = this.device.asReadonly();
  constructor(private _http: HttpClient) { }

  registerDevice() {
    return this._http.post(`http://localhost:3000/devices`, { uuid: this.uuid }, { responseType: 'json' }).subscribe((device: any) => {
      this.device.set(device);
      this.isRegisteredDevice.set(true);
    });

  }

  updateDeviceName(descriptionName: String) {
    console.log(this.device());
    return this._http.put(`http://localhost:3000/devices/${this.device()["id"]}`, { id: this.device()["id"], uuid: this.device()["uuid"], descriptionName: descriptionName }, { responseType: 'json' }).subscribe((device: any) => {
      console.log(device);
      this.device.set(device);
    });

  }

  // getDevice() {
  //   return this._http.get(`http://localhost:3000/devices`, { responseType: 'json' });
  // }

}
