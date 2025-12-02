import { DeviceType } from './DeviceType';

describe('DeviceType model', () => {
    it('should create a valid DeviceType object', () => {
        const type: DeviceType = { id: 1, type: 'tv' };
        expect(type.id).toBe(1);
        expect(type.type).toBe('tv');
    });

    it('should set and get properties', () => {
        const type: DeviceType = { id: 0, type: '' };
        type.id = 2;
        type.type = 'tablet';
        expect(type.id).toBe(2);
        expect(type.type).toBe('tablet');
    });

    it('should handle edge and empty values', () => {
        const type: DeviceType = { id: -1, type: '', description: undefined };
        expect(type.id).toBeLessThan(0);
        expect(type.type).toBe('');
        expect(type.description).toBeUndefined();
    });

    it('should set and get description', () => {
        const type: DeviceType = { id: 3, type: 'phone', description: 'Mobile device' };
        expect(type.description).toBe('Mobile device');
        type.description = 'Updated description';
        expect(type.description).toBe('Updated description');
    });
});
