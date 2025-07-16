import { HttpClient } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import { DevicesService } from '../../loading/services/loading.service';
import { map, Observable } from 'rxjs';
import { Advice } from '../model/Advice';
@Injectable({
  providedIn: 'root',
})
export class AdvicesService {

  constructor(private _http: HttpClient, private _devicesSrv: DevicesService) { }

  getAdvices() {
    return this._http.get(`https://sl-dev-backend-7ab91220ba93.herokuapp.com/advices`).pipe(map((result: any) => result));
  }
  getAdvicesVisibles() {
    return this._http.get(`https://sl-dev-backend-7ab91220ba93.herokuapp.com/advices/visibles`).pipe(map((result: any) => result));
  }
  getAdvicesVisiblesByDevice(deviceId: string) {
    return this._http.get(`https://sl-dev-backend-7ab91220ba93.herokuapp.com/devices/${deviceId}/advices`).pipe(map((result: any) => result));
  }
  getImages(roomId: string): Observable<Advice[]> {
    return this._http.get(`https://sl-dev-backend-7ab91220ba93.herokuapp.com/advices/${roomId}`).pipe(map((result: any) => result));
  }
}
