import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdvicesService {

  constructor(private _http: HttpClient) { }


  getImage(alias: string) {
    return this._http.get(`http://localhost:3000/image/${alias}`, { responseType: 'text' });
  }
}
