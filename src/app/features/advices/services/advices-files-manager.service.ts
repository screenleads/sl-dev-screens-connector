import { Injectable, Inject } from '@angular/core';
// import { VideoEditor, VideoEditorOriginal } from '@ionic-native/video-editor';
// import { FFmpeg } from '@ffmpeg/ffmpeg/dist/esm/index.js';
import { Directory } from '@capacitor/filesystem';
import capacitorBlobWriter from 'capacitor-blob-writer';
import { Advice } from '../model/Advice';

@Injectable({
  providedIn: 'root'
})
export class AdvicesFilesManagerService {

  // constructor(@Inject(VideoEditorOriginal) private videoEditor: VideoEditorOriginal) { }
  constructor() { }

  async saveTmpFileByUrl(advice: Advice): Promise<void> {
    // const ffmpeg = new FFmpeg();
    // await ffmpeg.load();
    const response = await fetch('' + advice);
    const videoBlob = await response.blob();
    await capacitorBlobWriter({
      path: 'videos/video_comprimido.mp4',
      directory: Directory.Data,
      blob: videoBlob,
    });
  }

}
