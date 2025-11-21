import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SlButtonComponent, SlIconComponent, SlModuleTitleComponent } from 'sl-dev-components';

@Component({
  selector: 'app-notification-update-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, SlButtonComponent,
    SlIconComponent,
    SlModuleTitleComponent],
  template: `
    <div class="custom-modal-backdrop">
      <div class="custom-modal-card">
        <ion-header class="custom-modal-header">
          <ion-toolbar class="custom-modal-toolbar" [ngStyle]="{'background': 'var(--sl-primary01-background-default)'}">
            <ion-title>Nueva versión</ion-title>
            <ion-buttons slot="end" *ngIf="!forceUpdate">
              <ion-button fill="clear" (click)="dismiss()" class="custom-close-btn">
                <ion-icon name="close"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <div class="ion-padding custom-modal-content">
          <p class="custom-modal-message">{{ message }}</p>
           <button sl-button variant="primary" size="medium" (click)="download()">
            Descargar ahora
            <sl-icon icon="download"></sl-icon>
          </button>
          <button sl-button variant="border" size="medium" (click)="dismiss()" *ngIf="!forceUpdate">
            Omitir por ahora
            <!-- <sl-icon icon="dismiss"></sl-icon> -->
          </button>

          
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .custom-modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.35);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .custom-modal-card {
      background: var(--ion-background-color, #fff);
      border-radius: 18px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      max-width: 90vw;
      width: 370px;
      overflow: hidden;
      border: 2px solid var(--sl-primary01-background-default , #3880ff);
      animation: modalIn 0.2s cubic-bezier(.4,2,.6,1) 1;
    }
    @keyframes modalIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .custom-modal-header {
      --background: var(--ion-color-primary, #3880ff);
      color: var(--ion-color-primary-contrast, #fff);
    }
    .custom-modal-toolbar {
      --background: transparent;
      --color: var(--ion-color-primary-contrast, #fff);
    }

    .custom-close-btn {
      color: var(--ion-color-primary-contrast, #fff);
      font-size: 1.3em;
    }
    .custom-modal-content {
      background: var(--sl-color-neutrals-text-default, #08100c);
      color: var(--ion-text-color, #222);
      text-align: center;
    }
    .custom-modal-message {
      font-size: 1.1em;
      margin-bottom: 1.5em;
      margin-top: 1em;
    }
    .custom-modal-btn {
      --background: var(--ion-color-primary, #3880ff);
      --color: var(--ion-color-primary-contrast, #fff);
      margin-bottom: 0.5em;
      font-weight: 600;
      border-radius: 8px;
    }
    .custom-modal-btn-alt {
      --color: var(--ion-color-primary, #3880ff);
      font-weight: 500;
      border-radius: 8px;
    }
    `
  ]
})
export class NotificationUpdateModalComponent {
  @Input() message: string = 'Hay una nueva versión disponible.';
  @Input() downloadUrl!: string;
  @Input() forceUpdate: boolean = false;

  @Output() close = new EventEmitter<void>();

  download() {
    console.log('[UpdateModal] downloadUrl:', this.downloadUrl, 'forceUpdate:', this.forceUpdate);
    if (this.downloadUrl) {
      window.open(this.downloadUrl, '_system');
    }
    if (!this.forceUpdate) {
      this.dismiss();
    }
  }

  dismiss() {
    this.close.emit();
  }
}
