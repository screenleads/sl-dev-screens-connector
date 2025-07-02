import { Component, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
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
export class LoadingPage implements OnInit {

  constructor(private _router: Router, private _devicesSrv: DevicesService) {
    // effect(() => {
    // console.log("DEVICE REGISTERED??", this._devicesSrv.getIsRegisteredDevice());
    // if (this._devicesSrv.getIsRegisteredDevice()) {
    //   setTimeout(() => {
    //     SplashScreen.hide();
    this._router.navigate(["/advices"]);
    //   }, 3000);

    // }
    // })
  }

  async ngOnInit() {
    await SplashScreen.show({
      autoHide: false,
    });




    // setTimeout(() => {
    //   SplashScreen.hide();
    //   this.router.navigate(["/advices"]);
    // }, 3000);
  }

}
