/*
import { DeviceStore } from './device.store';
import { TestBed } from '@angular/core/testing';
import { NGXLogger } from 'ngx-logger';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { Router } from '@angular/router';
import { AuthStore } from './auth.store';
import { WebsocketStateStore } from './webscoket.store';

describe('DeviceStore', () => {
    let store: DeviceStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DeviceStore,
                { provide: NGXLogger, useValue: {} },
                { provide: HttpClient, useValue: {} },
                { provide: APP_CONFIG, useValue: { apiUrl: '', apiHost: '' } },
                { provide: Router, useValue: {} },
                { provide: AuthStore, useValue: {} },
                { provide: WebsocketStateStore, useValue: {} }
            ]
        });
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });

    it('should set and clear device', () => {
        const device = { id: 1, uuid: 'abc', type: { id: 1, type: 'tv' }, descriptionName: 'Sala', width: 100, height: 100, company: undefined };
        store['setDevice'](device);
        expect(store.device()).toEqual(device);
        // Simular clearDevice sin acceso directo
        store['setDevice'](null);
        expect(store.device()).toBeNull();
        expect(store.isRegistered()).toBeFalse();
    });

    it('should update signals', () => {
        expect(store.isRegistered()).toBeFalse();
        store['setDevice']({ id: 2, uuid: 'def', type: { id: 2, type: 'tablet' }, descriptionName: 'Oficina', width: 200, height: 200, company: undefined });
        expect(store.isRegistered()).toBeTrue();
        const dev = store.device();
        expect(dev && dev.id).toBe(2);
    });

    it('should register device and set it', async () => {
        spyOn(store as any, 'ensureDeviceTypesLoaded').and.returnValue(Promise.resolve());
        spyOn(store as any, 'getDeviceByUuid').and.returnValue(Promise.resolve(null));
        const mockDevice = { id: 10, uuid: 'mock-uuid', type: { id: 1, type: 'tv' }, descriptionName: '', width: 100, height: 100, company: undefined };
        // const http = TestBed.inject<any>(require('@angular/common/http').HttpClient);
            // spyOn(http, 'post').and.returnValue({ pipe: () => ({}) });
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 100 });
        Object.defineProperty(window, 'innerHeight', { configurable: true, value: 100 });
        spyOn(store as any, 'setDevice');
        spyOn(store['router'], 'navigate');
            // (http.post as any).and.returnValue({ pipe: () => ({}) });
            // (http.post as any).and.returnValue({ subscribe: ({ next }: any) => next(mockDevice) });
        await store.registerDevice();
        expect(store['setDevice']).toHaveBeenCalled();
        expect(store['router'].navigate).toHaveBeenCalledWith(['connect']);
    });

    it('should update device name', async () => {
        const currentDevice = { id: 20, uuid: 'uuid20', type: { id: 2, type: 'tablet' }, descriptionName: 'Old', width: 200, height: 200, company: undefined };
        store['setDevice'](currentDevice);
        // const http = TestBed.inject<any>(require('@angular/common/http').HttpClient);
        spyOn(http, 'put').and.returnValue({ subscribe: ({ next }: any) => next({ ...currentDevice, descriptionName: 'Nuevo' }) });
        spyOn(store as any, 'setDevice');
        await store.updateDeviceName('Nuevo');
        expect(store['setDevice']).toHaveBeenCalledWith(jasmine.objectContaining({ descriptionName: 'Nuevo' }));
    });

    it('should handle error on registerDevice', async () => {
        spyOn(store as any, 'ensureDeviceTypesLoaded').and.returnValue(Promise.resolve());
        spyOn(store as any, 'getDeviceByUuid').and.returnValue(Promise.resolve(null));
        const http = TestBed.inject<any>(require('@angular/common/http').HttpClient);
        spyOn(http, 'post').and.callFake(() => { throw new Error('fail'); });
        spyOn(store['logger'], 'error');
        try {
            await store.registerDevice();
        } catch (e) {
            expect(store['logger'].error).toHaveBeenCalled();
        }
    });
});
*/
