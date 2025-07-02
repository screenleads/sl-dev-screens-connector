import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AdvicesService } from '../../services/advices.service';
import { Advice } from '../../model/Advice';
import { Promotion } from '../../model/Promotion';
import { LeadInfoComponent } from "../lead-info/lead-info.component";
import { CommonModule } from '@angular/common';
import { SlButtonComponent, SlIconComponent, SlModuleTitleComponent, SlTextFieldModule } from 'sl-dev-components';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
  imports: [LeadInfoComponent, CommonModule, SlButtonComponent, SlIconComponent, SlModuleTitleComponent],
  standalone: true
})
export class WallComponent implements OnInit {
  @ViewChild('mainVideo', { static: false }) mainVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('bufferVideo', { static: true }) bufferVideoRef!: ElementRef<HTMLVideoElement>;
  public advices: Advice[] = [];
  public currentAdvice: Advice | undefined = undefined;
  public interval: any | undefined; // 3 seconds
  public currentIndex = 0;
  public played = false;

  constructor(private _advicesSrv: AdvicesService, private changeDetector: ChangeDetectorRef) {
    this._advicesSrv.getAdvices().subscribe((data: Advice[]) => {
      this.advices = data;
      changeDetector.detectChanges();
    });
    // this.medias = [
    //   new Advice(2, 'images/smash2', 3000, new Promotion(1, 'https://www.smash.com/legal', 'http://screenLeads.com/promos/smash/adpsd8sa8f7as8f7asd8sa09d')),
    //   new Advice(1, 'images/smash1', 3000, new Promotion(1, 'https://www.smash.com/legal', 'http://screenLeads.com/promos/smash/adpsd8sa8f7as8f7asd8sa09d')),
    //   new Advice(3, 'videos/8', 15000, new Promotion(1, 'https://www.smash.com/legal', 'http://screenLeads.com/promos/smash/adpsd8sa8f7as8f7asd8sa09d')),
    // ]

  }

  ngOnInit() {

  }
  initAdvices() {
    this.played = true;
    this.currentAdvice = this.advices[this.currentIndex];
    this.nextImage();
  }
  nextImage() {
    console.log("NEXT IMAGE");
    let interval = this.advices[this.currentIndex].customInterval ? this.advices[this.currentIndex].interval : 3000;
    setTimeout(() => {

      const bufferVideo = this.bufferVideoRef.nativeElement;
      const mainVideo = this.mainVideoRef.nativeElement;
      this.currentIndex = (this.currentIndex + 1) % this.advices.length;
      this.currentAdvice = this.advices[this.currentIndex];
      const auxIndex = (this.currentIndex + 1) % this.advices.length;
      const auxAdvice = this.advices[auxIndex];


      bufferVideo.src = `http://localhost:3000/medias/render/${auxAdvice?.media?.id}`;
      bufferVideo.load();
      bufferVideo.onloadedmetadata = () => {
        mainVideo.pause();
        mainVideo.src = `http://localhost:3000/medias/render/${this.currentAdvice?.media?.id}`;
        mainVideo.load();
        mainVideo.play();
      };
      // const video = this.videoRef.nativeElement;
      // const currentTime = video.currentTime;

      // video.pause(); // opcional
      // video.src = `http://localhost:3000/medias/render/${this.currentAdvice?.media?.id}`;
      // video.load();

      // // Retomar desde tiempo anterior (si aplica)
      // video.currentTime = 0;
      // video.play();
      this.changeDetector.detectChanges();
      this.nextImage();

    }, interval);
  }


  getMediaCategory(mediaType: string): 'image' | 'video' | 'audio' | 'other' {
    if (mediaType == null) return 'other';
    const type = mediaType.toLowerCase();
    if (type.startsWith('image/')) {
      return 'image';
    } else if (type.startsWith('video/')) {
      return 'video';
    } else if (type.startsWith('audio/')) {
      return 'audio';
    } else {
      return 'other';
    }
  }
}


