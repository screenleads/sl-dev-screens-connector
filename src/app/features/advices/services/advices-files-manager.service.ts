import { Injectable } from '@angular/core';
import { VideoEditor, VideoEditorOriginal } from '@ionic-native/video-editor';
import { FFmpeg } from '@ffmpeg/ffmpeg/dist/esm/index.js';
import capacitorBlobWriter from 'capacitor-blob-writer';
import { Advice } from '../model/Advice';

@Injectable({
  providedIn: 'root'
})
export class AdvicesFilesManagerService {

  constructor(private videoEditor: VideoEditorOriginal) { }

  async saveTmpFileByUrl(advice:Advice): Promise<void> {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load();
      const response = await fetch(''+advice);
      const videoBlob = await response.blob();      
      await capacitorBlobWriter({
        path: 'videos/video_comprimido.mp4',
        directory: 'DATA', // o 'DOCUMENTS'
        blob: videoBlob,
      });
  }

}
