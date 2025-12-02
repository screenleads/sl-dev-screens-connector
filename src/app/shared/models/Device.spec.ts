import { Device } from './Device';
import { DeviceType } from './DeviceType';

describe('Device model', () => {
    it('should create a valid Device object', () => {
        const type: DeviceType = { id: 1, type: 'tv' };
        const device: Device = {
            id: 1,
            uuid: 'abc-123',
            type,
            descriptionName: 'Sala',
            width: 1920,
            height: 1080,
            company: undefined
        };
        expect(device.id).toBe(1);
        expect(device.type.type).toBe('tv');
        expect(device.width).toBe(1920);
        expect(device.descriptionName).toBe('Sala');
    });

    it('should set and get properties', () => {
        const device: Device = {
            id: 0,
            uuid: '',
            type: { id: 0, type: '' },
            descriptionName: '',
            width: 0,
            height: 0,
            company: undefined
        };
        device.id = 2;
        device.uuid = 'def-456';
        device.descriptionName = 'Oficina';
        device.width = 1280;
        device.height = 720;
        expect(device.id).toBe(2);
        expect(device.uuid).toBe('def-456');
        expect(device.descriptionName).toBe('Oficina');
        expect(device.width).toBe(1280);
        expect(device.height).toBe(720);
    });

    it('should handle type and company', () => {
        const type: DeviceType = { id: 3, type: 'tablet' };
        const company = { id: 5, name: 'TestCo', observations: '', logo: null } as any;
        const device: Device = {
            id: 0,
            uuid: '',
            type: { id: 0, type: '' },
            descriptionName: '',
            width: 0,
            height: 0,
            company: undefined
        };
        device.type = type;
        device.company = company;
        expect(device.type).toEqual(type);
        expect(device.company).toEqual(company);
    });

    it('should handle edge and empty values', () => {
        const device: Device = {
            id: -1,
            uuid: '',
            type: { id: -1, type: '' },
            descriptionName: undefined,
            width: undefined,
            height: undefined,
            company: undefined
        };
        expect(device.id).toBeLessThan(0);
        expect(device.type.id).toBeLessThan(0);
        expect(device.descriptionName).toBeUndefined();
        expect(device.width).toBeUndefined();
        expect(device.height).toBeUndefined();
        expect(device.company).toBeUndefined();
    });

    it('should set and get optional properties', () => {
        const device: Device = {
            id: 10,
            uuid: 'xyz-789',
            type: { id: 2, type: 'phone' },
            descriptionName: undefined,
            width: undefined,
            height: undefined,
            company: undefined
        };
        device.descriptionName = 'Lobby';
        device.width = 800;
        device.height = 600;
        expect(device.descriptionName).toBe('Lobby');
        expect(device.width).toBe(800);
        expect(device.height).toBe(600);
    });
});
