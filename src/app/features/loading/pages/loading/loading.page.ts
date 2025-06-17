import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoadingPage implements OnInit {

  constructor(private router: Router) { }

  async ngOnInit() {
    await SplashScreen.show({
      autoHide: false,
    });

    setTimeout(() => {
      SplashScreen.hide();
      this.router.navigate(["/advices"]);
    }, 3000);
  }

}
