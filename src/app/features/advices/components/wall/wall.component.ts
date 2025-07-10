import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { AdvicesService } from '../../services/advices.service';
import { Advice } from '../../model/Advice';
import {
  CommonModule
} from '@angular/common';
import {
  SlButtonComponent,
  SlIconComponent,
  SlModuleTitleComponent
} from 'sl-dev-components';
import { LeadInfoComponent } from '../lead-info/lead-info.component';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { VideoStorageService } from '../../services/video-storage.service';
import CapacitorBlobWriter from 'capacitor-blob-writer';
@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
  imports: [
    LeadInfoComponent,
    CommonModule,
    SlButtonComponent,
    SlIconComponent,
    SlModuleTitleComponent
  ],
  standalone: true
})
export class WallComponent implements OnInit {
  @ViewChild('mainVideo', { static: false }) mainVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('bufferVideo', { static: true }) bufferVideoRef!: ElementRef<HTMLVideoElement>;

  public advices: Advice[] = [];
  public currentAdvice: Advice | undefined = undefined;
  public currentIndex = 0;
  public played = false;
  public loaded = false;
  public interval: any;
  videoSrc: string | null = null;
  public progress = 0;
  public total = 0;
  public errorMessage: string | null = null;
  constructor(
    private _advicesSrv: AdvicesService,
    private changeDetector: ChangeDetectorRef,
    private videoStorageSrv: VideoStorageService
  ) { }

  private showAlert(message: string) {
    this.errorMessage = message;
    this.changeDetector.detectChanges(); // fuerza actualización inmediata
    setTimeout(() => {
      this.errorMessage = null;
      this.changeDetector.detectChanges();
    }, 8000); // mensaje visible por 8 segundos
  }
  async ngOnInit() {
    console.log("→ Obteniendo advices...");

    this.advices = await firstValueFrom(this._advicesSrv.getAdvicesVisibles());
    this.total = this.advices.length;
    console.log(this.advices.length);
    const limited = this.advices.slice(0, 5);
    for (const advice of limited) {
      try {
        await this.downloadVideoToTV(advice);
        this.progress++;
        this.changeDetector.detectChanges(); // actualiza UI
      } catch (err) {
        console.error('Error al descargar', advice.id, err);
        this.showAlert('❌ Error al descargar: ' + (err));
      }
    }

    console.log("✅ Todos los videos listos");
    await this.preloadNextVideo(this.mainVideoRef.nativeElement, this.advices[this.currentIndex]);
    this.loaded = true;



  }
  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve((reader.result as string).split(',')[1]); // solo base64
      reader.readAsDataURL(blob);
    });
  }

  async downloadVideoToTV(advice: Advice) {
    try {
      console.log("EMPEZAMOS A GUARDAR EL " + advice.media?.src!);
      const response = await fetch(advice.media?.src!);
      if (!response.ok) throw new Error('Error al descargar el video');

      const blob = await response.blob();
      if (blob.size === 0) throw new Error('El video descargado está vacío');
      const path = await this.saveVideoBlob(blob, `video-${advice.id}.mp4`);
      console.log("✅ Video guardado en:", path);
    } catch (e) {
      console.error(`Error en video ${advice.id}:`, e);
      this.showAlert('❌ Error al descargar: ' + (e));

      // (opcional) mostrar toast o continuar sin cortar
    }

  }
  async saveVideoBlob(blob: Blob, fileName: string): Promise<string> {
    const dir = 'videos';
    const path = `${dir}/${fileName}`;
    try {
      await Filesystem.mkdir({
        path: dir,
        directory: Directory.Cache,
        recursive: true,
      });
    } catch (error: any) {
      // ⚠️ Ignorar si el error indica que la carpeta ya existe
      if (!error?.message?.includes('already exists')) {
        console.error('❌ Error creando carpeta:', error);
        this.showAlert('❌ Error al crear la carpeta: ' + (error));

        throw error;
      }
    }
    await CapacitorBlobWriter({
      path,
      directory: Directory.Cache, // o 'DOCUMENTS'
      blob,
    });

    const localUrl = Capacitor.convertFileSrc(path);
    return localUrl;
  }

  playAdvices() {
    this.playAdviceLoop();
  }



  async playAdviceLoop(): Promise<void> {
    try {
      this.played = true;

      const isEven = this.currentIndex % 2 === 0;
      const currentVideoEl = isEven ? this.mainVideoRef.nativeElement : this.bufferVideoRef.nativeElement;
      const nextVideoEl = isEven ? this.bufferVideoRef.nativeElement : this.mainVideoRef.nativeElement;

      const currentAdvice = this.advices[this.currentIndex];
      const nextIndex = (this.currentIndex + 1) % this.advices.length;
      const nextAdvice = this.advices[nextIndex];

      this.currentAdvice = currentAdvice;


      // Preparar evento fallback
      const timeout = setTimeout(() => {
        console.warn('⚠️ Fallback por timeout: video no terminó en 60s');
        currentVideoEl.dispatchEvent(new Event('ended'));
      }, 60000);

      // Añadir eventos de diagnóstico
      currentVideoEl.onerror = (err) => this.showAlert('❌ Error al reproducir ' + (err));
      ;
      currentVideoEl.onstalled = () => console.warn('📛 Video detenido (stalled)');
      currentVideoEl.onwaiting = () => console.warn('⏳ Video esperando datos');

      // Reproducir el video
      await currentVideoEl.play();

      // Precargar el siguiente
      this.preloadNextVideo(nextVideoEl, nextAdvice);

      await new Promise<void>((resolve) => {
        currentVideoEl.onended = () => {
          clearTimeout(timeout);
          resolve();
        };
      });

      this.advanceIndex();
      this.playAdviceLoop();

    } catch (err) {
      console.error('❌ Error reproduciendo video:', err);
      this.showAlert('❌ Error reproduciendo video: ' + (err));
      this.advanceIndex();
      this.playAdviceLoop();
    }
  }


  private async preloadNextVideo(videoEl: HTMLVideoElement, advice: Advice): Promise<void> {
    try {
      const path = `videos/video-${advice.id}.mp4`;

      const fileCheck = await Filesystem.stat({
        path,
        directory: Directory.Cache,
      });

      if (fileCheck.size === 0) return;

      const fileUri = await Filesystem.getUri({
        path,
        directory: Directory.Cache,
      });

      const src = Capacitor.convertFileSrc(fileUri.uri);
      videoEl.src = src;
      videoEl.load();

      await new Promise<void>((resolve) => {
        videoEl.onloadedmetadata = () => resolve();
      });
      console.log(`🌀 Video precargado para advice ${advice.id}`);
      videoEl.pause();

    } catch (err) {
      console.warn('⚠️ Error precargando video:', err);
    }
  }

  private advanceIndex() {
    this.currentIndex = (this.currentIndex + 1) % this.advices.length;
  }


  getMediaCategory(mediaType: string): 'image' | 'video' | 'audio' | 'other' {
    if (!mediaType) return 'other';
    const type = mediaType.toLowerCase();
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    return 'other';
  }
}
