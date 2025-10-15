import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-notification-update-modal',
    standalone: true,
    imports: [IonicModule, CommonModule],
    template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Actualización disponible</ion-title>
        <ion-buttons slot="end" *ngIf="!forceUpdate">
          <ion-button (click)="dismiss()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>{{ message }}</p>
      <ion-button expand="block" color="success" (click)="download()">Descargar ahora</ion-button>
      <ion-button expand="block" fill="clear" color="medium" *ngIf="!forceUpdate" (click)="dismiss()">Más adelante</ion-button>
    </ion-content>
  `
})
export class NotificationUpdateModalComponent {
    @Input() message: string = 'Hay una nueva versión disponible.';
    @Input() downloadUrl!: string;
    @Input() forceUpdate: boolean = false;

    constructor(private modalCtrl: ModalController) { }

    download() {
        window.open(this.downloadUrl, '_system');
        if (!this.forceUpdate) {
            this.dismiss();
        }
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }
}
