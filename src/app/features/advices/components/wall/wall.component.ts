import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { DateUtilsService } from 'src/app/shared/services/date-utils.service';
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
import { firstValueFrom, Subscription } from 'rxjs';
import { VideoStorageService } from '../../services/video-storage.service';
import CapacitorBlobWriter from 'capacitor-blob-writer';
import { DateTime } from 'luxon';
import { WallSyncService } from 'src/app/shared/services/wall-sync.service';
import { DeviceStore } from 'src/app/stores/device.store';
import { ErrorLoggerService } from 'src/app/shared/services/error-logger.service';
import { LoggingService } from 'src/app/shared/services/logging.service';
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
export class WallComponent implements OnInit, OnDestroy {
  // Método público para iniciar la reproducción desde el template
  public playAdvices(): void {
    this.playAdviceLoop();
  }
  async refreshAdviceList() {
    try {
      this.advices = [];
      this.currentAdvice = undefined;
      this.currentIndex = 0;
      this.played = false;
      this.loaded = false;
      this.videoSrc = null;
      this.progress = 0;
      this.total = 0;
      const device = this.deviceStore.device();
      if (!device) {
        this.showAlert('❌ Dispositivo no registrado');
        return;
      }
      this.advices = await firstValueFrom(this._advicesSrv.getAdvicesVisiblesByDevice(device.id));
      this.total = this.advices.length;
      if (this.total > 0) {
        for (const advice of this.advices) {
          try {
            const videoUrl = advice?.media?.src;
            if (videoUrl) {
              const filename = `video-${advice.id}.mp4`;
              await this.videoStorageSrv.downloadVideoToCache(videoUrl, filename);
            }
            this.progress++;
          } catch (err) {
            this.showAlert('❌ Error al descargar: ' + (err));
          }
        }
        let attempts = 0;
        let nextIndex = 0;
        let nextAdvice = this.advices[nextIndex];
        while (!this.isAdviceVisible(nextAdvice) && attempts < this.advices.length) {
          nextIndex = (nextIndex + 1) % this.advices.length;
          nextAdvice = this.advices[nextIndex];
          attempts++;
        }
        this.currentAdvice = nextAdvice;
        this.currentIndex = nextIndex;
        await this.preloadNextVideo(this.mainVideoRef.nativeElement, nextAdvice);
      }
      this.loaded = true;
    } catch (err) {
      this.showAlert('❌ Error actualizando anuncios: ' + err);
    }
  }
  @ViewChild('mainVideo', { static: false }) mainVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('bufferVideo', { static: true }) bufferVideoRef!: ElementRef<HTMLVideoElement>;
  private errorLogger = inject(ErrorLoggerService);
  private logger = inject(LoggingService);
  public advices: Advice[] = [];
  public currentAdvice: Advice | undefined = undefined;
  public currentIndex = 0;
  public played = false;
  public loaded = false;
  public interval: number | undefined;
  videoSrc: string | null = null;
  public progress = 0;
  public total = 0;
  public errorMessage: string | null = null;
  private refreshSub!: Subscription;
  private dateUtils = inject(DateUtilsService);

  constructor(
    private _advicesSrv: AdvicesService,
    private changeDetector: ChangeDetectorRef,
    private videoStorageSrv: VideoStorageService,
    private wallSync: WallSyncService,
    private deviceStore: DeviceStore
  ) { }

  // Métodos públicos para delegar a DateUtilsService
  isAdviceVisible(advice: Advice | null | undefined): boolean {
    return this.dateUtils.isAdviceVisible(advice);
  }

  parseTime(input: string | number[]): { h: number; m: number } | null {
    return this.dateUtils.parseTime(input);
  }

  normalizeDayName(day: string): string {
    return this.dateUtils.normalizeDayName(day);
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  private showAlert(message: string) {
    this.errorMessage = message;
    this.changeDetector.detectChanges(); // fuerza actualización inmediata
    this.errorLogger.error('[WebsocketEventHandler] Alerta:::', message);
    setTimeout(() => {
      this.errorMessage = null;
      this.changeDetector.detectChanges();
    }, 8000); // mensaje visible por 8 segundos
  }
  async ngOnInit() {
    await this.refreshAdviceList();
  }

  async playAdviceLoop(): Promise<void> {
    try {
      this.played = true;

      const isEven = this.currentIndex % 2 === 0;
      const currentVideoEl = isEven ? this.mainVideoRef.nativeElement : this.bufferVideoRef.nativeElement;
      const nextVideoEl = isEven ? this.bufferVideoRef.nativeElement : this.mainVideoRef.nativeElement;

      const currentAdvice = this.advices[this.currentIndex];
      let nextIndex = (this.currentIndex + 1) % this.advices.length;
      let nextAdvice = this.advices[nextIndex];
      let attempts = 0;

      while (!this.isAdviceVisible(nextAdvice) && attempts < this.advices.length) {
        nextIndex = (nextIndex + 1) % this.advices.length;
        nextAdvice = this.advices[nextIndex];
        attempts++;
      }

      this.currentAdvice = currentAdvice;

      // // Preparar evento fallback
      const timeout = setTimeout(() => {
        this.logger.log('⚠️ Fallback por timeout: video no terminó en 60s');
        currentVideoEl.dispatchEvent(new Event('ended'));
      }, 60000);

      // Añadir eventos de diagnóstico
      currentVideoEl.onerror = (err) => this.showAlert('❌ Error al reproducir ' + (err));
      currentVideoEl.onstalled = () => this.logger.log('📛 Video detenido (stalled)');
      currentVideoEl.onwaiting = () => this.logger.log('⏳ Video esperando datos');

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
      this.errorLogger.error('❌ Error reproduciendo video', err);
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
      this.logger.log(`🌀 Video precargado para advice ${advice.id}`);
      videoEl.pause();

    } catch (err) {
      this.errorLogger.error('⚠️ Error precargando video', err);
    }
  }

  private advanceIndex() {
    let nextIndex = (this.currentIndex + 1) % this.advices.length;
    let attempts = 0;

    while (!this.isAdviceVisible(this.advices[nextIndex]) && attempts < this.advices.length) {
      nextIndex = (nextIndex + 1) % this.advices.length;
      attempts++;
    }

    this.currentIndex = nextIndex;
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
