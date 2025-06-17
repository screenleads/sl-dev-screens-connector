import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DeviceUUID } from 'device-uuid';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  uuid = new DeviceUUID().get();
  du = new DeviceUUID().parse();
  constructor() {
    console.log(this.uuid);
  }
}
