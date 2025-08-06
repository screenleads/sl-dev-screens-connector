import { Component, effect, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class LoadingPage implements ViewWillEnter {
  private _logger = inject(NGXLogger);
  private _router = inject(Router);

  constructor() { }
  //TODO Necesito crear la validacion de version y descarga
  ionViewWillEnter(): void {
    setTimeout(() => {
      this._router.navigate(['/connect']);
    }, 3000);
  }
}