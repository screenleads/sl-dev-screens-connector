import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DevicesService } from './features/loading/services/loading.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  constructor(private _devicesSrv: DevicesService) {
    // this._devicesSrv.registerDevice();
  }
}
