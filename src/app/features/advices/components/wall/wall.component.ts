import { Component, Input, OnInit } from '@angular/core';
import { AdvicesService } from '../../services/advices.service';
import { Advice } from '../../model/Advice';
import { Promotion } from '../../model/Promotion';
import { LeadInfoComponent } from "../lead-info/lead-info.component";

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
  imports: [LeadInfoComponent],
  standalone: true
})
export class WallComponent  implements OnInit {
  public medias: Advice[] = [];
  public interval: any | undefined; // 3 seconds
  public currentIndex = 0;

  constructor(private _advicesSrv: AdvicesService) { 
    //  this._advicesSrv.getImages('room1').subscribe((data: Advice[]) => {
    //   this.medias = data;
    //  });
    this.medias = [
      new Advice(1, 'smash1', 3000, new Promotion(1, 'https://www.smash.com/legal', 'http://screenLeads.com/promos/smash/adpsd8sa8f7as8f7asd8sa09d')),
      new Advice(2, 'smash2', 3000, new Promotion(1, 'https://www.smash.com/legal', 'http://screenLeads.com/promos/smash/adpsd8sa8f7as8f7asd8sa09d')),
      new Advice(3, 'smash3', 1000, new Promotion(1, 'https://www.smash.com/legal', 'http://screenLeads.com/promos/smash/adpsd8sa8f7as8f7asd8sa09d')),
      new Advice(4, 'smash4', 9000, new Promotion(1, 'https://www.smash.com/legal', 'http://screenLeads.com/promos/smash/adpsd8sa8f7as8f7asd8sa09d'))
    ]
    
  }

  ngOnInit() {
    this.nextImage();
  }
  nextImage(){
    let interval = this.medias[this.currentIndex].getTimeInterval();
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.medias.length;
      console.log(this.medias[this.currentIndex].getReference(), this.currentIndex, this.medias[this.currentIndex].getTimeInterval());
      this.nextImage();
    }, interval);


  }
}
