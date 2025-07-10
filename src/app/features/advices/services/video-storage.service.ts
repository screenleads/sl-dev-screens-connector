import { Injectable } from '@angular/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Platform } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class VideoStorageService {
    constructor(private file: File, private platform: Platform) { }

    async saveBlob(blob: Blob, filename: string): Promise<string> {
        await this.platform.ready();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = async () => {
                try {
                    const buffer = reader.result as ArrayBuffer;

                    await this.file.writeFile(
                        this.file.cacheDirectory!,
                        filename,
                        buffer,
                        { replace: true }
                    );

                    const filePath = this.file.cacheDirectory! + filename;
                    resolve(filePath);
                } catch (err) {
                    reject(err);
                }
            };
            reader.readAsArrayBuffer(blob);
        });
    }
}
