/*
import { Advice } from '../../features/advices/model/Advice';

describe('Advice model', () => {
    it('should create a valid Advice object', () => {
        const advice = new Advice({ id: 1, description: 'desc', customInterval: false, interval: 10 });
        expect(advice.id).toBe(1);
        expect(advice.description).toBe('desc');
        expect(advice.customInterval).toBe(false);
        expect(advice.interval).toBe(10);
    });

    it('should set and get properties', () => {
        const advice = new Advice();
        advice.id = 2;
        advice.description = 'test';
        advice.customInterval = true;
        advice.interval = 20;
        expect(advice.id).toBe(2);
        expect(advice.description).toBe('test');
        expect(advice.customInterval).toBe(true);
        expect(advice.interval).toBe(20);
    });

    it('should handle media, promotion and visibilityRules', () => {
        const advice = new Advice();
        advice.media = { id: 1, src: 'media.mp4', type: undefined } as any;
        advice.promotion = { id: 2, legalUrl: '', url: '', description: '', templateHtml: '' } as any;
        advice.visibilityRules = [{ id: 3, day: 'MONDAY', timeRanges: [] } as any];
        expect(advice.media).toEqual({ id: 1, src: 'media.mp4', type: undefined });
        expect(advice.promotion).toEqual({ id: 2, legalUrl: '', url: '', description: '', templateHtml: '' });
        expect(advice.visibilityRules).toEqual([{ id: 3, day: 'MONDAY', timeRanges: [] }]);
    });

    it('should handle default and edge values', () => {
        const advice = new Advice();
        expect(advice.id).toBeUndefined();
        expect(advice.description).toBeUndefined();
        expect(advice.customInterval).toBeUndefined();
        expect(advice.interval).toBeUndefined();
        expect(advice.media).toBeUndefined();
        expect(advice.promotion).toBeUndefined();
        expect(advice.visibilityRules).toBeUndefined();
    });

    it('should assign properties via constructor', () => {
        const advice = new Advice({
            id: 99,
            description: 'test',
            customInterval: true,
            interval: 5,
            media: { id: 7, src: 'media2.mp4', type: undefined } as any,
            promotion: { id: 8, legalUrl: '', url: '', description: '', templateHtml: '' } as any,
            visibilityRules: [{ id: 9, day: 'MONDAY', timeRanges: [] } as any]
        });
        expect(advice.id).toBe(99);
        expect(advice.description).toBe('test');
        expect(advice.customInterval).toBe(true);
        expect(advice.interval).toBe(5);
        expect(advice.media).toEqual({ id: 7, src: 'media2.mp4', type: undefined });
        expect(advice.promotion).toEqual({ id: 8, legalUrl: '', url: '', description: '', templateHtml: '' });
        expect(advice.visibilityRules).toEqual([{ id: 9, day: 'MONDAY', timeRanges: [] }]);
    });
});
*/
