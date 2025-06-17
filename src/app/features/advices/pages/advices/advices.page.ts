import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AdvicesService } from '../../services/advices.service';

@Component({
  selector: 'app-advices',
  templateUrl: './advices.page.html',
  styleUrls: ['./advices.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class AdvicesPage implements OnInit {
  imageAux = "";
  constructor(private advicesSrv: AdvicesService) { }

  ngOnInit() {
    this.advicesSrv.getImage("smash1").subscribe(data => {
      console.log(data);
      this.imageAux = data;
    });
  }

}
