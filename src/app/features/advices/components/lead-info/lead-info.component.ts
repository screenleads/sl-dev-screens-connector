import { Component, Input, OnInit } from '@angular/core';
import { QrCodeComponent } from 'ng-qrcode';
import { Advice } from '../../model/Advice';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-lead-info',
  templateUrl: './lead-info.component.html',
  styleUrls: ['./lead-info.component.scss'],
  standalone: true,
  imports: [QrCodeComponent, NgIf]

})
export class LeadInfoComponent  implements OnInit {
  @Input() advice : Advice | undefined;
  constructor() { }

  ngOnInit() {}
  formatUrl(){
    return  this.advice?.getPromo()?.getUrlPromo();
  }
}
