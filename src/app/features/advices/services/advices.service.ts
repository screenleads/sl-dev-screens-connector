import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Advice } from '../model/Advice';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
@Injectable({
  providedIn: 'root',
})
export class AdvicesService {

  constructor(private _http: HttpClient) { }
  private config = inject(APP_CONFIG);

  getAdvices() {
    return this._http.get(`${this.config.apiUrl}/advices`).pipe(map((result: any) => result));
  }
  getAdvicesVisibles() {
    return this._http.get(`${this.config.apiUrl}/advices/visibles`).pipe(map((result: any) => result));
  }
  getAdvicesVisiblesByDevice(deviceId: string) {
    return this._http.get(`${this.config.apiUrl}/devices/${deviceId}/advices`).pipe(map((result: any) => result));
  }
  getImages(roomId: string): Observable<Advice[]> {
    return this._http.get(`${this.config.apiUrl}/advices/${roomId}`).pipe(map((result: any) => result));
  }
}
