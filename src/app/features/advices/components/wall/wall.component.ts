import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
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
import { firstValueFrom, Subscription } from 'rxjs';
import { VideoStorageService } from '../../services/video-storage.service';
import CapacitorBlobWriter from 'capacitor-blob-writer';
import { DateTime } from 'luxon';
import { WallSyncService } from 'src/app/shared/services/wall-sync.service';
import { DeviceStore } from 'src/app/stores/device.store';
import { NGXLogger } from 'ngx-logger';
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
  private logger = inject(NGXLogger);

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
  private refreshSub!: Subscription;
  constructor(
    private _advicesSrv: AdvicesService,
    private changeDetector: ChangeDetectorRef,
    private videoStorageSrv: VideoStorageService,
    private wallSync: WallSyncService,
    private deviceStore: DeviceStore
  ) {


  }

  private showAlert(message: string) {
    this.errorMessage = message;
    this.changeDetector.detectChanges(); // fuerza actualización inmediata
    this.logger.error('[WebsocketEventHandler] Alerta:::', message);
    setTimeout(() => {
      this.errorMessage = null;
      this.changeDetector.detectChanges();
    }, 8000); // mensaje visible por 8 segundos
  }
  async ngOnInit() {
    // console.log("→ Obteniendo advices...", this._devicesSrv.getDevice());

    await this.refreshAdviceList();
    this.refreshSub = this.wallSync.refreshAds$.subscribe(() => {
      this.refreshAdviceList();
    });

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
      console.log(this.advices.length);
      if (this.total > 0) {
        for (const advice of this.advices) {
          try {
            await this.downloadVideoToTV(advice);
            this.progress++;
          } catch (err) {
            console.error('Error al descargar', advice.id, err);
            this.showAlert('❌ Error al descargar: ' + (err));
          }
        }

        console.log("✅ Todos los videos listos");
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
        // this.advanceIndex();
      }

      this.loaded = true;

    } catch (err) {
      this.showAlert('❌ Error actualizando anuncios: ' + err);
    }
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
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
      const msg = error?.message?.toLowerCase() || '';
      const iosConflict = error?.code === '12'; // iOS sometimes uses code 12 for file exists
      const androidConflict = msg.includes('already exists') || msg.includes('cannot be overwritten');

      if (!iosConflict && !androidConflict) {
        console.error('❌ Error creando carpeta:', error);
        // this.showAlert('❌ Error al crear la carpeta: ' + error);
        throw error;
      } else {
        console.warn('📁 Carpeta ya existe, continuando...');
      }
    }

    await CapacitorBlobWriter({
      path,
      directory: Directory.Cache,
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

  private parseTime(input: any): { h: number; m: number } | null {
    if (Array.isArray(input) && input.length >= 2
      && Number.isFinite(+input[0]) && Number.isFinite(+input[1])) {
      return { h: +input[0], m: +input[1] };
    }
    if (typeof input === 'string') {
      const m = input.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
      if (m) return { h: +m[1], m: +m[2] };
    }
    return null;
  }

  // (opcional) normaliza nombre de día ES→EN si te llega en español
  private normalizeDayName(day: any): string {
    const d = String(day ?? '').trim().toUpperCase();
    const map: Record<string, string> = {
      'LUNES': 'MONDAY', 'MARTES': 'TUESDAY', 'MIERCOLES': 'WEDNESDAY', 'MIÉRCOLES': 'WEDNESDAY',
      'JUEVES': 'THURSDAY', 'VIERNES': 'FRIDAY',
      'SABADO': 'SATURDAY', 'SÁBADO': 'SATURDAY', 'DOMINGO': 'SUNDAY'
    };
    return map[d] || d;
  }

  // ✅ decide visibilidad con null = "todo el día"
  isAdviceVisible(advice: Advice | null | undefined): boolean {
    if (!advice?.visibilityRules || advice.visibilityRules.length === 0) return true;

    const now = DateTime.now().setZone('Europe/Madrid');
    const currentDay = now.setLocale('en').toFormat('cccc').toUpperCase(); // "WEDNESDAY"
    const currentMinutes = now.hour * 60 + now.minute;

    for (const rule of advice.visibilityRules ?? []) {
      if (!rule) continue;

      const ruleDay = this.normalizeDayName((rule as any).day);
      if (ruleDay !== currentDay) continue;

      const ranges = (rule as any).timeRanges ?? [];

      // Sin rangos → visible todo el día
      if (!Array.isArray(ranges) || ranges.length === 0) return true;

      for (const range of ranges) {
        if (!range) continue;

        const fromRaw = (range as any).fromTime;
        const toRaw = (range as any).toTime;

        // Ambos null → visible todo el día
        if (fromRaw == null && toRaw == null) return true;

        const fromParsed = this.parseTime(fromRaw);
        const toParsed = this.parseTime(toRaw);

        // Si alguno viene mal formado, lo ignoramos
        if (!fromParsed || !toParsed) continue;

        const fromMinutes = fromParsed.h * 60 + fromParsed.m;
        const toMinutes = toParsed.h * 60 + toParsed.m;

        if (fromMinutes <= toMinutes) {
          // Rango normal (mismo día)
          if (currentMinutes >= fromMinutes && currentMinutes <= toMinutes) return true;
        } else {
          // Rango que cruza medianoche
          if (currentMinutes >= fromMinutes || currentMinutes <= toMinutes) return true;
        }
      }

      // Si había regla para el día pero ningún rango válido coincidió, sigue mirando otras reglas
    }

    return false;
  }
}
