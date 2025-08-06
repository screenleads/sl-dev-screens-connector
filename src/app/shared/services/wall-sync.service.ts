// src/app/core/services/wall-sync.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WallSyncService {
    private refreshAdsSubject = new Subject<void>();
    refreshAds$ = this.refreshAdsSubject.asObservable();

    triggerRefresh() {
        this.refreshAdsSubject.next();
    }
}
