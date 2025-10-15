import { Component, inject, Input, OnInit } from '@angular/core';
import { QrCodeComponent } from 'ng-qrcode';
import { Advice } from '../../model/Advice';
import { NgIf } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
@Component({
  selector: 'app-lead-info',
  templateUrl: './lead-info.component.html',
  styleUrls: ['./lead-info.component.scss'],
  standalone: true,
  imports: [QrCodeComponent]

})
export class LeadInfoComponent implements OnInit {
  @Input() advice: Advice | undefined;
  private logger = inject(NGXLogger);

  constructor() { }

  ngOnInit() {
    this.logger.info('[WebsocketEventHandler] Advice Recibido', this.advice);

  }
  formatUrl() {
    // return  this.advice?.getPromo()?.getUrlPromo();
    return 'https://example.com/legal'
    return "";
  }
}
