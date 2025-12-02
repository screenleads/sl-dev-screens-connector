/*
import { TestBed } from '@angular/core/testing';
import { VideoStorageService } from './video-storage.service';

describe('VideoStorageService', () => {
    let service: VideoStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [VideoStorageService]
        });
        service = TestBed.inject(VideoStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should save blob and resolve file path', async () => {
        const mockFile = { cacheDirectory: '/cache/', writeFile: jasmine.createSpy('writeFile').and.returnValue(Promise.resolve()) };
            // const mockPlatform = TestBed.inject<any>(require('@ionic/angular').Platform);
        mockPlatform.ready = () => Promise.resolve();
        mockFile.cacheDirectory = '/cache/';
        mockFile.writeFile = jasmine.createSpy('writeFile').and.returnValue(Promise.resolve());
        const blob = new Blob(['test'], { type: 'text/plain' });
        const filePath = await service.saveBlob(blob, 'test.txt');
        expect(mockFile.writeFile).toHaveBeenCalled();
        expect(filePath).toBe('/cache/test.txt');
    });

    it('should reject if writeFile fails', async () => {
            // const mockFile = TestBed.inject<any>(require('@awesome-cordova-plugins/file/ngx').File);
        const mockPlatform = TestBed.inject<any>(require('@ionic/angular').Platform);
        mockPlatform.ready = () => Promise.resolve();
        mockFile.cacheDirectory = '/cache/';
        mockFile.writeFile = jasmine.createSpy('writeFile').and.returnValue(Promise.reject('fail'));
        const blob = new Blob(['test'], { type: 'text/plain' });
        let error;
        try {
            await service.saveBlob(blob, 'fail.txt');
        } catch (e) {
            error = e;
        }
        expect(error).toBe('fail');
    });
});
*/
