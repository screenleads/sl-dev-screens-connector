import { AppVersion } from './AppVersion';

describe('AppVersion model', () => {
    it('should create a valid AppVersion object', () => {
        const version: AppVersion = {
            id: 1,
            platform: 'android',
            version: '1.0.0',
            message: 'Update available',
            url: 'https://example.com/app.apk',
            forceUpdate: true
        };
        expect(version.id).toBe(1);
        expect(version.platform).toBe('android');
        expect(version.version).toBe('1.0.0');
        expect(version.message).toBe('Update available');
        expect(version.url).toBe('https://example.com/app.apk');
        expect(version.forceUpdate).toBeTrue();
    });

    it('should set and get properties', () => {
        const version: AppVersion = { id: 0, platform: '', version: '', message: '', url: '', forceUpdate: false };
        version.id = 2;
        version.platform = 'ios';
        version.version = '2.0.0';
        version.message = 'Critical update';
        version.url = 'https://example.com/app2.apk';
        version.forceUpdate = false;
        expect(version.id).toBe(2);
        expect(version.platform).toBe('ios');
        expect(version.version).toBe('2.0.0');
        expect(version.message).toBe('Critical update');
        expect(version.url).toBe('https://example.com/app2.apk');
        expect(version.forceUpdate).toBeFalse();
    });

    it('should handle empty and edge values', () => {
        const version: AppVersion = { id: -1, platform: '', version: '', message: '', url: '', forceUpdate: false };
        expect(version.id).toBeLessThan(0);
        expect(version.platform).toBe('');
        expect(version.version).toBe('');
        expect(version.message).toBe('');
        expect(version.url).toBe('');
        expect(version.forceUpdate).toBeFalse();
    });

    it('should enforce type safety', () => {
        const version: AppVersion = {
            id: 123,
            platform: 'android',
            version: '3.0.0',
            message: 'Type test',
            url: 'https://example.com/app3.apk',
            forceUpdate: true
        };
        expect(typeof version.id).toBe('number');
        expect(typeof version.platform).toBe('string');
        expect(typeof version.version).toBe('string');
        expect(typeof version.message).toBe('string');
        expect(typeof version.url).toBe('string');
        expect(typeof version.forceUpdate).toBe('boolean');
    });
});
