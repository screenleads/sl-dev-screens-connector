import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AdvicesService } from '../../services/advices.service';
import { WallComponent } from "../../components/wall/wall.component";

@Component({
  selector: 'app-advices',
  templateUrl: './advices.page.html',
  styleUrls: ['./advices.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, WallComponent]
})
export class AdvicesPage implements OnInit {
  currentImage = "smash1";
  constructor(private advicesSrv: AdvicesService) { }

  ngOnInit() {

  }

}
