import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Advice } from '../model/Advice';
import { AdviceSchedule } from 'src/app/shared/models/AdviceSchedule';
import { AdviceTimeWindow } from 'src/app/shared/models/AdviceTimeWindow';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
@Injectable({
  providedIn: 'root',
})
export class AdvicesService {

  constructor(private _http: HttpClient) { }
  private config = inject(APP_CONFIG);

  getAdvices(): Observable<Advice[]> {
    return this._http.get<Advice[]>(`${this.config.apiUrl}/advices`);
  }
  getAdvicesVisibles(): Observable<Advice[]> {
    return this._http.get<Advice[]>(`${this.config.apiUrl}/advices/visibles`);
  }
  getAdvicesVisiblesByDevice(deviceId: number): Observable<Advice[]> {
    return this._http.get<Advice[]>(`${this.config.apiUrl}/devices/${deviceId}/advices`);
  }
  getImages(roomId: string): Observable<Advice[]> {
    return this._http.get<Advice[]>(`${this.config.apiUrl}/advices/${roomId}`);
  }
}
