import { HttpClient } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import { DevicesService } from '../../loading/services/loading.service';
import { map, Observable } from 'rxjs';
import { Advice } from '../model/Advice';
@Injectable({
  providedIn: 'root',
})
export class AdvicesService {

  constructor(private _http: HttpClient, private _devicesSrv:DevicesService) {}


  getImages(roomId: string):  Observable<Advice[]> {
    return this._http.get(`http://localhost:3000/advices/${roomId}`).pipe(map((result:any)=>result));
  }
}
