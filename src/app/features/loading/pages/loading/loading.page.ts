import { Component, effect, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { DevicesService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class LoadingPage implements ViewWillEnter {

  constructor(
    private _router: Router,
    private _devicesSrv: DevicesService
  ) { }

  ionViewWillEnter(): void {
    // Esto se ejecuta cada vez que se entra a esta página
    console.log("DEVICE REGISTERED??", this._devicesSrv.getIsRegisteredDevice());
    if (this._devicesSrv.getIsRegisteredDevice()) {
      setTimeout(() => {
        this._router.navigate(['/connect']);
      }, 3000);
    }
  }
}