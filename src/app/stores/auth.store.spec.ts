/*
import { AuthStore } from './auth.store';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Credentials } from 'src/app/shared/models/Credentials';
import { AuthStore } from './auth.store';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Credentials } from 'src/app/shared/models/Credentials';

describe('AuthStore', () => {
    let store: AuthStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthStore]
        });
        store = TestBed.inject(AuthStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });
    
    it('should set token and user on login success', () => {
            const http = TestBed.inject<any>(HttpClient);
        spyOn(http, 'post').and.returnValue({ subscribe: ({ next }: any) => next({ accessToken: 'abc123', user: { id: 1, username: 'test', email: 'test@test.com', name: 'Test' } }) });
            // spyOn(store as any, 'decodeTokenMetadata');
            // spyOn(store as any, 'scheduleTokenCheck');
            // spyOn(store['router'], 'navigate');
            const credentials = new Credentials({ username: 'test', password: '123' });
        store.login(credentials);
        expect(store.token).toBe('abc123');
        expect(store.user()).toEqual(jasmine.objectContaining({ id: 1, username: 'test', email: 'test@test.com', name: 'Test' }));
            // expect(store['router'].navigate).toHaveBeenCalledWith(['/connect']);
    });
    
    it('should clear token and user on logout', () => {
        spyOn(store['router'], 'navigateByUrl');
        (store as any)._token.set('abc123');
        (store as any)._user.set({ id: 1, username: 'test', email: 'test@test.com', name: 'Test' });
        store.logout();
        expect(store.token).toBeNull();
        expect(store.user()).toBeNull();
        expect(store['router'].navigateByUrl).toHaveBeenCalledWith('/login');
    });
    
    it('should fetch user profile and update user', () => {
            const http = TestBed.inject<any>(HttpClient);
        spyOn(http, 'get').and.returnValue({ subscribe: ({ next }: any) => next({ id: 2, username: 'profile', email: 'profile@test.com', name: 'Profile', company: { id: 1 } }) });
        spyOn(store['logger'], 'info');
        store['fetchUserProfile']();
        expect(store.user()).toEqual(jasmine.objectContaining({ id: 2, username: 'profile', email: 'profile@test.com', name: 'Profile', company: { id: 1 } }));
        expect(store['logger'].info).toHaveBeenCalledWith('[AuthStore] Perfil cargado');
    });
    
    it('should decode token metadata without error', () => {
        const token = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60, iat: Math.floor(Date.now() / 1000) }));
        (store as any)._token.set(`header.${token}.sig`);
        spyOn(store['logger'], 'debug');
        spyOn(store['logger'], 'info');
        store['decodeTokenMetadata']();
        expect(store['logger'].debug).toHaveBeenCalled();
        expect(store['logger'].info).toHaveBeenCalled();
    });
    
    it('should handle expired token and call logout', () => {
        const now = Date.now();
        (store as any)._tokenExpiration = now - 1000;
        (store as any)._tokenIssuedAt = now - 10000;
        spyOn(store, 'logout');
        spyOn(store['logger'], 'warn');
        store['scheduleTokenCheck']();
        expect(store.logout).toHaveBeenCalled();
        expect(store['logger'].warn).toHaveBeenCalled();
    });
    
    it('should handle critical token and call refreshToken', () => {
        const now = Date.now();
        (store as any)._tokenExpiration = now + 1000;
        (store as any)._tokenIssuedAt = now - 10000;
        const refreshSpy = spyOn(AuthStore.prototype as any, 'refreshToken');
        spyOn(store['logger'], 'info');
        store['scheduleTokenCheck']();
        expect(refreshSpy).toHaveBeenCalled();
        expect(store['logger'].info).toHaveBeenCalled();
    });
    
    it('should handle login error', () => {
            const http = TestBed.inject<any>(HttpClient);
        spyOn(http, 'post').and.returnValue({ subscribe: ({ error }: any) => error('login error') });
        spyOn(store['logger'], 'error');
            const credentials = new Credentials({ username: 'fail', password: 'fail' });
        store.login(credentials);
        expect(store['logger'].error).toHaveBeenCalled();
    });
    
    it('should handle fetchUserProfile error and call logout', () => {
            const http = TestBed.inject<any>(HttpClient);
        spyOn(http, 'get').and.returnValue({ subscribe: ({ error }: any) => error('profile error') });
        spyOn(store, 'logout');
        spyOn(store['logger'], 'error');
        store['fetchUserProfile']();
        expect(store.logout).toHaveBeenCalled();
        expect(store['logger'].error).toHaveBeenCalled();
    });
*** End Patch
*/
