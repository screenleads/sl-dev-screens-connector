import { TestBed } from '@angular/core/testing';
import { WallSyncService } from './wall-sync.service';

describe('WallSyncService', () => {
    let service: WallSyncService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WallSyncService]
        });
        service = TestBed.inject(WallSyncService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should emit on triggerRefresh', (done) => {
        service.refreshAds$.subscribe(() => {
            expect(true).toBeTrue();
            done();
        });
        service.triggerRefresh();
    });
});
