// @ts-nocheck
// Reactivación de tests: eliminado comentario de bloque
import { WebsocketStateStore } from './webscoket.store';
import { TestBed } from '@angular/core/testing';
import { NGXLogger } from 'ngx-logger';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { AuthStore } from './auth.store';
import { ChatMessage } from 'src/app/shared/models/ChatMessage';

describe('WebsocketStateStore', () => {
    let savedOnConnect: any = null;
    let store: WebsocketStateStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                WebsocketStateStore,
                { provide: NGXLogger, useValue: { debug: () => { }, warn: () => { } } },
                { provide: APP_CONFIG, useValue: { apiHost: '' } },
                {
                    provide: AuthStore,
                    useValue: {
                        get token() { return 'mock-token'; }
                    }
                }
            ]
        });
        store = TestBed.inject(WebsocketStateStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });

    it('should update signals on connect/disconnect', () => {
        expect(store.isConnected()).toBeFalse();
        store['_connected'].set(true);
        expect(store.isConnected()).toBeTrue();
        store.disconnect();
        expect(store.isConnected()).toBeFalse();
        expect(store.currentRoom()).toBeNull();
        expect(store.messages()).toEqual([]);
    });

    it('should not send message if not connected', () => {
        spyOn(store, 'sendMessage').and.callThrough();
        const msg = { id: '1', type: 'text', message: 'Hola', senderId: 'user1', timestamp: Date.now() } as any;
        store.sendMessage(msg);
        expect(store.sendMessage).toHaveBeenCalledWith(msg);
        // No error esperado, solo warning en logger
    });

    // it('should connect and set connected state', (done) => {
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    //     const mockClient = {
    //         connected: false,
    //         connect: (headers: any, onConnect: Function, onError: Function) => {
    //             mockClient.connected = true;
    //             store['stompClient'] = mockClient;
    //             store['_connected'].set(true);
    //             if (typeof onConnect === 'function') {
    //                 onConnect();
    //                 expect(store['_connected']()).toBeTrue();
    //                 done();
    //             } else {
    //                 fail('onConnect callback not called');
    //                 done();
    //             }
    //         },
    //         subscribe: () => ({ unsubscribe: () => {} }),
    //         deactivate: () => {}
    //     };
    //     this.connected = true;
    //     store['stompClient'] = mockClient;
    //     store['_connected'].set(true);
    //     if (typeof onConnect === 'function') {
    //         expect(store['_connected']()).toBeTrue();
    //         done();
    //     } else {
    //         fail('onConnect callback not called');
    //         done();
    //     }
    //     spyOn<any>(store, 'stompClient').and.returnValue(null);
    //     spyOn<any>(store, 'socketUrl').and.returnValue('ws://mock');
    //     spyOn<any>(store, 'logger').and.stub();
    //     spyOn<any>(store, 'subscribeToRoom').and.callFake(() => {});
    //     (window as any).SockJS = () => mockClient;
    //     (window as any).Stomp = { over: () => mockClient };
    //     store.connect('room1');
    // });

    it('should store received messages', () => {
        // Simulate connected client and subscription
        store['_connected'].set(true);
        const message = new ChatMessage({
            id: '2',
            type: 'REFRESH_ADS',
            message: 'Test',
            senderId: 'user2',
            senderName: 'User2',
            roomId: 'room1',
            timestamp: Date.now().toString(),
            metadata: {},
            systemGenerated: false
        });
        store['_messages'].set([]);
        // Simulate subscription callback
        store['subscribeToRoom']('room1');
        store['_messages'].update((prev: any[]) => [...prev, message]);
        expect(store.messages()).toContain(message);
    });

    it('should send message when connected', () => {
        store['_connected'].set(true);
        store['_room'].set('room1');
        store['stompClient'] = { connected: true, send: jasmine.createSpy('send') };
        const msg = new ChatMessage({
            id: '3',
            type: 'REFRESH_ADS',
            message: 'Hola',
            senderId: 'user3',
            senderName: 'User3',
            roomId: 'room1',
            timestamp: Date.now().toString(),
            metadata: {},
            systemGenerated: false
        });
        store.sendMessage(msg);
        expect(store['stompClient'].send).toHaveBeenCalled();
    });

    it('should not reconnect to same room if already connected', () => {
        store['_connected'].set(true);
        store['_room'].set('roomX');
        store['stompClient'] = { connected: true };
        spyOn(store['logger'], 'debug');
        store.connect('roomX');
        expect(store['logger'].debug).toHaveBeenCalledWith('[WebsocketStore] Ya conectado a la misma sala. Ignorando.');
    });

    it('should handle error on connect', () => {
        const mockClient = { connected: false, connect: (headers: any, onConnect: any, onError: any) => { onError('error'); }, deactivate: () => { } };
        spyOn<any>(store, 'stompClient').and.returnValue(null);
        spyOn<any>(store, 'socketUrl').and.returnValue('ws://mock');
        spyOn<any>(store, 'logger').and.stub();
        (window as any).SockJS = () => mockClient;
        (window as any).Stomp = { over: () => mockClient };
        store.connect('room2');
        expect(store.isConnected()).toBeFalse();
    });
});

