/*
import { TestBed } from '@angular/core/testing';
import { WebsocketEventHandlerService } from './websocket-event-handler.service';

describe('WebsocketEventHandlerService', () => {
    let service: WebsocketEventHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WebsocketEventHandlerService]
        });
        service = TestBed.inject(WebsocketEventHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        // const store = TestBed.inject<any>(require('src/app/stores/webscoket.store').WebsocketStateStore);

    it('should process REFRESH_ADS message and call wallSync.triggerRefresh', () => {
        const wallSync = { triggerRefresh: jasmine.createSpy('triggerRefresh') };
                    // const store = TestBed.inject<any>(require('src/app/stores/webscoket.store').WebsocketStateStore);
        const store = TestBed.inject<any>(require('src/app/stores/webscoket.store').WebsocketStateStore);
        store.messages = () => ([{ id: '1', type: 'REFRESH_ADS', message: '', senderId: '', timestamp: Date.now() }]);
        // Re-create service to trigger effect
        // const auth = TestBed.inject<any>(require('src/app/stores/auth.store').AuthStore);
        // const router = TestBed.inject<any>(require('@angular/router').Router);
                    // const store = TestBed.inject<any>(require('src/app/stores/webscoket.store').WebsocketStateStore);

    it('should process RESTART_APP message and call auth.logout and router.navigateByUrl', () => {
                    // const auth = TestBed.inject<any>(require('src/app/stores/auth.store').AuthStore);
                    // const router = TestBed.inject<any>(require('@angular/router').Router);
        spyOn(auth, 'logout');
        spyOn(router, 'navigateByUrl');
        const store = TestBed.inject<any>(require('src/app/stores/webscoket.store').WebsocketStateStore);
                    // const auth = TestBed.inject<any>(require('src/app/stores/auth.store').AuthStore);
                    // const router = TestBed.inject<any>(require('@angular/router').Router);
        const s = new WebsocketEventHandlerService();
        expect(auth.logout).toHaveBeenCalled();
                    // const store = TestBed.inject<any>(require('src/app/stores/webscoket.store').WebsocketStateStore);
        // const store = TestBed.inject<any>(require('src/app/stores/webscoket.store').WebsocketStateStore);

    it('should process MAINTENANCE_MODE message and call enableMaintenanceMode', () => {
        const serviceInstance = TestBed.inject(WebsocketEventHandlerService);
        spyOn(serviceInstance as any, 'enableMaintenanceMode');
        const store = TestBed.inject<any>(require('src/app/stores/webscoket.store').WebsocketStateStore);
        store.messages = () => ([{ id: '3', type: 'MAINTENANCE_MODE', message: '', senderId: '', timestamp: Date.now() }]);
        // Re-create service to trigger effect
        // const store = TestBed.inject<any>(require('src/app/stores/webscoket.store').WebsocketStateStore);
        expect((s as any).enableMaintenanceMode).toHaveBeenCalled();
    });
                    // const store = TestBed.inject<any>(require('src/app/stores/webscoket.store').WebsocketStateStore);
    // it('should reset processed set and lastIndex when messages shrink', () => {
    //     const store = TestBed.inject<any>(require('src/app/stores/webscoket.store').WebsocketStateStore);
    //     // First, fill with two messages
    //     store.messages = () => ([{ id: '1', type: 'REFRESH_ADS', message: '', senderId: '', timestamp: Date.now() }, { id: '2', type: 'RESTART_APP', message: '', senderId: '', timestamp: Date.now() }]);
    //     let s = new WebsocketEventHandlerService();
    //     // Now shrink
    //     store.messages = () => ([]);
    //     s = new WebsocketEventHandlerService();
    //     expect((s as any).lastIndex).toBe(-1);
    //     expect((s as any).processed.size).toBe(0);
    // });
*/
